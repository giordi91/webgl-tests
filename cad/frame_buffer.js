/*
 * this class is a wrapper object around a render buffer
 * @param gl: the initialized gl context
 * @param buffer_type: the kind of buffer to use , ex gl.ARRAY_BUFFER
*/
function RenderBuffer(gl,width,height )
{
    var self =this;
    this.id;
    this.gl = gl;
    self.idFrame = self.gl.createFramebuffer();
    self.idRender =  self.gl.createRenderbuffer(); 
    self.type = gl.RENDERBUFFER;
    self.width = width;
    self.height = height;
    
    this.init = function()
    {
        self.bindFrame();
        self.bindRender();
        self.gl.renderbufferStorage(self.type, self.gl.DEPTH_COMPONENT16,
               self.width,self.height); 
    }  

    /*
     * This function binds the buffer
     */
    this.bindFrame = function()
    {
        self.gl.bindFramebuffer(self.gl.FRAMEBUFFER, self.idFrame);
        self.idFrame.width = self.width;
        self.idFrame.height= self.height;
    }

    this.bindRender = function()
    {
        self.gl.bindRenderbuffer(self.type, self.idRender);
        self.gl.framebufferRenderbuffer(self.gl.FRAMEBUFFER, self.gl.DEPTH_ATTACHMENT,
                self.type, self.idRender);
    }
    
    this.is_complete = function()
    {
        self.bindFrame();
        self.bindRender();
        var stat = self.gl.checkFramebufferStatus(self.gl.FRAMEBUFFER);
        if (stat != self.gl.FRAMEBUFFER_COMPLETE)
        {
            console.warn('Frame buffrer not complete',stat);
        }
    }
    this.unbind = function()
    {
        self.gl.bindFramebuffer(self.gl.FRAMEBUFFER,null);
        self.gl.bindRenderbuffer(self.type,null);
    }
    
    /*
     * This function is used to upload the data on the buffer
     * Should be of tipe Float32Array or UInt16Array etc
     */
    /*
    this.upload = function(data,debug)
    {
            self.bind();
            self.gl.bufferData( self.type, 
                                flatten(data), 
                                self.gl.STATIC_DRAW );
            var  error = self.gl.getError();
            if(error)
            {
                console.log("ERROR IN UPLOADING DATA: " + debug);
            }
    }
    */ 
    /*
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
        
    }*/
}
