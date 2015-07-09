
var gl;
var points;
var mouse_down= 0;
var old_x=0;
var old_y=0;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    canvas.oncontextmenu = function () {return false;};
    canvas.onmousedown= function() {mouse_down=true;};
    canvas.onmouseup = function() {mouse_down=false;};
    canvas.onmousemove = mouse_move_event;
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    
    var vertices = [-1, -1, 0, 1, 1, -1];

    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
}

function mouse_move_event(e)
{
    //we are going to evaluate only if we have the nmouse down and we are moving
    if(mouse_down)
    {
        //just chekcing the mnove delta
        console.log(e.pageX - old_x);
        console.log(e.pageY - old_y);
        console.log("dragging " + e.button ); 
        //updating stored coordinate for computing delta
        old_x = e.pageX;
        old_y = e.pageY;
    }
}


