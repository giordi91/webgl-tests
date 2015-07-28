attribute vec3 vPosition;
attribute vec3 vBC;

uniform mat4 MVP;
uniform mat4 modelM;
varying vec3 bc;
void main()
{
    bc= vBC;
    gl_Position =  MVP*modelM* vec4(vPosition,  1.0);
}
