
var gl;
var points;
var mouse_down= 0;
var bufferId;
var buffers_list=[];
var buffers_sizes=[];
var colors_list=[];
var curr_buffer= null;
var t_curr_buffer= null;
var curr_color = [1,1,1,1];
var points =[];
var t_points =[];
var canvas_w;
var canvas_h;
var program;
var old = null;
var LINE_WIDTH = 0.01;

window.onload = function init()
{
    canvas.oncontextmenu = function () {return false;};
    canvas.onmousedown= function() {mouse_down=true;};
    canvas.onmouseup = mouse_release_event;
    canvas.onmousemove = mouse_move_event;
    canvas_w = canvas.width;
    canvas_h = canvas.height;
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    //color picker initial confiugration 
    $('#picker').colpick({
        flat:true,
        layout:'hex',
        submit:0,
        colorScheme:'dark',
        onChange:set_color,
        color:{r:255, g:255, b:255}});
    

    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( .1, .1, .1, 0.0 );
    
    //  Load shaders and initialize attribute buffers
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    

    // Associate out shader variables with our data buffer
    console.log(remap_point(0,0));    
    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    
    
    if (buffers_list.length>=1)
    {
        for (b=0; b<buffers_list.length;b++)
        { 
            buffers_list[b].bind();
            var vPosition = gl.getAttribLocation( program, "vPosition" );
            var loc = gl.getUniformLocation(program, "color");
            gl.uniform4fv(loc,colors_list[b]);
            gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
            gl.enableVertexAttribArray( vPosition );
            gl.drawArrays(gl.LINE_STRIP,0, buffers_sizes[b]/2);
        }
    }
    
    
    if (curr_buffer && points.length>4)
    {
        curr_buffer.bind();
        var vPosition = gl.getAttribLocation( program, "vPosition" );
        gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
        var loc = gl.getUniformLocation(program, "color");
        gl.uniform4fv(loc,curr_color);
        gl.enableVertexAttribArray( vPosition );
        gl.drawArrays(gl.LINE_STRIP,0, points.length/2);
    }
    
    if(t_curr_buffer && t_points.length>6)
    {
       t_curr_buffer.bind();
        var vPosition = gl.getAttribLocation( program, "vPosition" );
        gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
        var loc = gl.getUniformLocation(program, "color");
        gl.uniform4fv(loc,curr_color);
        gl.enableVertexAttribArray( vPosition );
        //gl.drawArrays(gl.TRIANGLE_STRIP,0,t_points.length/2);
        gl.drawArrays(gl.TRIANGLE_STRIP,0,t_points.length/2);
    }

    requestAnimFrame(render);
}

function mouse_move_event(e)
{
    //we are going to evaluate only if we have the nmouse down and we are moving
    if(mouse_down)
    {
        
        if (!curr_buffer)
        {
            curr_buffer = new Buffer(gl,gl.ARRAY_BUFFER);
        } 
        if (!t_curr_buffer) 
        {
            t_curr_buffer = new Buffer(gl,gl.ARRAY_BUFFER);
        } 
        var newp= remap_point(e.pageX-7,e.pageY-7);     
        points.push(newp[0],newp[1]);
        curr_buffer.bind(); 
        curr_buffer.upload(points, gl.DYNAMIC_DRAW);

        //triangles
        if (!old)
        {
            old = newp;
        }
        else
        {
            //extrating the delta
            var delta = [newp[0] - old[0], newp[1] - old[1]];  
            var delta3 = normalize(vec3(delta[0], delta[1],0.0));
            var up = vec3(0,0,1); 
            var perp3_v = scale(LINE_WIDTH,normalize(cross(delta3,up)));
            //perp2_v = vec2(perp3
            if (t_points.length<1)
            {
                console.log("base");
                //compute the base of the strip 
                var p1 = [old[0] + perp3_v[0],
                          old[1] + perp3_v[1]];
                
                var p2 = [old[0] - perp3_v[0],
                          old[1] - perp3_v[1]];
                
                var p3 = [newp[0] + perp3_v[0],
                          newp[1] + perp3_v[1]];
                
                var p4 = [newp[0] - perp3_v[0],
                          newp[1] - perp3_v[1]];
            
                t_points.push(p2[0],p2[1] ,
                              p1[0],p1[1],
                              p4[0],p4[1],
                              p3[0],p3[1]); 
            }
            else
            {
                /*
                if (t_points.length>=4)
                {
                
                return;
                }
                */
                var p1 = [newp[0] - perp3_v[0],
                          newp[1] - perp3_v[1]];
                
                var p2 = [newp[0] + perp3_v[0],
                          newp[1] + perp3_v[1]];
                t_points.push(p1[0],p1[1] ,
                              p2[0],p2[1])
                console.log("regular");
            } 

            t_curr_buffer.bind();
            t_curr_buffer.upload(t_points,gl.DYNAMIC_DRAW);
        }

            old = newp;

        
    }
}


function mouse_release_event(e)
{
    mouse_down = false;
    if(points.length>4)
    {
        buffers_list.push(curr_buffer);
        buffers_sizes.push(points.length);
        colors_list.push(curr_color);
    }

    curr_buffer = null;
    points =[];
    console.log("release"); 
}

function remap_point(x,y)
{
    var new_x = -1 + (x/canvas_w) * 2;    
    var new_y = 1 - (y/canvas_h) * 2;    
    return [new_x, new_y];

}

function set_color(hsb,hex,rgb,el,bySetColor) 
{
        curr_color = [rgb.r/255,rgb.g/255,rgb.b/255,1.0];
}

