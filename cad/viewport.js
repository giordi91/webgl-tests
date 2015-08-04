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
var cube;
var container;

window.onload = function init()
{
    gl = WebGLUtils.setupWebGL( canvas  );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 0.0 );
    gl.enable(gl.DEPTH_TEST);
    var ext = gl.getExtension('OES_standard_derivatives'); 
    initializeShaderPrograms(); 
    
    container = new DynamicUi();
    container.init(); 
    //initializeing the camera
    camera = new Camera(canvas.width, canvas.height);
    
    factory = new PrimFactory(gl, program, selectionProgram,camera,container,canvas.width, canvas.height);
    var cil= factory.generate("cilinder","cilinder1");
    var sp= factory.generate("sphere","sphere1");
    
    cube = factory.generate("cube","cube1");
    /*
    cube2 = factory.generate("cube", "cube2");
    cube2.t.set([0,100,0]);
    cube2.update_position();
    */
    container.setObjectActive(sp);
    
     
    if(typeof window.orientation !== 'undefined')
    {
        touch_h = new Touch(canvas, camera);
        touch_h.init();
    }    
    else
    {
       mouse_h = new Mouse(canvas, camera,factory);
       mouse_h.init();
    }

    grid = new Grid(10,10, gl,programBasic);
    grid.init();

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    
    //camera matrix
    program.use();
    var projM = camera.projection_matrix(); 
    //program.setMatrix4("projM", projM);
    var ModelViewM= camera.model_view_matrix();
    //program.setMatrix4("ModelViewM", camera.model_view_matrix());
    program.setMatrix4("MVP", mult(projM,ModelViewM));
    //program.setMatrix3("NormalM", camera.normal_matrix());
    
    //set materials attributres, will change in the future
    
    //program.setUniform3f("K", vec3(0.6,0.6,0.6));
    //program.setUniform3f("lightPosition", vec3(0,0,0));
    //program.setUniform1f("shiness", 10.0);
    factory.draw();
    
    //draw grid 
    programBasic.use(); 
    programBasic.setMatrix4("MVP", mult(projM,ModelViewM));
    grid.draw();
    //requesting next frame
    requestAnimFrame(render);
    //evaluating game inputs
    gamepad_input();
}

function initializeShaderPrograms()
{

    //initialize shader programs
    //loading the shader for the mesh, more complex shader
    program = new GLSLProgram(gl);
    program.init();
    program.loadShader("shaders/cadShaderVtx.glsl", gl.VERTEX_SHADER) 
    program.loadShader("shaders/cadShaderFrag.glsl", gl.FRAGMENT_SHADER) 
    program.link(); 
    program.use();
   
    //loading shader for solid drawing like the grid 
    programBasic = new GLSLProgram(gl);
    programBasic.init();
    programBasic.loadShader("shaders/basicShaderVtx.glsl", gl.VERTEX_SHADER) 
    programBasic.loadShader("shaders/basicShaderFrag.glsl", gl.FRAGMENT_SHADER) 
    programBasic.link(); 

    selectionProgram = new GLSLProgram(gl);
    selectionProgram.init();
    selectionProgram.loadShader("shaders/cadShaderVtx.glsl",gl.VERTEX_SHADER);
    selectionProgram.loadShader("shaders/selectionFrag.glsl",gl.FRAGMENT_SHADER);
    selectionProgram.link();
}
