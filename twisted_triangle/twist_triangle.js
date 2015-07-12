
var gl;
var points = [];
var center;
var recursion;
var factor;  
var vtx; 
var program;
var bufferId;
window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    recursion= 0;
    factor= 0.0;
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    document.getElementById("slider").onchange = function() { 
            recursion= event.srcElement.value; eval_points();render();}
    
    document.getElementById("tslider").onchange = function() { 
            factor= event.srcElement.value; eval_points();render();}
    //generate the recursion data
    vtx = [-0.6, -0.4, 0, 0.7, .6, -0.4];
    
    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    eval_points();
    
    render();
};

function eval_points()
{

    points =[];
    subdivide([vtx[0],vtx[1]],
            [vtx[2],vtx[3]],
            [vtx[4],vtx[5]], recursion);
    
    //rotate points
    //var center = [0,0];
    center = [(vtx[0] + vtx[2] + vtx[4]) / 3.0,
                (vtx[1] + vtx[3] + vtx[5]) / 3.0];
    var dist;
    var tmp;
    for ( i=0; i< points.length; i++)
    {
        //points[i] = points[i] * cos(angle) 
        dist = euclidian_diatance(points[i] , center);
        tmp = rotation( points[i], factor* dist);
        points[i] = tmp;
        //points[i+1] = tmp
    }
    // Load the data into the GPU
    
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
}

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
    subdivide(h1,h2,h3 ,iter -1); 

}

function euclidian_diatance( v1 , v2)
{
    var res = Math.pow((v1[0] -v2[0]),2) +Math.pow((v1[1] -v2[1]),2);
    res = Math.sqrt(res);
    return res; 
}

function halfpoint ( v1,v2)
{
    var v = [v1[0] + ((v2[0] - v1[0]) *0.5), v1[1] + ((v2[1] - v1[1]) * 0.5)];
    return v 
}

function rotation( vec, angle)
{
    var vec2 = [vec[0] - center[0], vec[1] -center[1]];
    var res = [vec2[0] * Math.cos(angle) - vec2[1] * Math.sin(angle),
            vec2[0] * Math.sin(angle) + vec2[1] * Math.cos(angle)    
        ];
    res = [res[0] + center[0], res[1] + center[1]]; 
    return res;

}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}
