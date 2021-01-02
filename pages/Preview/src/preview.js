import * as twgl from "../../../modules/twgl/twgl-full.module.js";
import {myCamera} from "./interaction.js";
import * as phong from "./phong-shader.js";
import * as texture_shader from "./texture-shader.js"

const m4 = twgl.m4;
const gl = document.getElementById("c").getContext("webgl");
if (!gl) console.log("Failed");
const programInfo = twgl.createProgramInfo(gl, [texture_shader.vs, texture_shader.fs]);

//Both ways work fine!
const arrays = {
    a_position:     [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1],
    a_normal:   [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1],
    // texcoord: [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
    indices:  [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23],
};
// const arrays = twgl.primitives.createCubeVertices(2);
const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
console.log(arrays)
console.log(bufferInfo)

const uniforms = {
    u_objectColor:[0.8,0.8,0.5,1.0],
    // lightColor:[1.0,1.0,1.0],
    u_lightNumber:2,
    u_lightPos:[0.,0.,5,5,0,5],
    u_ambientLight: [1,1,1,0.1,0.1,0.1],
    u_diffuseLight: [1,1,1,0.1,0.1,0.1],
    u_specularLight:[1,1,1,0.1,0.1,0.1],
    u_ambientStrength:0.2,
    u_shininess: 200.0,
    u_ambientMaterial:[0.8,0.8,0.5],
    u_diffuseMaterial:[0.8,0.8,0.5],
    u_specularMaterial:[1,1,1],
};

function render(time) {
    gl.clearColor(0,0,0,1);
    time *= 0.001;
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fov = 30 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.5;
    const zFar = 15;
    const projection = m4.perspective(fov, aspect, zNear, zFar);

    const camera = m4.lookAt(myCamera.Eye, myCamera.Target, myCamera.Up);
    const view = m4.inverse(camera);
    const viewProjection = m4.multiply(projection, view);
    const world = m4.rotationY(time);

    // uniforms.view = view;
    // uniforms.model = world;
    // uniforms.projection = projection;
    uniforms.u_world=world;
    uniforms.u_worldViewProjection=m4.multiply(viewProjection,world);
    uniforms.u_worldInverseTranspose=m4.transpose(m4.inverse(world));
    uniforms.u_viewPos=myCamera.Eye;
    // uniforms.u_worldViewProjection = m4.multiply(viewProjection, world);

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);

    //All 3 ways work fine!
    twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES, bufferInfo.numelements);
    // twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
    // gl.drawElements(gl.TRIANGLES, bufferInfo.numElements, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);