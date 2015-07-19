/*
 * this class is a wrapper object around a vertex buffer
 * @param gl: the initialized gl context
 * @param buffer_type: the kind of buffer to use , ex gl.ARRAY_BUFFER
*/
function Buffer(gl, buffer_type)
{
    var self =this;
    this.id;
    this.gl = gl;
    self.id =  gl.createBuffer(); 
    self.type = buffer_type;

    /*
     * This function binds the buffer
     */
    this.bind = function()
    {
        self.gl.bindBuffer(self.type, self.id);
    }

    /*
     * This function is used to upload the data on the buffer
     * Should be of tipe Float32Array or UInt16Array etc
     */
    this.upload = function(data)
    {
        self.bind();
        self.gl.bufferData( self.type, 
                            flatten(data), 
                            self.gl.STATIC_DRAW );
        if(self.gl.getError())
        {
            console.log("ERROR IN UPLOADING DATA: " + self.type);
        } 
    }
    
    this.uploadUInt16 = function(data)
    {
        //lets flatten it up as array Uint16
        var idx_size = data.length;
        var data16 = new Uint16Array(idx_size);
        for(i=0; i<idx_size;i++)
        {
            data16[i] = data[i];
        }
        self.bind();
        self.gl.bufferData( self.type, 
                            data16, 
                            self.gl.STATIC_DRAW );
        if(self.gl.getError())
        {
            console.log("ERROR IN UPLOADING DATA: " + self.type);
        } 
        
    }
}

