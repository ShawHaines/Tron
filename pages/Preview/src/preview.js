import * as twgl from "../../../modules/twgl/twgl-full.module.js";
import { myCamera } from "./interaction.js";
import * as texture_shader from "./texture-shader-with-shadow.js"
import * as shadow_shader from "./shadow-shader.js"


const m4 = twgl.m4;
const gl = document.getElementById("c").getContext("webgl");
if (!gl) console.log("Failed");
const ext = gl.getExtension('WEBGL_depth_texture');
if (!ext) {
    alert('need WEBGL_depth_texture');  // eslint-disable-line
}
const programInfo = twgl.createProgramInfo(gl, [texture_shader.vs, texture_shader.fs]);
const shadowProgramInfo = twgl.createProgramInfo(gl, [shadow_shader.shadow_vs, shadow_shader.shadow_fs])

//Both ways work fine!
const arrays = {
    a_position: [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1],
    a_normal: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1],
    // texcoord: [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
    indices: [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23],
};
// const arrays = twgl.primitives.createCubeVertices(2);
const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
console.log(arrays)
console.log(bufferInfo)

const uniforms = {
    u_objectColor: [0.8, 0.8, 0.5, 1.0],
    // lightColor:[1.0,1.0,1.0],
    u_lightNumber: 2,
    u_lightPos: [0., 1, 5, 0, 2, 0, 2, 1],
    u_ambientLight: [1, 1, 1, 0.1, 0.1, 0.1],
    u_diffuseLight: [1, 1, 1, 0.1, 0.1, 0.1],
    u_specularLight: [1, 1, 1, 0.1, 0.1, 0.1],
    u_ambientStrength: 0.2,
    u_shininess: 200.0,
    u_ambientMaterial: [0.8, 0.8, 0.5],
    u_diffuseMaterial: [0.8, 0.8, 0.5],
    u_specularMaterial: [1, 1, 1],
};


//Set depth texture
const depthTexture = gl.createTexture();
const depthTextureSize = 1024;
gl.bindTexture(gl.TEXTURE_2D, depthTexture);
gl.texImage2D(
    gl.TEXTURE_2D,      // target
    0,                  // mip level
    gl.DEPTH_COMPONENT, // internal format
    depthTextureSize,   // width
    depthTextureSize,   // height
    0,                  // border
    gl.DEPTH_COMPONENT, // format
    gl.UNSIGNED_INT,    // type
    null);              // data
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

const depthFramebuffer = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
gl.framebufferTexture2D(
    gl.FRAMEBUFFER,       // target
    gl.DEPTH_ATTACHMENT,  // attachment point
    gl.TEXTURE_2D,        // texture target
    depthTexture,         // texture
    0);                   // mip level

// create a color texture of the same size as the depth texture
// see article why this is needed_
const unusedTexture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, unusedTexture);
gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    depthTextureSize,
    depthTextureSize,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null,
);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

// attach it to the framebuffer
gl.framebufferTexture2D(
    gl.FRAMEBUFFER,        // target
    gl.COLOR_ATTACHMENT0,  // attachment point
    gl.TEXTURE_2D,         // texture target
    unusedTexture,         // texture
    0);                    // mip level


function drawScene(time,projection, view, programInfo){
    gl.useProgram(programInfo.program);
    // 1st cube.
    let world = m4.rotationY(time);
    m4.scale(world, [0.5, 0.5, 0.5], world);
    m4.translate(world, [0, 0, 1], world);
    let uniforms={
        u_world:world,
        u_worldViewProjection:m4.multiply(projection,m4.multiply(view,world)),
        u_worldInverseTranspose:m4.transpose(m4.inverse(world)),
    };
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo,uniforms);
    twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES, bufferInfo.numelements);

    /** 2nd cube**/
    // world = m4.rotationY(time);
    world = m4.identity();
    m4.scale(world, [2, 2, 2], world);
    m4.translate(world, [0, 0, -2], world);
    uniforms = {
        u_world: world,
        u_worldViewProjection: m4.multiply(projection, m4.multiply(view, world)),
        u_worldInverseTranspose: m4.transpose(m4.inverse(world)),
    };
    twgl.setUniforms(programInfo,uniforms);
    twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES, bufferInfo.numelements);
}


function render(time) {
    gl.clearColor(0, 0, 0, 1);
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
    /** Render on depth texture */
    const lightWorldMatrix = m4.lookAt(
        [0, 1, 5], // position
        [0, 0, 0], // target
        [0, 1, 0], // up
    );
    const lightProjectionMatrix =
        m4.perspective(
            100 * Math.PI / 180,
            1.0 / 1.0,
            0.2,  // near
            20)   // far
        ;
    gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
    gl.viewport(0, 0, depthTextureSize, depthTextureSize);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // draw to the texture.
    var shadow_view_matrix = m4.inverse(lightWorldMatrix);
    gl.useProgram(shadowProgramInfo.program);
    drawScene(time,lightProjectionMatrix,m4.inverse(lightWorldMatrix),shadowProgramInfo);
    
    // draw to the scene and write something.
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    uniforms.u_viewPos = myCamera.Eye;
    uniforms.u_projectedTexture=depthTexture;
    let textureMatrix = m4.identity();
    // FIXME: Who could have expected that the bug came from here!
    // make full use of the 4 quadrants. 
    textureMatrix = m4.translate(textureMatrix, [0.5, 0.5, 0.5]);
    textureMatrix = m4.scale(textureMatrix, [0.5, 0.5, 0.5]);
    m4.multiply(textureMatrix,lightProjectionMatrix,textureMatrix);
    uniforms.u_textureMatrix = m4.multiply(textureMatrix, m4.inverse(lightWorldMatrix));
    
    gl.useProgram(programInfo.program);
    twgl.setUniforms(programInfo, uniforms);

    drawScene(time,projection,view,programInfo);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);