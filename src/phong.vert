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
}