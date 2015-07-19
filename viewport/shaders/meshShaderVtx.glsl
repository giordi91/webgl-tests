
attribute vec3 vPosition;
attribute vec3 vNormal;
attribute vec2 vUV;

uniform mat4 ModelViewM;
uniform mat4 MVP;
uniform mat4 projM;
uniform mat3 NormalM;

varying vec3 Normal;
varying vec3 Position;
varying vec2 uv;
void
main()
{
    Normal = normalize(NormalM*vNormal) ;
    Position = vec3(ModelViewM * vec4(vPosition,1.0));
    uv = vUV;
    gl_Position =  MVP* vec4(vPosition,  1.0);
}
