//this class is used to draw a grid on the screen

/*
 * @param size: scalar, how many lines to draw
 * @param step: scalar, the gap between the lines
 * @param gl: the initialized gl contest
 * @param program: the program with the shader linked to it
 */
function Cube(gl,program )
{
    MovableObject.apply(this);
    var self = this;
    self.TYPE = "cube";
    //by default selection color is black, like the background,means it will 
    //be invisible, the color will be filled in by the factory, no public interface
    //is offered for this
    self.SELECTION_COLOR = [0,0,0];
    self.SELECTED_WIREFRAME_COLOR = [1,1,1,0];
    self.is_selected = false;
    //webgl components
    self.program = program;
    self.gl = gl;
    
    
    self.color = vec4(1,0,0,1);
    //spacial parameters
    self.__model_matrix = mat4();

    //object data
    self.buffer = new Buffer(gl, gl.ARRAY_BUFFER);
    self.data = []; 
    self.buffer_bar = new Buffer(gl, gl.ARRAY_BUFFER) 
    self.data_bar =[];
    
    this.init = function()
    {
        var h_width = self.width.get()/2;
        var h_height= self.height.get()/2;
        var h_depth= self.depth.get()/2;
        
        self.data_bar = [];
        self.data=[];
        //base points
        self.data.push(h_width,-h_height,h_depth);         
        self.data.push(h_width,-h_height,-h_depth);         
        self.data.push(-h_width,-h_height,-h_depth);         

        self.data.push(h_width, -h_height,h_depth);         
        self.data.push(-h_width,-h_height,-h_depth);         
        self.data.push(-h_width,-h_height,h_depth);         
        
        //top poings
        self.data.push(h_width,h_height,h_depth);         
        self.data.push(h_width,h_height,-h_depth);         
        self.data.push(-h_width,h_height,-h_depth);         

        self.data.push(h_width, h_height,h_depth);         
        self.data.push(-h_width,h_height,-h_depth);         
        self.data.push(-h_width,h_height,h_depth);         
        //left face
         
        self.data.push(h_width,-h_height,h_depth);         
        self.data.push(h_width,-h_height,-h_depth);         
        self.data.push(h_width, h_height,-h_depth);         
        
        self.data.push(h_width,-h_height,h_depth);         
        self.data.push(h_width,h_height,-h_depth);         
        self.data.push(h_width, h_height,h_depth);         
        
        //right face 
        self.data.push(-h_width,-h_height,h_depth);         
        self.data.push(-h_width,-h_height,-h_depth);         
        self.data.push(-h_width, h_height,-h_depth);         
        
        self.data.push(-h_width,-h_height,h_depth);         
        self.data.push(-h_width,h_height,-h_depth);         
        self.data.push(-h_width, h_height,h_depth);         

        //back face
        self.data.push(h_width,-h_height,-h_depth);         
        self.data.push(-h_width,-h_height,-h_depth);         
        self.data.push(-h_width,h_height,-h_depth);         

        self.data.push(h_width,-h_height,-h_depth);         
        self.data.push(h_width,h_height,-h_depth);         
        self.data.push(-h_width,h_height,-h_depth);         
        
        //front face
        self.data.push(h_width,-h_height,h_depth);         
        self.data.push(-h_width,-h_height,h_depth);         
        self.data.push(-h_width,h_height,h_depth);         

        self.data.push(h_width,-h_height,h_depth);         
        self.data.push(h_width,h_height,h_depth);         
        self.data.push(-h_width,h_height,h_depth);         
        
        //generatinc baricentric fake coordinate for wireframe
        for (var i=0; i<self.data.length/9;i++)
        {
            self.data_bar.push(1,0,0,0,1,0,0,0,1);
        }
        
        self.buffer.upload(self.data);
        self.buffer_bar.upload(self.data_bar);
        
    }

    /*
    this.draw = function(selection, selectionProgram)
    {
        if (!selection)
        {
            self.program.use()
            self.program.setMatrix4("modelM",self.__model_matrix);
            self.buffer.bind(); 
            vPosition = self.gl.getAttribLocation( self.program.get(), "vPosition" );
            self.gl.vertexAttribPointer( vPosition, 3, self.gl.FLOAT, false, 0, 0 );
            self.gl.enableVertexAttribArray( vPosition );
            
             
            self.buffer_bar.bind(); 
            vBC = self.gl.getAttribLocation( self.program.get(), "vBC" );
            self.gl.vertexAttribPointer( vBC, 3, self.gl.FLOAT, false, 0, 0 );
            self.gl.enableVertexAttribArray( vBC);
            

            self.program.setUniform4f("color",self.color);
            if(self.is_selected)
            {
                self.program.setUniform4f("wire_color",self.SELECTED_WIREFRAME_COLOR);
            }
            else
            {
                self.program.setUniform4f("wire_color",[0,0,0,1]);
            }
            self.gl.drawArrays( self.gl.TRIANGLES, 0, self.data.length/3 );
        }
        else
        {
            selectionProgram.setMatrix4("modelM",self.__model_matrix);
            self.buffer.bind(); 
            vPosition = self.gl.getAttribLocation( self.program.get(), "vPosition" );
            self.gl.vertexAttribPointer( vPosition, 3, self.gl.FLOAT, false, 0, 0 );
            self.gl.enableVertexAttribArray( vPosition );
            
            selectionProgram.setUniform4f("color",self.SELECTION_COLOR);
            self.gl.drawArrays( self.gl.TRIANGLES, 0, self.data.length/3 );
        }
    }
    */

    //objects parameters
    self.width = new Attribute( AttrDisplay.FLOAT_SLIDER, AttrCategory.BUILD, "width",10, self.init);
    self.height= new Attribute( AttrDisplay.FLOAT_SLIDER, AttrCategory.BUILD, "height",10,self.init);
    self.depth= new Attribute( AttrDisplay.FLOAT_SLIDER, AttrCategory.BUILD, "depth",10,self.init);
}

//setting the "inheritance from movabler object"
Cube.prototype = Object.create(MovableObject.prototype);
Cube.prototype.constructor = Cube;
