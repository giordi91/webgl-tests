//this class is used to draw a grid on the screen

/*
 * @param size: scalar, how many lines to draw
 * @param step: scalar, the gap between the lines
 * @param gl: the initialized gl contest
 * @param program: the program with the shader linked to it
 */
function Cube(width,height, depth, gl,program )
{
    var self = this;
    self.width= width;
    self.height= height;
    self.depth= depth;
    self.h_width = width/2;
    self.h_height= height/2;
    self.h_depth= depth/2;
    self.program = program;
    self.gl = gl;
    self.buffer = new Buffer(gl, gl.ARRAY_BUFFER);
    self.data = []; 
    self.GRID_COLOR = vec4(1,0,0,1);
    this.init = function()
    {
        //base points
        self.data.push(self.h_width,-self.h_height,self.h_depth);         
        self.data.push(self.h_width,-self.h_height,-self.h_depth);         
        self.data.push(-self.h_width,-self.h_height,-self.h_depth);         

        self.data.push(self.h_width, -self.h_height,self.h_depth);         
        self.data.push(-self.h_width,-self.h_height,-self.h_depth);         
        self.data.push(-self.h_width,-self.h_height,self.h_depth);         
        
        //top poings
        self.data.push(self.h_width,self.h_height,self.h_depth);         
        self.data.push(self.h_width,self.h_height,-self.h_depth);         
        self.data.push(-self.h_width,self.h_height,-self.h_depth);         

        self.data.push(self.h_width, self.h_height,self.h_depth);         
        self.data.push(-self.h_width,self.h_height,-self.h_depth);         
        self.data.push(-self.h_width,self.h_height,self.h_depth);         
        //left face
         
        self.data.push(self.h_width,-self.h_height,self.h_depth);         
        self.data.push(self.h_width,-self.h_height,-self.h_depth);         
        self.data.push(self.h_width, self.h_height,-self.h_depth);         
        
        self.data.push(self.h_width,-self.h_height,self.h_depth);         
        self.data.push(self.h_width,self.h_height,-self.h_depth);         
        self.data.push(self.h_width, self.h_height,self.h_depth);         
        
        //right face 
        self.data.push(-self.h_width,-self.h_height,self.h_depth);         
        self.data.push(-self.h_width,-self.h_height,-self.h_depth);         
        self.data.push(-self.h_width, self.h_height,-self.h_depth);         
        
        self.data.push(-self.h_width,-self.h_height,self.h_depth);         
        self.data.push(-self.h_width,self.h_height,-self.h_depth);         
        self.data.push(-self.h_width, self.h_height,self.h_depth);         

        //back face
        self.data.push(self.h_width,-self.h_height,-self.h_depth);         
        self.data.push(-self.h_width,-self.h_height,-self.h_depth);         
        self.data.push(-self.h_width,self.h_height,-self.h_depth);         

        self.data.push(self.h_width,-self.h_height,-self.h_depth);         
        self.data.push(self.h_width,self.h_height,-self.h_depth);         
        self.data.push(-self.h_width,self.h_height,-self.h_depth);         
        
        //front face
        self.data.push(self.h_width,-self.h_height,self.h_depth);         
        self.data.push(-self.h_width,-self.h_height,self.h_depth);         
        self.data.push(-self.h_width,self.h_height,self.h_depth);         

        self.data.push(self.h_width,-self.h_height,self.h_depth);         
        self.data.push(self.h_width,self.h_height,self.h_depth);         
        self.data.push(-self.h_width,self.h_height,self.h_depth);         
        
        self.buffer.upload(self.data);
    }

    this.draw = function()
    {
        self.program.use()
        self.buffer.bind(); 
        vPosition = self.gl.getAttribLocation( self.program.get(), "vPosition" );
        self.gl.vertexAttribPointer( vPosition, 3, self.gl.FLOAT, false, 0, 0 );
        self.gl.enableVertexAttribArray( vPosition );
        
        self.program.setUniform4f("color",self.GRID_COLOR);
        self.gl.drawArrays( self.gl.TRIANGLES, 0, self.data.length/3 );
    }

    this.set_width = function(value)
    {
        self.width = value;
    }
    
    this.set_heigth= function(value)
    {
        self.height= value;
    }
    
    this.set_depth= function(value)
    {
        self.depth= value;
    }
}
