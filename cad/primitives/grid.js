//this class is used to draw a grid on the screen

/*
 * @param size: scalar, how many lines to draw
 * @param step: scalar, the gap between the lines
 * @param gl: the initialized gl contest
 * @param program: the program with the shader linked to it
 */
function Grid(size,step, gl,program )
{
    var self = this;
    self.size = size;
    self.step = step;
    self.program = program;
    self.gl = gl;
    self.buffer = new Buffer(gl, gl.ARRAY_BUFFER);
    self.data = []; 
    self.GRID_COLOR = vec4(0.3,0.5,0.3,1);

    this.init = function()
    {
        for(i=-self.size; i<self.size+1; i++)
        {
           self.data.push(-self.size *self.step); 
           self.data.push(0); 
           self.data.push(i*self.step); 

           self.data.push(self.size*self.step); 
           self.data.push(0); 
           self.data.push(i*self.step); 

           self.data.push(i*self.step); 
           self.data.push(0); 
           self.data.push(-self.size*self.step); 

           self.data.push(i*self.step); 
           self.data.push(0); 
           self.data.push(self.size*self.step); 
        }
        self.buffer.upload(self.data)
    }

    this.draw = function()
    {
        self.program.use()
        self.buffer.bind(); 
        vPosition = self.gl.getAttribLocation( self.program.get(), "vPosition" );
        self.gl.vertexAttribPointer( vPosition, 3, self.gl.FLOAT, false, 0, 0 );
        self.gl.enableVertexAttribArray( vPosition );
        
        self.program.setUniform4f("color",self.GRID_COLOR);
        self.gl.drawArrays( self.gl.LINES, 0, self.data.length/3 );
    }
}
