const shadow_vs = `
attribute vec4 a_position;

uniform mat4 u_world;
uniform mat4 u_worldViewProjection; //redundant for efficiency
// uniform mat4 u_worldInverseTranspose;

void main() {
  // Multiply the position by the matrices.
  gl_Position = u_worldViewProjection * a_position;
}
`;

const shadow_fs =
`precision mediump float;

vec4 u_color=vec4(1.0,0.0,0.0,0.0);
void main() {
  gl_FragColor = u_color;
}
`;
export {shadow_vs, shadow_fs};