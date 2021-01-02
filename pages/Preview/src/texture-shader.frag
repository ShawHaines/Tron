precision mediump float;
const int Max_Light=10;
varying vec2 v_texcoord;
varying vec4 v_position;
varying vec4 v_realPosition;

varying vec3 v_normal;
varying vec3 v_fragPos;

uniform vec4 u_objectColor;
uniform sampler2D u_texture;

// the number of lights in the scene.
uniform int u_lightNumber;
uniform vec3 u_lightPos[Max_Light];
uniform vec3 u_ambientLight[Max_Light];
uniform vec3 u_diffuseLight[Max_Light];
uniform vec3 u_specularLight[Max_Light];

uniform vec3 u_viewPos;
uniform float u_ambientStrength;
uniform float u_shininess;
uniform vec3 u_ambientMaterial;
uniform vec3 u_diffuseMaterial;
uniform vec3 u_specularMaterial;


void main() {
    vec4 result=vec4(0.0);
    for (int i=0;i<Max_Light;i++){
    // vec3 lightColor = vec3(1.0, 1.0, 1.0); //debug use
    // float ambientStrength = 0.5; //debug use
    if (i>=u_lightNumber) break;
    vec3 normal = normalize(v_normal);
    vec3 lightDir = normalize(u_lightPos[i] - v_fragPos);
    vec3 viewDir = normalize(u_viewPos - v_fragPos);

    //Ambient
    vec3 ambient = u_ambientStrength * u_ambientLight[i] * u_ambientMaterial;
    //Diffuse
    // float diff = max(dot(lightDir, normal),0.0);
    float diff = max(dot(lightDir, normal), -dot(lightDir, normal));
    vec3 diffuse = u_diffuseLight[i] * u_diffuseMaterial * diff;
    //Specular
    vec3 reflectDir = reflect(-lightDir, normal);
    // float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    float spec = pow(max(dot(viewDir, reflectDir), -dot(viewDir, reflectDir)), u_shininess);
    vec3 specular = u_specularLight[i] * u_specularMaterial * spec * 0.5;
    // vec3 specular = vec3(0, 0, 0);


    vec4 texColor = texture2D(u_texture, v_texcoord);
    vec4 light = vec4((ambient + diffuse + specular), 1.0);
    vec4 color = texColor + u_objectColor;
    result+=light*color;
}
gl_FragColor = result;
}