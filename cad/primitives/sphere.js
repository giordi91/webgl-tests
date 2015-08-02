/* 
 *  this class is used to draw a cilinder on the screen
 * @param gl: the initialized gl contest
 * @param program: the program with the shader linked to it
 */
function Sphere(gl,program )
{
    var self = this;
    self.TYPE = "sphere";
    //by default selection color is black, like the background,means it will 
    //be invisible, the color will be filled in by the factory, no public interface
    //is offered for this
    self.SELECTION_COLOR = [0,0,0];
    self.SELECTED_WIREFRAME_COLOR = [1,1,1,0];
    self.is_selected = false;
    
    //webgl components
    self.program = program;
    self.gl = gl;
    
    
    self.color = vec4(1,0,1,1);
    //spacial parameters
    self.__model_matrix = mat4();

    //object data
    self.buffer = new Buffer(gl, gl.ARRAY_BUFFER);
    self.data = []; 
    self.buffer_bar = new Buffer(gl, gl.ARRAY_BUFFER) 
    self.data_bar =[];
    
    this.init = function()
    {
        
    
        
        self.data_bar = [];
        self.data=[];
        
        var lat = self.latitude.get();
        var log = self.longitude.get();
        var r = self.radius.get()/2;
        for (var l =0; l<lat;l++)
        {
            //here we compute the data for two latitudes, the current one and the next one
            //in this way we are able to generate a strip
            var theta = l*Math.PI/lat;
            var sinT = Math.sin(theta);
            var cosT = Math.cos(theta);
            
            var thetaP = (l+1) * Math.PI/lat;
            var sinTP = Math.sin(thetaP); 
            var cosTP = Math.cos(thetaP);

            for (var lg=0; lg<log;lg++)
            {
                //same here we compute the longintude for the current one and next one so 
                //in combination with two lats and two longs we can compute a "rectancguar"
                //patch composed of two triangles
                var phi = lg * Math.PI*2/ log; 
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi); 
                
                var phiP = (lg+1) * Math.PI*2/ log; 
                var sinPhiP = Math.sin(phiP);
                var cosPhiP = Math.cos(phiP); 
            
                var x,y,z;
                //top of the sphere case
                if(l==0)
                {
                    //north pole vtx
                    self.data.push(0,r,0);  
                    self.data.push( cosPhi * sinTP*r, cosTP*r, sinPhi* sinTP*r);
                    self.data.push( cosPhiP * sinTP*r, cosTP*r, sinPhiP* sinTP*r);
                } 
                else if(l== (lat -1))
                {
                    //south pole vtx
                    self.data.push( cosPhi * sinT*r, cosT*r, sinPhi* sinT*r);
                    self.data.push( cosPhiP * sinT*r, cosT*r, sinPhiP* sinT*r);

                    self.data.push(0,-r,0);  
                    
                }
                else
                {
                    //generic case
                    //lower triangle
                    self.data.push( cosPhi * sinT*r, cosT*r, sinPhi* sinT*r);
                    self.data.push( cosPhi * sinTP*r, cosTP*r, sinPhi* sinTP*r);
                    self.data.push( cosPhiP * sinTP*r, cosTP*r, sinPhiP* sinTP*r);

                    //upper triangle
                    self.data.push( cosPhi * sinT*r, cosT*r, sinPhi* sinT*r);
                    self.data.push( cosPhiP * sinT*r, cosT*r, sinPhiP* sinT*r);
                    self.data.push( cosPhiP * sinTP*r, cosTP*r, sinPhiP* sinTP*r);
                }

            
            }
        }
        //generatinc baricentric fake coordinate for wireframe
        for (var i=0; i<self.data.length/9;i++)
        {
            self.data_bar.push(1,0,0,0,1,0,0,0,1);
        }
         
        self.buffer.upload(self.data);
        self.buffer_bar.upload(self.data_bar);
        
     }
    this.__rotate_2d_xy = function ( vec, angle)
    {
        angle = angle * Math.PI /180;
        var res = [vec[0] * Math.cos(angle) - vec[1] * Math.sin(angle),0,
            vec[0] * Math.sin(angle) + vec[1] * Math.cos(angle) ];
        return res;

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
    self.latitude= new Attribute( AttrDisplay.FLOAT_SLIDER, AttrCategory.BUILD, "latitude",10, self.init);
    self.longitude= new Attribute( AttrDisplay.FLOAT_SLIDER, AttrCategory.BUILD, "longitude",10,self.init);
    self.radius= new Attribute( AttrDisplay.FLOAT_SLIDER, AttrCategory.BUILD, "radius",10,self.init);
}


