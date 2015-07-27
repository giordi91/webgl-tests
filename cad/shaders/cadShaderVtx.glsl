attribute vec3 vPosition;
attribute vec3 vBC;

uniform mat4 MVP;
varying vec3 bc;
void main()
{
    bc= vBC;
    gl_Position =  MVP* vec4(vPosition,  1.0);
}
