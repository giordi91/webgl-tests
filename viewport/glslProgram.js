

function GLSLProgram(gl)
{
    var self = this;
    self.gl = gl;
    self.program;

    this.init = function ()
    {
        self.program = gl.createProgram();
    }

    this.__loadFileAJAX = function (name) 
    {
        var xhr = new XMLHttpRequest(),
            okStatus = document.location.protocol === "file:" ? 0 : 200;
        xhr.open('GET', name, false);
        xhr.send(null);
        return xhr.status == okStatus ? xhr.responseText : null;
    };

    this.loadShader = function (path, type)
    {
        var shdId = self.__getShader(path, type);
        self.gl.attachShader(self.program, shdId);
        //gl.linkProgram(program);
    }

    this.__getShader = function ( shaderName, type) {
        var shader = self.gl.createShader(type),
            shaderScript = self.__loadFileAJAX(shaderName);
        if (!shaderScript) {
            alert("Could not find shader source: "+shaderName);
        }
        self.gl.shaderSource(shader, shaderScript);
        self.gl.compileShader(shader);

        if (!self.gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(self.gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    this.link = function()
    {
        self.gl.linkProgram(self.program);
        if (!self.gl.getProgramParameter(self.program, gl.LINK_STATUS)) 
        {
            var lastError = self.gl.getProgramInfoLog(self.program);
            alert("Could not initialise shaders: " + lastError);
            return null;
        }
        
    }

    this.use = function()
    {
        self.gl.useProgram(self.program);
    }

    this.get = function()
    {
       return self.program; 
    }


}
