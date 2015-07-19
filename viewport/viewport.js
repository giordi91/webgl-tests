//I KNOW , don't think I DONT KNOW IT, but I truly do, all those globals are ugly
//as shit, as soon I get better at javasctipt I am gonna do something about this
var gl;
var program;
var programBasic;

var camera ;
var mouse_h;
var touch_h;

var body;
var grid;


window.onload = function init()
{
    //initializeing the camera
    camera = new Camera(canvas.width, canvas.height);
     
    if(typeof window.orientation !== 'undefined')
    {
        touch_h = new Touch(canvas, camera);
        touch_h.init();
    }    
    else
    {
       mouse_h = new Mouse(canvas, camera);
       mouse_h.init();
    }
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 0.0 );
    gl.enable(gl.DEPTH_TEST);
    
    
    //initialize shader programs
    //loading the shader for the mesh, more complex shader
    program = new GLSLProgram(gl);
    program.init();
    program.loadShader("shaders/meshShaderVtx.glsl", gl.VERTEX_SHADER) 
    program.loadShader("shaders/meshShaderFrag.glsl", gl.FRAGMENT_SHADER) 
    program.link(); 
    program.use();
   
    //loading shader for solid drawing like the grid 
    programBasic = new GLSLProgram(gl);
    programBasic.init();
    programBasic.loadShader("shaders/basicShaderVtx.glsl", gl.VERTEX_SHADER) 
    programBasic.loadShader("shaders/basicShaderFrag.glsl", gl.FRAGMENT_SHADER) 
    programBasic.link(); 

    //loading the assets of the viewport
    body = new Mesh(gl, program);  
    body.load_obj("http://192.168.0.200/temp_shit/body2.obj");
    //body.load_obj("objs/body2.obj");
    body.load_color_texture("textures/body_color.png");

    grid = new Grid(10,10, gl,programBasic);
    grid.init();
    
    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    
    //camera matrix
    program.use();
    var projM = camera.projection_matrix(); 
    program.setMatrix4("projM", projM);
    var ModelViewM= camera.model_view_matrix();
    program.setMatrix4("ModelViewM", camera.model_view_matrix());
    program.setMatrix4("MVP", mult(projM,ModelViewM));
    program.setMatrix3("NormalM", camera.normal_matrix());
    
    //set materials attributres, will change in the future
    program.setUniform4f("color", vec4(1,0,0,1));
    program.setUniform4f("K", vec3(0.6,0.6,0.6,1));
    program.setUniform3f("lightPosition", vec3(0,0,0));
    program.setUniform1f("shiness", 100.0);

    body.draw(); 
    
    //draw grid 
    programBasic.use(); 
    programBasic.setMatrix4("MVP", mult(projM,ModelViewM));
    grid.draw();
     
    //requesting next frame
    requestAnimFrame(render);
    //evaluating game inputs
    gamepad_input();
}



