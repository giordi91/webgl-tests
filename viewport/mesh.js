
function Mesh(gl, program, programBasic)
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
    self.programBasic;

    //debug drawing
    self.__draw_tangents = false;
    self.__debug_tangents_u =null;
    self.__debug_tangents_v =null;

    if (programBasic)
    {
        self.programBasic = programBasic;
    }


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
        self.draw_tangents(true,1.0);
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

            if (self.__draw_tangents)
            {
                self.programBasic.use(); 
                var vPosition = self.program.getAttribLocation( "vPosition" );
                self.gl.enableVertexAttribArray( vPosition );
                
                self.__debug_tangents_u.bind();
                self.gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
                self.programBasic.setUniform4f("color",[1.0,0,0,1]);
                self.gl.drawArrays(gl.LINES,0,self.vertices().length/3*2);
                
                self.__debug_tangents_v.bind();
                self.gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
                self.programBasic.setUniform4f("color",[0,0,1.0,1]);
                self.gl.drawArrays(gl.LINES,0,self.vertices().length/3*2);
                
                self.program.use();
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
        //we declare all the variables upfront to avoid keeping allocating memory
        //inside the loop
        //short hand variables for the indices 
        var id1,id2,id3;
        //short hand variables for the vertices of the triangle
        var v1,v2,v3;
        //delta vectors of the triangle
        var d1,d2;
        //uvs and delta uvs variables
        var uv1, uv2,uv3;
        var dUv1, dUv2;
        //matrix variables
        var qmat,inv;
        //final normal tangetns variables
        var vnorm,unorm;
        
        //matrix mult variables
        var temp;
        var accum;
        
        //short hand for the data  
        var indices = self.indices(); 
        var uvs= self.uvs(); 
        var v = self.vertices();
    
        //allocating upfront the needed space for the tangents rather then keep pushing in 
        //the array
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

            //uvs
            uv1 = [uvs[id1*2], uvs[id1*2+1]]; 
            uv2 = [uvs[id2*2], uvs[id2*2+1]]; 
            uv3 = [uvs[id3*2], uvs[id3*2+1]]; 

            //delta uvs
            dUv1 = [uv2[0] - uv1[0], uv2[1] - uv1[1]] ;
            dUv2 = [uv3[0] - uv1[0], uv3[1] - uv1[1]] ;

            //preparing the inverse matrix and delta matrix
            inv = [[dUv2[1],-dUv1[1]],[-dUv2[0], dUv1[0]]];
            qmat = [d1,d2];
            
            //manually computing the matrix mult, no fucking package allowed a
            //2x2 * 3x2 matrix
            res= [[0,0,0],[0,0,0]]; 
            for(r =0; r <2; r++)
            {
                temp=[0,0,0];
                for (c=0; c<3; c++)
                {
                   accum =0;
                    for (sr =0; sr<2;sr++)
                   {
                        accum += inv[r][sr] * qmat[sr][c];   
                   }
                temp[c] = accum;
                }
                res[r]= temp;

            }

            //noramlizing the tangents
            unorm = normalize(res[0]);
            vnorm = normalize(res[1]);
            //storing the data in the appropriate buffer position 
            self.u_tans[id1*3] = unorm[0];
            self.u_tans[id1*3+1] = unorm[1];
            self.u_tans[id1*3+2] = unorm[2];
            
            self.v_tans[id1*3] = vnorm[0];
            self.v_tans[id1*3+1] = vnorm[1];
            self.v_tans[id1*3+2] = vnorm[2];
        } 

        var t1 = performance.now(); 
        console.log("Computing tangets took " + (t1 - t0) + " milliseconds.");
    }

    this.draw_tangents = function(drawIt, size)
    {
        self.__draw_tangents = drawIt;
        if (drawIt)
        {
            //create the buffers
            self.__debug_tangents_u = new Buffer(self.gl, self.gl.ARRAY_BUFFER);
            self.__debug_tangents_v = new Buffer(self.gl, self.gl.ARRAY_BUFFER);
            //generate temp buffer for debugging, here we need to generate lines,
            //composed of vertex position and vertex+tangent
            var temp_u=[];
            var temp_v=[];
            var v = self.vertices();
            //we are going to offset the vector along the normal in order
            //to minimize the zbuffer fight
            var n = self.normals();
            NORMAL_OFFSET = 0.2; 
            
            for (var i=0; i<v.length;i+=3)
            {
                temp_u.push(v[i]+ n[i]*NORMAL_OFFSET,
                        v[i+1]+ n[i+1]*NORMAL_OFFSET,
                        v[i+2]+ n[i+2]*NORMAL_OFFSET,
                        v[i] +self.u_tans[i] + n[i]*NORMAL_OFFSET,
                        v[i+1] +self.u_tans[i+1]+ n[i+1]*NORMAL_OFFSET,
                        v[i+2] +self.u_tans[i+2]+ n[i+2]*NORMAL_OFFSET); 
                
                temp_v.push(v[i]+ n[i]*NORMAL_OFFSET,
                        v[i+1]+ n[i+1]*NORMAL_OFFSET,
                        v[i+2]+ n[i+2]*NORMAL_OFFSET,
                        v[i] +self.v_tans[i] + n[i]*NORMAL_OFFSET,
                        v[i+1] +self.v_tans[i+1]+ n[i+1]*NORMAL_OFFSET,
                        v[i+2] +self.v_tans[i+2]+ n[i+2]*NORMAL_OFFSET); 
            }

            self.__debug_tangents_u.bind();
            self.__debug_tangents_u.upload(temp_u);
            
            self.__debug_tangents_v.bind();
            self.__debug_tangents_v.upload(temp_v);

        }
        else
        {
            //if we are setting it off we are going to clean up after ourself,
            //we delete this buffer because it s useless data, it was formatted
            //specifically for debug drawing so no need to keep it there
            if (self.__debug_tangents_u)
            {
                self.gl.deleteBuffer(self.__debug_tangents_u);
                self.__debug_tangents_u = null;
            }

            if (self.__debug_tangents_v)
            {
                self.gl.deleteBuffer(self.__debug_tangents_v);
                self.__debug_tangents_v = null;
            }
        }  

    }

}
