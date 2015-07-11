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
var MOVEMENT_SPEED = 0.001;
var ROTATION_SPEED = 0.1;
var triangleB;
var gridData = [];
var gridB;

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
    var vertices = [-5, -5,0,
                     0, 5,0,
                     5, -5, 0];

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.6, 0.6, 0.6, 1.0 );
    
    
    camPos = vec3(10,10,50); 
    lookAtPos = vec3(0,0,0);
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    triangleB = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, triangleB);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer


    //grid data
    for(i=-5; i<6; i++)
    {
       gridData.push(-5); 
       gridData.push(0); 
       gridData.push(i); 

       gridData.push(5); 
       gridData.push(0); 
       gridData.push(i); 

       gridData.push(i); 
       gridData.push(0); 
       gridData.push(-5); 

       gridData.push(i); 
       gridData.push(0); 
       gridData.push(5); 
    }
    
    for(i=-5; i<6; i++)
    {
    }
    // Load the data into the GPU
    gridB = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, gridB);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(gridData), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    //var vPosition = gl.getAttribLocation( program, "vPosition" );
    //gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enable(gl.DEPTH_TEST);
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

    //draw triangle
      
    loc = gl.getUniformLocation(program, "color");
    gl.uniform4fv(loc,flatten(vec4(1,0,0,1)));

    gl.bindBuffer(gl.ARRAY_BUFFER,triangleB);
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
     
    //draw grid 
    loc = gl.getUniformLocation(program, "color");
    gl.uniform4fv(loc,flatten(vec4(1,1,1,1)));
    gl.bindBuffer(gl.ARRAY_BUFFER,gridB);
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    gl.drawArrays( gl.LINES, 0, 44 );
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
        
        if (e.button == 0)
        {
            camera_rotate(e.pageX, e.pageY);
        }
        
        //updating stored coordinate for computing delta
        old_x = e.pageX;
        old_y = e.pageY;
    }
}

function camera_move( x,y)
{
    var aim = subtract(lookAtPos, camPos);
    var dx = old_x - x;
    var dy = old_y - y;
    var factor = length(aim);

    var dir = normalize(cross(aim,vec3(0,1,0)));
    var newup = normalize(cross(dir,aim));

    var offset = scale(factor,(add(scale(dx, dir ), scale(-dy, newup))));
    offset = scale(MOVEMENT_SPEED, offset);
    if (length(offset) > 100)
    {
        return;
    }
    camPos = add(camPos,offset);
    lookAtPos = add(lookAtPos,offset);
    
}
       
function camera_rotate(x,y)
{
    var dx = old_x - x;
    var dy = old_y - y;
    //removing pivot offset from camera and rotate from origin
    var tempPos = subtract(camPos, lookAtPos);
    
    //y rot
    var rotMat = rotate( dx*ROTATION_SPEED, vec3(0,1,0));
    console.log(rotMat);
    
    var tempPosM = mat4();
    tempPosM[3][0] = tempPos[0];
    tempPosM[3][1] = tempPos[1];
    tempPosM[3][2] = tempPos[2];
    var res = mult(tempPosM,rotMat);
    camPos = add(vec3(res[3][0],res[3][1],res[3][2]),lookAtPos);
}


