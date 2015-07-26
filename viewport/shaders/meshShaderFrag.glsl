precision highp float;
precision highp sampler2D;
uniform vec3 K;
uniform vec3 lightPosition;
uniform float shiness;


varying vec3 Normal;
varying vec3 Position;
varying vec2 uv;
varying vec3 LightDir;
varying vec3 ViewDir;

uniform sampler2D texColorS;
uniform sampler2D texNormalS;
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

vec3 phongModel(vec3 norm, vec3 diffR)
{
    vec3 r= reflect(-LightDir, norm);
    
    vec3 Ka = vec3 (0.6); // ambient reflection coefficient
    vec3 Kd = vec3 (0.8); //diffuse  reflection coefficient
    vec3 Ks = vec3 (0.7); //specular reflection coefficient
    vec3 ambient=  K*Ka;
    float sDotN = max(dot(LightDir,norm),0.0);
    vec3 diffuse = K * diffR * sDotN ;
    
    vec3 spec = vec3(0.0);
    
    
    if (sDotN >0.0)
    {
        spec = K * Ks * pow (max(dot(r,ViewDir),0.0), shiness);
    }

    return  diffuse + spec;    
}

void
main()
{
    vec4 tex_color  = texture2D(texColorS, vec2(uv.x,1.0 -uv.y)) ;
    vec4 tex_normal = 2.0 * texture2D(texNormalS, vec2(uv.x,1.0 -uv.y))-1.0;
    gl_FragColor =  vec4(phongModel(tex_normal.xyz,tex_color.rgb),1.0) ;
    //gl_FragColor =  vec4(ads(),1.0) *tex_color;
    //    gl_FragColor =  tex_normal *vec4(ads(),1.0)* tex_color;
}

