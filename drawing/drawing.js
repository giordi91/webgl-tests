
var gl;
var points;
var mouse_down= 0;
var buffers_list=[];
var buffers_sizes=[];
var colors_list=[];
var curr_buffer= null;
var curr_color = [1,1,1,1];
var points =[];
var canvas_w;
var canvas_h;
var program;
var old = null;

//constants
var LINE_WIDTH = 10;
var LINE_MULTIPLIER= 0.001;
var UP = vec3(0,0,1);
window.onload = function init()
{
    //configuring canvas
    canvas.oncontextmenu = function () {return false;};
    canvas.onmousedown= function() {mouse_down=true;};
    canvas.onmouseup = mouse_release_event;
    canvas.onmousemove = mouse_move_event;
    canvas_w = canvas.width;
    canvas_h = canvas.height;
    
    //color picker initial confiugration 
    $('#picker').colpick({
        flat:true,
        layout:'hex',
        submit:0,
        colorScheme:'dark',
        onChange:set_color,
        color:{r:255, g:255, b:255}});
    
    var slider1 = document.getElementById("slider");
    slider1.onchange = function() {
               value= parseInt(slider1.value); 
     LINE_WIDTH=value   ;
     }
    
    //  Configure WebGL
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0, 0, 0, 0.0 );
    
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    //kicking the render
    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );


    
    //drawing stored vertex buffer 
    //neede variables
    var vPosition;
    var loc;
    
    //looping old lines
     
    for (b=0; b<buffers_list.length;b++)
    { 
        buffers_list[b].bind();
        vPosition = gl.getAttribLocation( program, "vPosition" );
        loc = gl.getUniformLocation(program, "color");
        gl.uniform4fv(loc,colors_list[b]);
        gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );
        gl.drawArrays(gl.TRIANGLE_STRIP,0, buffers_sizes[b]/2);
    }
     
    //drawing current vertex buffer 
    if (curr_buffer && points.length>6)
    {
        curr_buffer.bind();
        vPosition = gl.getAttribLocation( program, "vPosition" );
        gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
        loc = gl.getUniformLocation(program, "color");
        gl.uniform4fv(loc,curr_color);
        gl.enableVertexAttribArray( vPosition );
        gl.drawArrays(gl.TRIANGLE_STRIP,0, points.length/2);
    }
    
    requestAnimFrame(render);
}

function mouse_move_event(e)
{
    //we are going to evaluate only if we have the nmouse down and we are moving
    if(mouse_down)
    {
        //if there is not a buffer currently in use we create one 
        if (!curr_buffer)
        {
            curr_buffer = new Buffer(gl,gl.ARRAY_BUFFER);
        } 
        //remapping points and binding buffer
        var newp= remap_point(e.pageX-7,e.pageY-7);     
        curr_buffer.bind(); 

        if (old)
        {
            //extrating the delta
            var delta = [newp[0] - old[0], newp[1] - old[1]];  
            //converting to a 3d vector
            var delta3 = normalize(vec3(delta[0], delta[1],0.0));
            var perp3_v = scale(LINE_WIDTH*LINE_MULTIPLIER,normalize(cross(delta3,UP)));
            
            //before I was checking for length <1, but in oreder to maximize instruction cache
            //i set the most likely case as first, also should help breanch prediciton for the 
            //processor
            if (points.length>1)
            {
                //computing the new point
                var p1 = [newp[0] - perp3_v[0],
                          newp[1] - perp3_v[1]];
                
                var p2 = [newp[0] + perp3_v[0],
                          newp[1] + perp3_v[1]];
                points.push(p1[0],p1[1] ,
                              p2[0],p2[1])
            }
            else
            {
                //compute the base of the strip 
                var p1 = [old[0] + perp3_v[0],
                          old[1] + perp3_v[1]];
                
                var p2 = [old[0] - perp3_v[0],
                          old[1] - perp3_v[1]];
                
                //compute the new point
                var p3 = [newp[0] + perp3_v[0],
                          newp[1] + perp3_v[1]];
                
                var p4 = [newp[0] - perp3_v[0],
                          newp[1] - perp3_v[1]];
            
                points.push(p2[0],p2[1] ,
                              p1[0],p1[1],
                              p4[0],p4[1],
                              p3[0],p3[1]); 
            } 

            //uploading the point
            curr_buffer.upload(points,gl.DYNAMIC_DRAW);
        }
        //storing the current position
        old = newp;
        
    }
}


function mouse_release_event(e)
{
    //we start by setting the mouse down to false 
    mouse_down = false;
    //if the buffer has enough points we save it to the buffer list,
    //same for current color and current buffer size 
    if(points.length>6)
    {
        buffers_list.push(curr_buffer);
        buffers_sizes.push(points.length);
        colors_list.push(curr_color);
    }
    //resetting the variables
    curr_buffer = null;
    old = null;
    points =[];
}

//converting from screen coordinates to device coordinates
function remap_point(x,y)
{
    var new_x = -1 + (x/canvas_w) * 2;    
    var new_y = 1 - (y/canvas_h) * 2;    
    return [new_x, new_y];

}
//trigger for the color picker, setting the color and normalizing it
function set_color(hsb,hex,rgb,el,bySetColor) 
{
        curr_color = [rgb.r/255,rgb.g/255,rgb.b/255,1.0];
}

