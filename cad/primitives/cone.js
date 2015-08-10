
/* 
 *  this class is used to draw a cilinder on the screen
 * @param gl: the initialized gl contest
 * @param program: the program with the shader linked to it
 */
function Cone(gl)
{
    MovableObject.apply(this);
    var self = this;
    self.TYPE = "cilinder";
    //by default selection color is black, like the background,means it will 
    //be invisible, the color will be filled in by the factory, no public interface
    //is offered for this
    self.SELECTION_COLOR = [0,0,0];
    self.SELECTED_WIREFRAME_COLOR = [1,1,1,0];
    self.is_selected = false;
    //webgl components
    self.gl = gl;
    
    
    self.color = vec4(0,0,0.8,1);
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
        //base points
        var vec = [self.radius.get(),0,0]
        var step = 360.0/self.resolution.get();
        var tmp1; 
        var h = self.height.get();
        var hh = h/2.0;

        for (var i = 0; i<self.resolution.get();i++)
        {
            //base triangle
            self.data.push(0,-hh,0);         
            tmp = self.__rotate_2d_xy(vec, step*i);
            self.data.push(tmp[0], -hh,tmp[2]);         
            tmp1 = self.__rotate_2d_xy(vec, step*(i+1));
            self.data.push(tmp1[0], -hh,tmp1[2]);         
          
            //sides
            self.data.push(tmp[0], -hh,tmp[2]);         
            self.data.push(tmp1[0], -hh,tmp1[2]);         
            self.data.push(0, hh,0);         

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

    //objects parameters
    self.radius= new Attribute( AttrDisplay.FLOAT_SLIDER, AttrCategory.BUILD, "radius",10, self.init);
    self.height= new Attribute( AttrDisplay.FLOAT_SLIDER, AttrCategory.BUILD, "height",30,self.init);
    self.resolution= new Attribute( AttrDisplay.FLOAT_SLIDER, AttrCategory.BUILD, "resolution",10,self.init);
}

//setting the "inheritance from movabler object"
Cone.prototype = Object.create(MovableObject.prototype);
Cone.prototype.constructor = Cone;
