const vs=`
attribute vec4 a_position;
attribute vec2 a_texcoord;
attribute vec3 a_normal;

uniform mat4 u_world;
uniform mat4 u_worldView;
uniform mat4 u_worldViewProjection; //redundant for efficiency
uniform mat4 u_worldInverseTranspose; //for calculating v_normal
uniform mat4 u_textureMatrix; //for shadowsmapping texture.

varying vec3 v_normal;
varying vec3 v_viewWorldPosition;

void main()
{
    v_normal = normalize((u_worldInverseTranspose * vec4(a_normal, 0.0)).xyz); // 转换到视图空间
    v_viewWorldPosition = normalize(( u_worldView * vec4(a_position.xyz,1.0) ).xyz);
    gl_Position = u_worldViewProjection * a_position;
}
`

const fs=`
precision mediump float;
uniform vec3 u_glowColor;
uniform float u_bias; //bias
uniform float u_shininess; //power
uniform float u_scale; //scale

varying vec3 v_normal;
varying vec3 v_viewWorldPosition;
void main() 
{
    float a = pow( u_bias + u_scale * abs(dot(v_normal, v_viewWorldPosition)), u_shininess );
    gl_FragColor = vec4(u_glowColor, a);
}
`

export {vs, fs};