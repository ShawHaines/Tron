const vs =`
attribute vec3 a_position;
attribute vec3 a_normal;

uniform mat4 u_worldViewProjection;
uniform mat4 u_world;

varying vec3 v_normal;
varying vec3 fragPos;
void main(){
    gl_Position = u_worldViewProjection * vec4(a_position, 1.0);
    v_normal = (u_world * vec4(a_normal,0.0)).xyz;
    fragPos = (u_world * vec4(a_position, 1.0)).xyz;
}`

const fs=`
precision highp float;
uniform vec4 u_objectColor;
// actually it's lightColor, just to be conform with the other shaders.
uniform vec3 u_ambientLight;
uniform vec3 u_lightPos;
uniform vec3 u_viewPos;

varying vec3 v_normal;
varying vec3 fragPos;
void main()
{
    float ambientStrength = 0.1;
    vec3 ambient = ambientStrength * u_ambientLight;

    vec3 lightDir = normalize(u_lightPos - fragPos);
    float diff = max(dot(lightDir, normalize(v_normal)),0.0);
    vec3 diffuse = u_ambientLight * diff;

    vec3 viewDir = normalize(u_viewPos - fragPos);
    vec3 reflectDir = reflect(-lightDir, normalize(v_normal));
    // 32 times
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = u_ambientLight * spec * 0.5;

    gl_FragColor= vec4((ambient + diffuse + specular),1.0)* u_objectColor;

}
`
export {vs, fs};