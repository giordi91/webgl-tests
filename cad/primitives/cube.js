//this class is used to draw a grid on the screen

/*
 * @param size: scalar, how many lines to draw
 * @param step: scalar, the gap between the lines
 * @param gl: the initialized gl contest
 * @param program: the program with the shader linked to it
 */
function Cube(gl,program )
{
    var self = this;
    self.TYPE = "cube";
    //by default selection color is black, like the background,means it will 
    //be invisible, the color will be filled in by the factory, no public interface
    //is offered for this
    self.SELECTION_COLOR = [0,0,0];
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

    this.update_position= function()
    {
        self.__model_matrix = self.model_matrix();
    }
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

    this.set_width = function(value)
    {
        self.width.set (value);
        self.init();
    }
    
    this.set_heigth= function(value)
    {
        self.height.set( value);
        self.init();
    }
    
    this.set_depth= function(value)
    {
        self.depth.set(value);
        self.init();
    }
    
    this.translate_matrix= function()
    {
        var values =  self.t.get();
        mat = translate(values[0],values[1],values[2]);
        return mat;
    }
    
    this.rotate_matrix= function()
    {
        var values =  self.r.get();
        matX = rotate(values[0],[1,0,0]);
        matY = rotate(values[1],[0,1,0]);
        matZ = rotate(values[2],[0,0,1]);

        
        var yz= mult(matY,matZ);
        var xyz = mult(matX, yz); 
        return xyz;
    }
    this.scale_matrix= function()
    {
        var values =  self.s.get();
        mat = scaleM(values);
        return mat;
    }

    this.model_matrix = function()
    {
        var tm = self.translate_matrix();
        var rm = self.rotate_matrix();
        var sm = self.scale_matrix();
        var finalM = mult(rm,sm);
        var finalM2= mult(tm,finalM);
        return finalM2; 
    }
    
    //generating positional attribute, i know is fucking ugly to put it here at the
    //end but I am passing a callback function (update position) that needs to be defined
    //before I can it
    generate_transform_attributes(self);

    //objects parameters
    self.width = new Attribute( AttrDisplay.FLOAT_SLIDER, AttrCategory.BUILD, "width",10, self.init);
    self.height= new Attribute( AttrDisplay.FLOAT_SLIDER, AttrCategory.BUILD, "height",10,self.init);
    self.depth= new Attribute( AttrDisplay.FLOAT_SLIDER, AttrCategory.BUILD, "depth",10,self.init);
}


