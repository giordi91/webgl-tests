/*
 * this class is a wrapper object around a frame buffer
 * @param gl: the initialized gl context
 * @param buffer_type: the kind of buffer to use , ex gl.ARRAY_BUFFER
*/
//TODO add render buffer for z depth
function FrameBuffer(gl,width,height,z_depth)
{
    var self =this;
    this.id;
    this.gl = gl;
    self.idFrame = self.gl.createFramebuffer();
    self.z_depth = z_depth;
    if (self.z_depth)
    {
        self.idRender =  self.gl.createRenderbuffer(); 
    }
    self.width = width;
    self.height = height;
    
    self.tx = new Texture(self.gl,null,0);
    self.tx.init_empty(self.width, self.height);
    
    this.init = function()
    {
        self.tx.bind(); 
        self.bindFrame();
        self.idFrame.width = self.width;
        self.idFrame.height= self.height;
        
        if(self.z_depth)
        {
            self.bindRender();
            self.__check_error();
            self.gl.renderbufferStorage(self.gl.RENDERBUFFER, self.gl.DEPTH_COMPONENT16, 
                    self.width, self.height);
            self.__check_error();
        }
        self.gl.framebufferTexture2D(self.gl.FRAMEBUFFER, self.gl.COLOR_ATTACHMENT0,
                self.gl.TEXTURE_2D, self.tx.id,0);

        if(self.z_depth)
        {
            self.gl.framebufferRenderbuffer(self.gl.FRAMEBUFFER, self.gl.DEPTH_ATTACHMENT,
                    self.gl.RENDERBUFFER, self.idRender);
            self.__check_error();
        }
    }  

    /*
     * This function binds the buffer
     */
    this.bind = function()
    {
        self.tx.bind();
        self.bindFrame();
        if (self.z_depth)
        {
            self.bindRender();
        }
    }
    this.bindFrame = function()
    {
        self.gl.bindFramebuffer(self.gl.FRAMEBUFFER, self.idFrame);
    }
    
    this.bindRender = function()
    {
        self.gl.bindRenderbuffer(self.gl.RENDERBUFFER, self.idRender);
        self.__check_error(); 
    }
    
    this.is_complete = function()
    {
        self.bindFrame();
        if (self.z_depth)
        {
            self.bindRender();
        }
        var stat = self.gl.checkFramebufferStatus(self.gl.FRAMEBUFFER);
        self.__check_error();
        if (stat != self.gl.FRAMEBUFFER_COMPLETE)
        {
            console.warn('Frame buffrer not complete',stat);
        }
    }
    
    this.unbind = function()
    {
        self.tx.unbind();
        self.gl.bindFramebuffer(self.gl.FRAMEBUFFER,null);
        if (self.z_depth)
        {
            self.bindRender();
        }
    }
    
    this.__check_error = function()
    {
        var e = self.gl.getError();
        if(e != self.gl.NO_ERROR)
        {
            console.log("Framebuffer is not complete:",e);
        }
    }    
}
