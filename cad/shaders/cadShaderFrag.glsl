#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform vec4 color;
varying vec3 bc;

float edgeFactor(){
    vec3 d = fwidth(bc);
    vec3 a3 = smoothstep(vec3(0.0), d*1.5, bc);
    return min(min(a3.x, a3.y), a3.z);
}

void main()
{
    gl_FragColor = vec4(mix(vec3(0.0), vec3(color), edgeFactor()),1.0);
    //gl_FragColor = color;
}
