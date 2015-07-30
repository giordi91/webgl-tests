

function Texture(gl, path, textureId)
{
    var self = this;
    self.gl=gl;
    self.path = path;
    self.id;
    self.img;
    self.loaded = false;
    self.textureId = textureId
    this.init = function ()
    {
     self.id= gl.createTexture();
      if (self.path != null)
      {
      self.img = new Image();
      self.img.onload =  function() {self.__proces_img()};
      self.img.src = self.path;
      }
      else
      {
      
      }
      }
    this.init2 = function(width ,height)
    {
        self.id= gl.createTexture();
        self.bind();
        self.gl.texImage2D(self.gl.TEXTURE_2D, 0, self.gl.RGBA, width, height,
                   0, self.gl.RGBA, self.gl.UNSIGNED_BYTE, null);
        self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_MAG_FILTER, self.gl.LINEAR);
        self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_MIN_FILTER, self.gl.LINEAR_MIPMAP_NEAREST);
        self.gl.bindTexture(gl.TEXTURE_2D, null);
        //self.gl.generateMipmap(self.gl.TEXTURE_2D);
        self.unbind();
    
    }
    this.__proces_img = function()
    {
        self.bind(); 
        self.gl.texImage2D(self.gl.TEXTURE_2D, 0, self.gl.RGBA, gl.RGBA, self.gl.UNSIGNED_BYTE, self.img);
        self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_MAG_FILTER, self.gl.LINEAR);
        self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_MIN_FILTER, self.gl.LINEAR_MIPMAP_NEAREST);
        self.gl.generateMipmap(self.gl.TEXTURE_2D);
        
        self.loaded=true;
    }

    this.bind = function ()
    {
        self.gl.activeTexture(self.gl.TEXTURE0 +self.textureId);
        self.gl.bindTexture(self.gl.TEXTURE_2D, self.id);
    }
    this.unbind = function()
    {
        self.gl.bindTexture(self.gl.TEXTURE_2D,null);
    }


}
