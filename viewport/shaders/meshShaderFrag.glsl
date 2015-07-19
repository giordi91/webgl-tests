precision highp float;
precision highp sampler2D;
uniform vec4 color;
uniform vec3 K;
uniform vec3 lightPosition;
uniform float shiness;
varying vec3 Normal;
varying vec3 Position;
varying vec2 uv;

uniform sampler2D tex1;
vec3 ads()
{
    vec3 n = normalize(Normal);
    vec3 s = normalize(lightPosition - Position);
    vec3 v = normalize(-Position);
    vec3 r = reflect(-s,n);
    
    vec3 lightIntenisty = vec3(0.6);
    vec3 Ka = vec3 (0.6); // ambient reflection coefficient
    vec3 Kd = vec3 (0.8); //diffuse  reflection coefficient
    vec3 Ks = vec3 (0.7); //specular reflection coefficient
    return lightIntenisty * (Ka + Kd *max(dot(s,n),0.0) + Ks * pow(max(dot(r,v),0.0),shiness));

}
void
main()
{
    vec4 tex_color= texture2D(tex1, vec2(uv.x,1.0 -uv.y));
    gl_FragColor =  vec4(ads(),1.0) *tex_color;
}

