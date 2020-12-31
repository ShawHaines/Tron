const vs = `#version 300 es
    in vec4 position;
    uniform mat4 u_worldViewProjection;
    out vec4 v_position;
    out vec4 v_realPosition;
    void main() {
        v_realPosition = position;
        v_position =  u_worldViewProjection * position;
        gl_Position = v_position;
    }
    `;

const fs = `#version 300 es
    precision mediump float; 
    in vec4 v_position;
    in vec4 v_realPosition;
    out vec4 fragColor;
    void main() {
        // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        fragColor = vec4(v_realPosition.xyz, 1.0);
    }`;

var camera_x = 0;
var camera_y = 0;
var camera_z = 0;

import * as twgl from '../modules/twgl-full.module.js';
const m4 = twgl.m4;
const gl = document.getElementById("c").getContext("webgl2");
if (!gl) console.log("Failed");
const programInfo = twgl.createProgramInfo(gl, [vs, fs]);

//Both ways work fine!
// const arrays = {
//     position: [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1],
//     // normal:   [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1],
//     // texcoord: [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
//     indices:  [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23],
// };
const arrays = twgl.primitives.createCubeVertices(2);
const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
console.log(arrays)
console.log(bufferInfo)

const uniforms = {
};

function render(time) {
    time *= 0.001;
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fov = 30 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.5;
    const zFar = 10;
    const projection = m4.perspective(fov, aspect, zNear, zFar);
    const eye = [1 + camera_x, 4 + camera_y, -6 + camera_z];
    const target = [0 + camera_x, 0 + camera_y, 0 + camera_z];
    const up = [0, 1, 0];

    const camera = m4.lookAt(eye, target, up);
    const view = m4.inverse(camera);
    const viewProjection = m4.multiply(projection, view);
    const world = m4.rotationY(time);

    // uniforms.u_viewInverse = camera;
    // uniforms.u_world = world;
    // uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(world));
    uniforms.u_worldViewProjection = m4.multiply(viewProjection, world);

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);

    //All 3 ways work fine!
    // twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES, bufferInfo.numelements);
    twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
    // gl.drawElements(gl.TRIANGLES, bufferInfo.numElements, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);

document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "w":
            camera_z += 1;
            break;
        case "a":
            camera_x += 1;
            break;
        case "s":
            camera_z -= 1;
            break;
        case "d":
            camera_x -= 1;
            break;
    }
});

    // document.addEventListener("keyup", function(){ 
    //     sq.style.cssText=`
    //     top:${y}px;
    //     left:${x}px;
    //     transition:all ease-in-out 1s ;
    //     `;
    // })