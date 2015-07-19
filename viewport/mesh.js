
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
    self.meshes={};
    self.idx_size;
    self.color_t = null;

    this.load_obj = function (path)
    {
    
        self.__spinner = new Spinner({scale:4, color: '#000000', lines:10});
        self.__spinner.spin();
        document.body.appendChild(self.__spinner.el);
        OBJ.downloadMeshes({"mesh":path},self.__procesObjData,self.meshes);
    }

    this.__procesObjData = function()
    {
        self.program.use();
        var m = self.meshes["mesh"];
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
                gl.disableVertexAttribArray(vUV);
            }
        }

    }
}
