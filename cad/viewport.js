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

var basic_ren;
var prim_ren;

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
    
    container = new ChannelBox();
    container.init(); 
    //initializeing the camera
    camera = new Camera(canvas.width, canvas.height);

    
    prim_ren= new PrimitiveRenderer(gl, program,camera); 
    basic_ren = new BasicRenderer(gl,programBasic,camera);
    select_ren = new SelectionRenderer(gl,selectionProgram,camera,canvas.width, canvas.height);
    
    factory = new PrimFactory(gl, program, selectionProgram,camera,
            container,canvas.width, canvas.height,prim_ren,select_ren);
    creator = new CreatorUi(factory);
    creator.init();
    factory.generate("cube"); 
    //var c = new Cube(gl, program);    
    //c.init();
    
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

    grid = new Grid(10,10,gl);
    grid.init();
    basic_ren.register_resource(grid);

    //prim_ren.register_resource(c);
    
    render();
};


function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    
    //camera matrix
    
    prim_ren.render_resources();
    basic_ren.render_resources();
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
