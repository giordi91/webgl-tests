//I KNOW , don't think I DONT KNOW IT, but I truly do, all those globals are ugly
//as shit, as soon I get better at javasctipt I am gonna do something about this
var gl;
var mouse_down= 0;
var program;
var gridData = [];
var gridB;
var camera ;
var mesh_loaded;
var meshes = {};
//temp variables for obj loaded
var vbo;
var nbo;
var idxbo;
var uvbo;
var vtx_size;
var idx_size;
var spinner;
//textur param
var cubeImage;
var cubeTexture;

function initTextures() {
  cubeTexture = gl.createTexture();
  cubeImage = new Image();
  //cubeImage.onload = function() { handleTextureLoaded(cubeImage, cubeTexture); }
  cubeImage.onload = function() { handleTextureLoaded(cubeImage, cubeTexture); }
  cubeImage.src = "http://192.168.0.200/temp_shit/body_color.png"
  //cubeImage.src = "textures/body_color.png"
  
  //cubeImage.src = "textures/body_color.png";
}

function handleTextureLoaded(image, texture) {
    
    console.log(texture);

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
  console.log("loaded textures");
}



function loaded_obj()
{
    vbo = gl.createBuffer();
    nbo = gl.createBuffer();
    idxbo = gl.createBuffer();
    uvbo = gl.createBuffer();
    
    var m = meshes["cube"];
    gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(m.vertices),gl.STATIC_DRAW);
    vtx_size = m.vertices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER,nbo);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(m.vertexNormals),gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,idxbo);
    idx_size = m.indices.length;
    var idxs = new Uint16Array(idx_size);
    for(i=0; i<idx_size;i++)
    {
        idxs[i] = m.indices[i];
    }
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,idxs,gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER,uvbo);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(m.textures),gl.STATIC_DRAW);

    mesh_loaded = true;
    spinner.stop();
}
function canGame()
{
    return "getGamepads" in navigator;
}
var gp;
window.onload = function init()
{
    
     
    spinner = new Spinner({scale:4, color: '#000000', lines:10});
    spinner.spin();

    document.body.appendChild(spinner.el);
    
    mesh_loaded = false; 
    camera = new Camera(canvas.width, canvas.height);
    OBJ.downloadMeshes({"cube":"http://192.168.0.200/temp_shit/body2.obj"},loaded_obj,meshes);
    //OBJ.downloadMeshes({"cube":"objs/body2.obj"},loaded_obj,meshes);
      
        

    
     
    if(typeof window.orientation !== 'undefined'){
    
        var hammertime = new Hammer(canvas);
        hammertime.on('pan', swipe_event );
        hammertime.on('panstart', function()
                {
                    mouse_down = true;
                    camera.old_x = 0;
                    camera.old_y = 0;
                } );
        hammertime.on('pinchstart',function()
                {
                    camera.old_x = 0;
                    camera.old_y = 0;
                } );
        hammertime.on('rotatestart',function()
                {
                    camera.old_x = 0;
                    camera.old_y = 0;
                } );
        hammertime.on('rotate', pinch_event);
        hammertime.on('pinchin', pan_event);
        hammertime.on('pinchout', pan_event);

        hammertime.get('rotate').set({ enable: true });
        hammertime.get('pinch').set({ enable: true, pointers: 3 });
        
    }    
    else
    { 
    //setting up the webgl window, mostly mouse triggers
    canvas.oncontextmenu = function () {return false;};
    canvas.onmousedown= function(e) { 
                                        camera.old_x = e.pageX;
                                        camera.old_y = e.pageY;
                                    mouse_down=true;};
    canvas.onmouseup = function() {mouse_down=false;};
    canvas.onmousemove = mouse_move_event;
    }
    
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    initTextures(); 
    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 0.0 );

    
    
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    //grid data this is a temp solution until i find a better way to organize
    //data in javascript
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
    
    // Load the data into the GPU
    gridB = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, gridB);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(gridData), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    gl.enable(gl.DEPTH_TEST);
    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    
    //camera matrix
    var projM = camera.projection_matrix(); 
    var loc = gl.getUniformLocation(program, "projM");
    gl.uniformMatrix4fv(loc,false,flatten(projM));
    
    var ModelViewM= camera.model_view_matrix();
    loc = gl.getUniformLocation(program, "ModelViewM");
    gl.uniformMatrix4fv(loc,false,flatten(ModelViewM));
    
    var MVP= mult(projM,ModelViewM);
    loc = gl.getUniformLocation(program, "MVP");
    gl.uniformMatrix4fv(loc,false,flatten(MVP));

    var NormalM= camera.normal_matrix();
    loc = gl.getUniformLocation(program, "NormalM");
    gl.uniformMatrix3fv(loc,false,flatten(NormalM));
    //draw triangle
    
    loc = gl.getUniformLocation(program, "color");
    gl.uniform4fv(loc,flatten(vec4(1,0,0,1)));

    loc = gl.getUniformLocation(program, "K");
    gl.uniform3fv(loc,flatten(vec3(0.6,0.6,0.6)));
    
    loc = gl.getUniformLocation(program, "shiness");
    gl.uniform1f(loc,100.0);
    
    loc = gl.getUniformLocation(program, "lightPosition");
    gl.uniform3fv(loc,flatten(vec3(0,0,0)));
    
    if (mesh_loaded)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
        var vPosition = gl.getAttribLocation( program, "vPosition" );
        gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );

        gl.bindBuffer(gl.ARRAY_BUFFER, nbo);
        var vNormal = gl.getAttribLocation( program, "vNormal" );
        gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vNormal );
         
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,idxbo);
        gl.drawElements(gl.TRIANGLES,idx_size, gl.UNSIGNED_SHORT,0);
        gl.disableVertexAttribArray(vNormal);
    }
    
    //draw grid 
    loc = gl.getUniformLocation(program, "color");
    gl.uniform4fv(loc,flatten(vec4(1,1,1,1)));
    gl.bindBuffer(gl.ARRAY_BUFFER,gridB);
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    gl.drawArrays( gl.LINES, 0, 44 );
    requestAnimFrame(render);
    gamepad_input();
}

function mouse_move_event(e)
{
    //we are going to evaluate only if we have the mouse down and we are moving
    if(mouse_down)
    {
        //just chekcing the mnove delta
        if (e.buttons== 4)
        {
            camera.move(e.pageX, e.pageY,true);
        }
        
        if (e.buttons == 1)
        {
            camera.rotate(e.pageX, e.pageY,true);
        }
        if (e.buttons ==2)
        {
            camera.zoom(e.pageX, e.pageY,true);
        }
        
        //updating stored coordinate for computing delta
        camera.old_x = e.pageX;
        camera.old_y = e.pageY;

    }

}

function swipe_event(e)
{
    var le = length(vec2(e.deltaX-camera.old_x, e.deltaY - camera.old_y));
    if (le >30)
    {
        camera.old_x = e.deltaX;
        camera.old_y = e.deltaY;
        return;
    }
    camera.rotate(e.deltaX,e.deltaY, false);
    camera.old_x = e.deltaX;
    camera.old_y = e.deltaY;
}

function pan_event(e)
{

    
    camera.move(e.deltaX,e.deltaY,false);
    camera.old_x = e.deltaX;
    camera.old_y = e.deltaY;

}

function pinch_event(e)
{
    if (Math.abs(e.rotation - camera.old_x) >10 || Math.abs(e.rotation - camera.old_y) >10)
    {
       return; 
    }
    camera.zoom(e.rotation,e.rotation,false);
    camera.old_x = e.rotation;
    camera.old_y = e.rotation;
    
}

function gamepad_input()
{
    //checking if the gamepad is avaliable
    gp = navigator.getGamepads();
    if (!gp || !gp[0])
    {return;}  
    
    //if it is let s use by default the first one 
    gp = gp[0];

    //pull the data needed
    var x,y,z1,z2,l,r,z;
    x = gp.axes[0];
    y = gp.axes[1];
    z1 = gp.axes[2];
    z2 = gp.axes[3];
    l = gp.buttons[6].pressed;
    r = gp.buttons[7].pressed;

    x = Math.abs(x) <0.2 ? x=0 : x;
    y = Math.abs(y) <0.2 ? y=0 : y;
    z1 = Math.abs(z1) <0.2 ? z1=0 : z1;
    z2 = Math.abs(z2) <0.2 ? z2=0 : z2;
    
     
    z=0; 
    if (l)
    {
        z=1;
    }
    else if(r)
    {
        z= -1;
    }
    
    if (z1 || z2)
    {
        camera.rotate(-z1*7, -z2*7,false);
    }
    
    if(x || y)
    { 
    camera.move(-x*10, -y*10,false);
    }
    if (z)
    {
        camera.zoom(z*3,z*3,false);
    }
}
