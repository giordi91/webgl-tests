//I KNOW , don't think I DONT KNOW IT, but I truly do, all those globals are ugly
//as shit, as soon I get better at javasctipt I am gonna do something about this
var gl;
var program;
var gridData = [];
var grid;
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
var texture_loaded = false;
var m;
var t;

function initTextures() {
  cubeTexture = gl.createTexture();
  cubeImage = new Image();
  //cubeImage.onload = function() { handleTextureLoaded(cubeImage, cubeTexture); }
  cubeImage.onload = function() { handleTextureLoaded(cubeImage, cubeTexture); }
  ///cubeImage.src = "http://192.168.0.200/temp_shit/body_color.png"
  cubeImage.src = "textures/body_color.png"
  
}

function handleTextureLoaded(image, texture) {
    
    console.log(texture);

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  console.log("loaded textures");
    gl.activeTexture(gl.TEXTURE0);
    texture_loaded=true;
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
      
     
    if(typeof window.orientation !== 'undefined')
    {
        t = new Touch(canvas, camera);
        t.init();
    }    
    else
    {
       m = new Mouse(canvas, camera);
       m.init();
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
    
    grid = new Grid(10,10, gl,program);
    grid.init();
    
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
        
        if (texture_loaded)
        {
            gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
            gl.bindBuffer(gl.ARRAY_BUFFER, uvbo);
            var vUV = gl.getAttribLocation( program, "vUV" );
            gl.vertexAttribPointer( vUV,2, gl.FLOAT, false, 0, 0 );
            gl.enableVertexAttribArray( vUV);
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,idxbo);
        gl.drawElements(gl.TRIANGLES,idx_size, gl.UNSIGNED_SHORT,0);
        gl.disableVertexAttribArray(vNormal);
        
        if (texture_loaded)
        {
        gl.disableVertexAttribArray(vUV);
        }
    }
    
    //draw grid 
    grid.draw();
    //gl.bindBuffer(gl.ARRAY_BUFFER,gridB);
    requestAnimFrame(render);
    gamepad_input();
}



