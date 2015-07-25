
function Mesh(gl, program)
{
    var self = this;
    self.gl = gl;
    self.program  = program;
    self.vbo= new Buffer(self.gl, self.gl.ARRAY_BUFFER);
    self.nbo= new Buffer(self.gl, self.gl.ARRAY_BUFFER  );
    self.idxbo= new Buffer(self.gl,self.gl.ELEMENT_ARRAY_BUFFER);
    self.uvbo= new Buffer(self.gl, self.gl.ARRAY_BUFFER);
    self.u_tans_bo= new Buffer(self.gl, self.gl.ARRAY_BUFFER);
    self.model_loaded = false;
    self.__meshes={};
    self.idx_size;
    self.color_t = null;
    self.u_tans=null;
    self.v_tans=null;


    this.load_obj = function (path)
    {
    
        self.__spinner = new Spinner({scale:4, color: '#000000', lines:10});
        self.__spinner.spin();
        document.body.appendChild(self.__spinner.el);
        OBJ.downloadMeshes({"mesh":path},self.__procesObjData,self.__meshes);
    }

    this.__procesObjData = function()
    {
        self.program.use();
        var m = self.__meshes["mesh"];
        self.vbo.bind();
        self.vbo.upload(m.vertices);
        vtx_size = m.vertices.length;

        self.nbo.bind()
        self.nbo.upload(m.vertexNormals);
        
        self.idxbo.bind();
        self.idx_size = m.indices.length;
        self.idxbo.uploadUInt16(m.indices); 
        
        self.uvbo.bind();
        self.uvbo.upload(m.textures);
        self.model_loaded = true;
        self.__spinner.stop();

        self.compute_tangets();
    }

    this.load_color_texture = function(path)
    {   
        self.color_t = new Texture(self.gl, path);
        self.color_t.init(); 

    }

    this.draw = function()
    {
        
        if(self.model_loaded)
        {
            self.vbo.bind();
            var vPosition = self.program.getAttribLocation( "vPosition" );
            self.gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
            self.gl.enableVertexAttribArray( vPosition );
            
            self.nbo.bind();
            var vNormal= self.program.getAttribLocation( "vNormal" );
            self.gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
            self.gl.enableVertexAttribArray( vNormal );

            if (self.color_t && self.color_t.loaded)
            {
                self.color_t.bind();
                self.uvbo.bind();
                var vUV = self.program.getAttribLocation( "vUV" );
                self.gl.vertexAttribPointer( vUV,2, gl.FLOAT, false, 0, 0 );
                self.gl.enableVertexAttribArray( vUV);
            }
            
            self.idxbo.bind();
            self.gl.drawElements(gl.TRIANGLES,self.idx_size, gl.UNSIGNED_SHORT,0);
            self.gl.disableVertexAttribArray(vNormal);

            if (self.texture_loaded)
            {
                self.gl.disableVertexAttribArray(vUV);
            }

            if (self.u_tans)
            {
                
                self.gl.disableVertexAttribArray("vNormal");
                self.gl.disableVertexAttribArray("vUV");
                self.u_tans_bo.bind();
                var vPosition = self.program.getAttribLocation( "vPosition" );
                self.gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
                self.gl.enableVertexAttribArray( vPosition );
                self.gl.drawArrays(gl.POINTS,0,self.vertices().length/2);
            }
        }

    }
    this.vertices = function()
    {
        return self.__meshes["mesh"].vertices;
    }

    this.indices= function()
    {
        return self.__meshes["mesh"].indices;
    }
    this.normals= function()
    {
        return self.__meshes["mesh"].vertexNormals;
    }
    this.uvs= function()
    {
        return self.__meshes["mesh"].textures;
    }

    this.compute_tangets = function()
    {
        var t0 = performance.now();
        var id1,id2,id3;
        var v1,v2,v3;
        var d1,d2;
        var uv1, uv2,uv3;
        var dUv1, dUv2;
        var indices = self.indices(); 
        console.log(indices);
        var uvs= self.uvs(); 
        var v = self.vertices();
        var qmat,inv;
        var vnorm,unorm;
        self.u_tans = Array.apply(null, Array(v.length)).map(Number.prototype.valueOf,0);
        self.v_tans = Array.apply(null, Array(v.length)).map(Number.prototype.valueOf,0);
        
        
        for(var i=0; i<self.__meshes["mesh"].indices.length/3;i++)
        {

            //looping each triangle in order to compute its tangent 
            id1= indices[3*i]; 
            id2= indices[3*i +1]; 
            id3= indices[3*i+2]; 

            //getting vectors
            v1 = [ v[id1*3] , v[(id1*3)+1], v[(id1*3)+2]]; 
            v2 = [ v[id2*3] , v[(id2*3)+1], v[(id2*3)+2]]; 
            v3 = [ v[id3*3] , v[(id3*3)+1], v[(id3*3)+2]]; 

            //deltas
            d1 = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]]; 
            d2 = [v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]]; 

            if(id1 == 1530)
            {
                console.log("id1 " + id1);
                console.log("id2 " + id2);
                console.log("id3 " + id3);
                console.log("v1 " + v1); 
                console.log("v2 " + v2); 
                console.log("v3 " + v3); 
                console.log("d1 " +d1);
                console.log("d2 " +d2);
            } 
            //uvs
            uv1 = [uvs[id1*2], uvs[id1*2+1]]; 
            uv2 = [uvs[id2*2], uvs[id2*2+1]]; 
            uv3 = [uvs[id3*2], uvs[id3*2+1]]; 

            //delta uvs
            dUv1 = [uv2[0] - uv1[0], uv2[1] - uv1[1]] ;
            dUv2 = [uv3[0] - uv1[0], uv3[1] - uv1[1]] ;

            //inv = [[dUv2[1],-dUv2[0]],[-dUv1[1], dUv1[0]]];
            
            inv = [[dUv2[1],-dUv1[1]],[-dUv2[0], dUv1[0]]];
            qmat = [d1,d2];
            
            //fuuuuck
            //res=  mult(qmat,inv);
            res= []; 
            
            //matrix mult
            var temp;
            var accum;
            for(r =0; r <2; r++)
            {
                temp=[]
                for (c=0; c<3; c++)
                {
                   accum =0;
                    for (sr =0; sr<2;sr++)
                   {
                        accum += inv[r][sr] * qmat[sr][c];   
                   }
                temp.push(accum);
                }
                res.push(temp);
            }


            unorm = normalize(res[0]);
            vnorm = normalize(res[1]);
            //self.u_tans[id1*3] = qmat[0][0];
            //self.u_tans[id1*3+1] = qmat[0][1];
            //self.u_tans[id1*3+2] = qmat[0][2];
            if(id1 == 1530)
            {
                console.log("uv1 " + uv1);
                console.log("uv2 " + uv2);
                console.log("uv3 " + uv3);
                console.log("duv1 " + dUv1);
                console.log("duv2 " + dUv2);
                console.log(res);
                console.log("qmat "+ qmat);
                console.log("u " +unorm);
                console.log("v " +vnorm);
            } 
            
            self.u_tans[id1*3] = unorm[0];
            self.u_tans[id1*3+1] = unorm[1];
            self.u_tans[id1*3+2] = unorm[2];
            
            self.v_tans[id1*3] = vnorm[0];
            self.v_tans[id1*3+1] = vnorm[1];
            self.v_tans[id1*3+2] = vnorm[2];
        } 

        //generate temp buffer for debugging
        var temp=[];
        for (var i=0; i<v.length;i+=3)
        {
            temp.push(v[i],v[i+1],v[i+2],
                    v[i] +self.u_tans[i],
                    v[i+1] +self.u_tans[i+1],
                    v[i+2] +self.u_tans[i+2]); 
        }

        self.u_tans_bo.bind();
        self.u_tans_bo.upload(temp);
        var t1 = performance.now(); 
        console.log("Computing tangets took " + (t1 - t0) + " milliseconds.");
    }

}
