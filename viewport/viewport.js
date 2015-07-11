var gl;
var points;
var mouse_down= 0;
var old_x=0;
var old_y=0;
var projM;
var ModelViewM;
var MVP;
var camPos;
var lookAtPos;
var program;


window.onload = function init()
{
    //setting up the webgl window, mostly mouse triggers
    canvas.oncontextmenu = function () {return false;};
    canvas.onmousedown= function(e) { 
                                        old_x = e.pageX;
                                        old_y = e.pageY;
                                    mouse_down=true;};
    canvas.onmouseup = function() {mouse_down=false;};
    canvas.onmousemove = mouse_move_event;
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    
    //temp data
    var vertices = [-16, -10,-50,
                     0, 10,-50,
                     10, -10, -50];

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.6, 0.6, 0.6, 1.0 );
    
    
    camPos = vec3(0,0,5); 
    lookAtPos = vec3(0,0,0);
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    //camera matrix
    projM = perspective(30, canvas.width/canvas.height, 0.1,100);
    var loc = gl.getUniformLocation(program, "projM");
    gl.uniformMatrix4fv(loc,false,flatten(projM));
    
    var up = vec3(0,1,0);
    ModelViewM= lookAt(camPos,lookAtPos,up);
    loc = gl.getUniformLocation(program, "ModelViewM");
    gl.uniformMatrix4fv(loc,false,flatten(ModelViewM));
    
    MVP= mult(projM,ModelViewM);
    loc = gl.getUniformLocation(program, "MVP");
    gl.uniformMatrix4fv(loc,false,flatten(MVP));
    
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
    requestAnimFrame(render);
}

function mouse_move_event(e)
{
    //we are going to evaluate only if we have the mouse down and we are moving
    if(mouse_down)
    {
        //just chekcing the mnove delta
        if (e.button == 1)
        {
            camera_move(e.pageX, e.pageY);
        }
        //updating stored coordinate for computing delta
        old_x = e.pageX;
        old_y = e.pageY;
    }
}

function camera_move( x,y)
{
    var aim = subtract(lookAtPos, camPos);
    dx = old_x - x;
    dy = old_y - y;
    var factor = length(aim);

    var dir = normalize(cross(aim,vec3(0,1,0)));
    var newup = normalize(cross(dir,aim));

    var offset = scale(factor,(add(scale(dx, dir ), scale(-dy, newup))));
    offset = scale(0.006, offset);
    if (length(offset) > 100)
    {
        return;
    }
    camPos = add(camPos,offset);
    lookAtPos = add(lookAtPos,offset);
    

    

}
        


