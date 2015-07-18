
function VertexBuffer(gl, buffer_type)
{
    var self =this;
    this.id;
    this.gl = gl;
    self.id =  gl.createBuffer(); 
    self.type = buffer_type;

    this.bind = function()
    {
        self.gl.bindBuffer(self.type, self.id);
    }

    this.upload = function(data)
    {
        self.bind();
        self.gl.bufferData( self.type, 
                            flatten(data), 
                            self.gl.STATIC_DRAW );
    }
}

