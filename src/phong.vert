attribute vec4 aPos;
attribute vec4 aNormal;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

varying vec3 Normal;
varying vec3 fragPos;
void main()
{
    gl_Position = projection * view * model * vec4(aPos, 1.0f);
    Normal = aNormal;
    fragPos = (model * vec4(aPos, 1.0f)).xyz;
}