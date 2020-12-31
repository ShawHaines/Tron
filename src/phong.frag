// precision highp float;
uniform vec3 objectColor;
uniform vec3 lightColor;
uniform vec3 lightPos;
uniform vec3 viewPos;

varying vec3 Normal;
varying vec3 fragPos;
void main()
{
    float ambientStrength = 0.1;
    vec3 ambient = ambientStrength * lightColor;

    vec3 lightDir = normalize(lightPos - fragPos);
    float diff = max(dot(lightDir, normalize(Normal)),0.0);
    vec3 diffuse = lightColor * diff;

    vec3 viewDir = normalize(viewPos - fragPos);
    vec3 reflectDir = reflect(-lightDir, normalize(Normal));
    // 32 times
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32);
    vec3 specular = lightColor * spec * 0.5;

    vec3 result = (ambient + diffuse + specular)* objectColor;

    gl_FragColor = vec4(result, 1.0);
}