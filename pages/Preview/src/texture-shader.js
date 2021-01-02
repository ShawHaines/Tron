const vs = `
    attribute vec4 a_position;
    attribute vec2 a_texcoord;
    attribute vec3 a_normal;

    uniform mat4 u_world;
    uniform mat4 u_worldViewProjection; //redundant for efficiency
    uniform mat4 u_worldInverseTranspose; //for calculating v_normal
    
    varying vec4 v_position;
    varying vec2 v_texcoord;
    varying vec4 v_realPosition;

    varying vec3 v_normal;
    varying vec3 v_fragPos;

    void main() {
        v_texcoord = a_texcoord;
        v_realPosition = a_position;
        v_position =  u_worldViewProjection * a_position;
        gl_Position = v_position;

        v_normal = mat3(u_worldInverseTranspose) * a_normal; //calculate v_normal
        // v_normal = a_normal; //calculate v_normal
        v_fragPos = (u_world * a_position).xyz; //calculate fragment position
    }
    `;

const fs =
`precision mediump float;
varying vec2 v_texcoord;
varying vec4 v_position;
varying vec4 v_realPosition;

varying vec3 v_normal;
varying vec3 v_fragPos;

uniform vec4 u_objectColor;
uniform sampler2D u_texture;
uniform vec3 u_lightPos;
uniform vec3 u_viewPos;
uniform vec3 u_ambientLight;
uniform vec3 u_diffuseLight;
uniform vec3 u_specularLight;
uniform float u_ambientStrength;
uniform float u_shininess;


void main() {
    
    // vec3 lightColor = vec3(1.0, 1.0, 1.0); //debug use
    // float ambientStrength = 0.5; //debug use

    vec3 normal = normalize(v_normal);
    vec3 lightDir = normalize(u_lightPos - v_fragPos);
    vec3 viewDir = normalize(u_viewPos - v_fragPos);

    //Ambient
    vec3 ambient = u_ambientStrength * u_ambientLight;
    //Diffuse
    // float diff = max(dot(lightDir, normal),0.0);
    float diff = max(dot(lightDir, normal), -dot(lightDir, normal));
    vec3 diffuse = u_diffuseLight * diff;
    //Specular
    vec3 reflectDir = reflect(-lightDir, normal);
    // float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    float spec = pow(max(dot(viewDir, reflectDir), -dot(viewDir, reflectDir)), u_shininess);
    vec3 specular = u_specularLight * spec * 0.5;
    // vec3 specular = vec3(0, 0, 0);


    vec4 texColor = texture2D(u_texture, v_texcoord);
    vec4 light = vec4((ambient + diffuse + specular), 1.0);
    vec4 color = texColor + u_objectColor;
    vec4 result = light * color;

    gl_FragColor = result;
}`;
export {vs, fs};