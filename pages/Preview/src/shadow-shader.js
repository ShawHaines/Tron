const shadow_vs = `
attribute vec4 a_position;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_world;

void main() {
  // Multiply the position by the matrices.
  gl_Position = u_projection * u_view * u_world * a_position;
}
`;

const shadow_fs =
`precision mediump float;

uniform vec4 u_color;
void main() {
  gl_FragColor = u_color;
}
`;
export {shadow_vs, shadow_fs};