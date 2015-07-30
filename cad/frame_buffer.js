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
    self.tx = new Texture(self.gl,null,0);
    self.tx.init2(self.width, self.height);
    
    this.init = function()
    {
        self.tx.bind(); 
        self.bindFrame();
        self.gl.framebufferTexture2D(self.gl.FRAMEBUFFER, self.gl.COLOR_ATTACHMENT0,
                self.gl.TEXTURE_2D, self.tx.id,0);
        //self.bindRender();
        //self.gl.renderbufferStorage(self.type, self.gl.DEPTH_COMPONENT16,
         //      self.width,self.height); 
        //self.__check_error(); 
        //self.gl.framebufferRenderbuffer(self.gl.FRAMEBUFFER, self.gl.DEPTH_ATTACHMENT,
         //       self.type, self.idRender);
       // self.__check_error(); 
    }  

    /*
     * This function binds the buffer
     */
    this.bind = function()
    {
        self.tx.bind();
        self.bindFrame();
        //self.bindRender();
    }
    this.bindFrame = function()
    {
        self.gl.bindFramebuffer(self.gl.FRAMEBUFFER, self.idFrame);
        self.idFrame.width = self.width;
        self.idFrame.height= self.height;
    }
    
    this.bindRender = function()
    {
        self.gl.bindRenderbuffer(self.type, self.idRender);
        self.__check_error(); 
    }
    
    this.is_complete = function()
    {
        self.bindFrame();
        //self.bindRender();
        var stat = self.gl.checkFramebufferStatus(self.gl.FRAMEBUFFER);
        self.__check_error();
        if (stat != self.gl.FRAMEBUFFER_COMPLETE)
        {
            console.warn('Frame buffrer not complete',stat);
        }
    }
    this.unbind = function()
    {
        self.gl.bindFramebuffer(self.gl.FRAMEBUFFER,null);
        self.gl.bindRenderbuffer(self.type,null);
        self.tx.unbind();
    }
    
    this.__check_error = function()
    {
        var e = self.gl.getError();
        if(e != self.gl.NO_ERROR)
        {
            console.log("errrorrrrr",e);
        }
    }    
}
