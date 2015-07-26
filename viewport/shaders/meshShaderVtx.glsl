
attribute vec3 vPosition;
attribute vec3 vNormal;
attribute vec2 vUV;
attribute vec3 vTangentsU;
attribute vec3 vTangentsV;

uniform mat4 ModelViewM;
uniform mat4 MVP;
uniform mat4 projM;
uniform mat3 NormalM;

varying vec3 Normal;
varying vec3 Position;
varying vec2 uv;

varying vec3 LightDir;
varying vec3 ViewDir;

void
main()
{
    Normal = normalize(NormalM*vNormal) ;
    vec3 tang = normalize(NormalM*vTangentsU) ;

    //binormal
    vec3 binormal = normalize(cross(vNormal,tang));
    
    //matrix for transformation totangent space
    mat3 toObjectLocal = mat3(tang.x, binormal.x ,Normal.x,
                              tang.y, binormal.y ,Normal.y,
                              tang.z, binormal.z ,Normal.z);

    Position = vec3(ModelViewM * vec4(vPosition,1.0));
    ViewDir = toObjectLocal * normalize(-Position); 
    LightDir = normalize(ViewDir);
    
    uv = vUV;
    gl_Position =  MVP* vec4(vPosition,  1.0);
}
