const vs =`
attribute vec3 position;
attribute vec3 normal;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

varying vec3 v_normal;
varying vec3 fragPos;
void main(){
    gl_Position = projection * view * model * vec4(position, 1.0);
    v_normal = normal;
    fragPos = (model * vec4(position, 1.0)).xyz;
}`

const fs=`
precision highp float;
uniform vec3 objectColor;
uniform vec3 lightColor;
uniform vec3 lightPos;
uniform vec3 viewPos;

varying vec3 v_normal;
varying vec3 fragPos;
void main()
{
    float ambientStrength = 0.1;
    vec3 ambient = ambientStrength * lightColor;

    vec3 lightDir = normalize(lightPos - fragPos);
    float diff = max(dot(lightDir, normalize(v_normal)),0.0);
    vec3 diffuse = lightColor * diff;

    vec3 viewDir = normalize(viewPos - fragPos);
    vec3 reflectDir = reflect(-lightDir, normalize(v_normal));
    // 32 times
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = lightColor * spec * 0.5;

    vec3 result = (ambient + diffuse + specular)* objectColor;

    gl_FragColor = vec4(result, 1.0);
}
`
export {vs, fs};