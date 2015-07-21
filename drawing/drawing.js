
var gl;
var points;
var mouse_down= 0;
var bufferId;
var buffers_list=[];
var buffers_sizes=[];
var curr_buffer= null;
var points =[];
var canvas_w;
var canvas_h;
var program;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    canvas.oncontextmenu = function () {return false;};
    canvas.onmousedown= function() {mouse_down=true;};
    canvas.onmouseup = mouse_release_event;
    canvas.onmousemove = mouse_move_event;
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    

    canvas_w = canvas.width;
    canvas_h = canvas.height;
    
    var vertices = [-1, -1, 0, 1,1, -1,-1,-1];

    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( .1, .1, .1, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

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
        gl.enableVertexAttribArray( vPosition );
        gl.drawArrays(gl.LINE_STRIP,0, points.length/2);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,bufferId);
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    gl.drawArrays( gl.LINE_STRIP, 0, 4 );
    
    
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
        
        var newp= remap_point(e.pageX-7,e.pageY-7);     
        points.push(newp[0],newp[1]);
        curr_buffer.bind(); 
        curr_buffer.upload(points, gl.DYNAMIC_DRAW);
        
    }
}


function mouse_release_event(e)
{
    mouse_down = false;
    if(points.length>4)
    {
    buffers_list.push(curr_buffer);
    buffers_sizes.push(points.length);
    }

    curr_buffer = null;
    points =[];

}

function remap_point(x,y)
{
    var new_x = -1 + (x/canvas_w) * 2;    
    var new_y = 1 - (y/canvas_h) * 2;    
    return [new_x, new_y];

}
