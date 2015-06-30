
var gl;
var points = [];

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    var RECURSION = 6;

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    
    //generate the recursion data
    var vtx = [-1, -1, 0, 1, 1, -1];
    subdivide([vtx[0],vtx[1]],
            [vtx[2],vtx[3]],
            [vtx[4],vtx[5]], RECURSION);
    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    render();
};

function subdivide( v1, v2, v3, iter)
{
    //check if we need to break the recursion
    if ( iter == 0)
    {
        points.push(v1,v2,v3);
        return;
    }
    
    //subdivide the sides
    var h1 = halfpoint( v1,v2); 
    var h2 = halfpoint( v2,v3); 
    var h3 = halfpoint( v3,v1); 

    subdivide(v1,h1,h3 ,iter -1); 
    subdivide(h1,v2,h2 ,iter -1); 
    subdivide(h3,h2,v3 ,iter -1); 

}

function halfpoint ( v1,v2)
{
    var v = [v1[0] + ((v2[0] - v1[0]) *0.5), v1[1] + ((v2[1] - v1[1]) * 0.5)];
    return v 
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}
