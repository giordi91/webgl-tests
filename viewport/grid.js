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
    self.buffer = new VertexBuffer(gl, gl.ARRAY_BUFFER);
    self.data = []; 

    this.init = function()
    {
        for(i=-size; i<size+1; i++)
        {
           self.data.push(-self.size *step); 
           self.data.push(0); 
           self.data.push(i*step); 

           self.data.push(self.size*step); 
           self.data.push(0); 
           self.data.push(i*step); 

           self.data.push(i*step); 
           self.data.push(0); 
           self.data.push(-self.size*step); 

           self.data.push(i*step); 
           self.data.push(0); 
           self.data.push(self.size*step); 
        }
        self.buffer.upload(self.data)
    }

    this.draw = function()
    {
        //loc = self.gl.getUniformLocation(self.program, "color");
        //console.log(loc);
        //self.gl.uniform4fv(loc,flatten(vec4(1,1,1,1)));
        self.buffer.bind(); 
        vPosition = self.gl.getAttribLocation( self.program, "vPosition" );
        self.gl.vertexAttribPointer( vPosition, 3, self.gl.FLOAT, false, 0, 0 );
        self.gl.enableVertexAttribArray( vPosition );
        self.gl.drawArrays( self.gl.LINES, 0, self.data.length/3 );
    }
}
