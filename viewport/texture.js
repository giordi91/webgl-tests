

function Texture(gl, path)
{
    var self = this;
    self.gl=gl;
    self.path = path;
    self.id;
    self.img;
    self.loaded = false;
    this.init = function ()
    {
     self.id= gl.createTexture();
      self.img = new Image();
      self.img.onload =  function() {self.__proces_img()};
      self.img.src = self.path;
    }

    this.__proces_img = function()
    {
        self.bind(); 
        self.gl.texImage2D(self.gl.TEXTURE_2D, 0, self.gl.RGBA, gl.RGBA, self.gl.UNSIGNED_BYTE, self.img);
        self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_MAG_FILTER, self.gl.LINEAR);
        self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_MIN_FILTER, self.gl.LINEAR_MIPMAP_NEAREST);
        self.gl.generateMipmap(self.gl.TEXTURE_2D);
        self.gl.activeTexture(self.gl.TEXTURE0);
        self.loaded=true;
    }

    this.bind = function ()
    {
        self.gl.bindTexture(self.gl.TEXTURE_2D, self.id);
    }



}
