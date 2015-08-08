/* 
 *  this class is used to draw a cilinder on the screen
 * @param gl: the initialized gl contest
 * @param program: the program with the shader linked to it
 */
function Sphere(gl)
{

    MovableObject.apply(this);
    var self = this;
    self.TYPE = "sphere";
    //by default selection color is black, like the background,means it will 
    //be invisible, the color will be filled in by the factory, no public interface
    //is offered for this
    self.SELECTION_COLOR = [0,0,0];
    self.SELECTED_WIREFRAME_COLOR = [1,1,1,0];
    self.is_selected = false;
    
    //webgl components
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
    //objects parameters
    self.latitude= new Attribute( AttrDisplay.FLOAT_SLIDER, AttrCategory.BUILD, "latitude",10, self.init);
    self.longitude= new Attribute( AttrDisplay.FLOAT_SLIDER, AttrCategory.BUILD, "longitude",10,self.init);
    self.radius= new Attribute( AttrDisplay.FLOAT_SLIDER, AttrCategory.BUILD, "radius",10,self.init);
}
//setting the "inheritance from movabler object"
Sphere.prototype = Object.create(MovableObject.prototype);
Sphere.prototype.constructor = Sphere;
