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
    
    //webgl components
    self.program = program;
    self.gl = gl;
    
    //objects parameters
    self.width = new Attribute( AttrDisplay.FLOAT_SLIDER, AttrCategory.BUILD, "width",10);
    self.height= new Attribute( AttrDisplay.FLOAT_SLIDER, AttrCategory.BUILD, "height",10);
    self.depth= new Attribute( AttrDisplay.FLOAT_SLIDER, AttrCategory.BUILD, "depth",10);
    
    self.h_width = width/2;
    self.h_height= height/2;
    self.h_depth= depth/2;
    self.color = vec4(1,0,0,1);
    //spacial parameters
    generate_transform_attributes(self);
    
    //object data
    self.buffer = new Buffer(gl, gl.ARRAY_BUFFER);
    self.data = []; 
    self.buffer_bar = new Buffer(gl, gl.ARRAY_BUFFER) 
    self.data_bar =[];
    
    this.init = function()
    {
        self.h_width = self.width.get()/2;
        self.h_height= self.height.get()/2;
        self.h_depth= self.depth.get()/2;
        
        self.data_bar = [];
        self.data=[];
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
        
        //generatinc baricentric fake coordinate for wireframe
        for (var i=0; i<self.data.length/9;i++)
        {
            self.data_bar.push(1,0,0,0,1,0,0,0,1);
        }
        
        self.buffer.upload(self.data);
        self.buffer_bar.upload(self.data_bar);
    }

    this.draw = function()
    {
        self.program.use()
        self.buffer.bind(); 
        vPosition = self.gl.getAttribLocation( self.program.get(), "vPosition" );
        self.gl.vertexAttribPointer( vPosition, 3, self.gl.FLOAT, false, 0, 0 );
        self.gl.enableVertexAttribArray( vPosition );
        
        self.buffer_bar.bind(); 
        vBC = self.gl.getAttribLocation( self.program.get(), "vBC" );
        self.gl.vertexAttribPointer( vBC, 3, self.gl.FLOAT, false, 0, 0 );
        self.gl.enableVertexAttribArray( vBC);


        self.program.setUniform4f("color",self.color);
        self.gl.drawArrays( self.gl.TRIANGLES, 0, self.data.length/3 );
    }

    this.set_width = function(value)
    {
        self.width = value;
        self.init();
    }
    
    this.set_heigth= function(value)
    {
        self.height= value;
        self.init();
    }
    
    this.set_depth= function(value)
    {
        self.depth= value;
        self.init();
    }
}
