
/*
 * This class is a wrapper class around a glsl program
 */
function GLSLProgram(gl)
{
    var self = this;
    self.gl = gl;
    self.program;
    self.__registered_resources=[];

    this.init = function ()
    {
        self.program = gl.createProgram();
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

    /*
     * This function sets the current program as active
     */
    this.use = function()
    {
        self.gl.useProgram(self.program);
    }
    
    /* Returns the opengl program object
     * @returns: program object
     */
    this.get = function()
    {
       return self.program; 
    }

    /*
     * Shader handling functions
     */

    /*Function used to download the file from the url
     * @param name: url to the file
     */
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

    /*Attribute setting functions*/

    this.setMatrix4 =function (name, value)
    {
        var loc = gl.getUniformLocation(self.program, name);
        self.gl.uniformMatrix4fv(loc,false,flatten(value));
    }

    this.setMatrix3 =function (name, value)
    {
        var loc = gl.getUniformLocation(self.program, name);
        self.gl.uniformMatrix3fv(loc,false,flatten(value));
    }

    this.setUniform4f =function (name, value)
    {
        var loc = gl.getUniformLocation(self.program, name);
        self.gl.uniform4fv(loc,flatten(value));
        if (self.gl.getError())
        {
            console.log("ERROR IN SETTING : ",name,value);
        } 
    }
    
    this.setUniform3f =function (name, value)
    {
        var loc = gl.getUniformLocation(self.program, name);
        self.gl.uniform3fv(loc,flatten(value));
    }
    
    this.setUniform1f =function (name, value)
    {
        var loc = gl.getUniformLocation(self.program, name);
        self.gl.uniform1f(loc,value);
    }

    this.getAttribLocation = function(name)
    {
        return self.gl.getAttribLocation(self.program, name);
    }
    this.setTextureToUnit = function (name , id)
    {
        var loc = self.gl.getUniformLocation(self.program, name);
        self.gl.uniform1i(loc,id); 
    
    }
}
