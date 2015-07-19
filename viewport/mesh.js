

function Mesh(gl, program)
{
    var self = this;
    self.gl = gl;
    self.program  = program;
    self.vbo= new Buffer(self.gl, self.gl.ARRAY_BUFFER);
    self.nbo= new Buffer(self.gl, self.gl.ARRAY_BUFFER  );
    self.idxbo= new Buffer(self.gl,self.gl.ELEMENT_ARRAY_BUFFER);
    self.uvbo= new Buffer(self.gl, self.gl.ARRAY_BUFFER);
    self.model_loaded = false;
    self.texture_loaded= false;
    self.meshes={};
    self.idx_size;

    this.load_obj = function (path)
    {
    
        OBJ.downloadMeshes({"mesh":path},self.__procesObjData,self.meshes);
    }

    this.__procesObjData = function()
    {
        self.program.use();
        console.log("loaded");
        var m = self.meshes["mesh"];
        self.vbo.bind();
        self.vbo.upload(m.vertices);
        vtx_size = m.vertices.length;

        self.nbo.bind()
        self.nbo.upload(m.vertexNormals);
        
        //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,idxbo);
        self.idxbo.bind();
        self.idx_size = m.indices.length;
        self.idxbo.uploadUInt16(m.indices); 
        
        
        //gl.bindBuffer(gl.ARRAY_BUFFER,uvbo);
        //gl.bufferData(gl.ARRAY_BUFFER,flatten(m.textures),gl.STATIC_DRAW);
        self.uvbo.bind();
        self.uvbo.upload(m.textures);
        self.model_loaded = true;
    }

    this.draw = function()
    {
        
        if(self.model_loaded)
        {
            self.program.use();
            self.vbo.bind();
            //var vPosition = gl.getAttribLocation( program.get(), "vPosition" );
            var vPosition = self.program.getAttribLocation( "vPosition" );
            self.gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
            self.gl.enableVertexAttribArray( vPosition );
            
            self.nbo.bind();
            var vNormal= self.program.getAttribLocation( "vNormal" );
            //var vNormal = gl.getAttribLocation( program.get(), "vNormal" );
            self.gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
            self.gl.enableVertexAttribArray( vNormal );

            if (self.texture_loaded)
            {
                gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
                gl.bindBuffer(gl.ARRAY_BUFFER, uvbo);
                var vUV = gl.getAttribLocation( program.get(), "vUV" );
                gl.vertexAttribPointer( vUV,2, gl.FLOAT, false, 0, 0 );
                gl.enableVertexAttribArray( vUV);
            }
            self.idxbo.bind();
            self.gl.drawElements(gl.TRIANGLES,self.idx_size, gl.UNSIGNED_SHORT,0);
            self.gl.disableVertexAttribArray(vNormal);

            if (self.texture_loaded)
            {
                gl.disableVertexAttribArray(vUV);
            }
        }

    }
}
