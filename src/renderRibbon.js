import {updateLights, Light} from "./light.js";
import * as twgl from "../modules/twgl/twgl-full.module.js";
import {gl} from "./main.js";
import {Camera} from "./camera.js";
import {myNode} from "./myNode.js";
import * as flight from "../pages/Flight/flight.js";
const m4=twgl.m4;
/**
 * renderRibbon.
 * @param {[Light]} lights
 * @param {Camera} cam
 * @param {twgl.ProgramInfo} programInfo
 */
var renderRibbon = function (lights, camera, programInfo, ribbonColor) {
    // draw ribbon.
    if (flight.ribbonLength > 1) {
        // draw the transparent objects.
        gl.enable(gl.BLEND); // blending
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.depthMask(false); //lock the depth writing
        const projection = camera.projection;
        const view = camera.viewMatrix;
        const viewProjection = m4.multiply(projection, view);
        let ribbonBufferInfo = twgl.createBufferInfoFromArrays(gl, flight.ribbon);
        gl.useProgram(programInfo.program);
        twgl.setBuffersAndAttributes(gl, programInfo, ribbonBufferInfo);
        let uniform = {};
        uniform.u_world = m4.identity();
        uniform.u_worldView = view;
        uniform.u_worldViewProjection = viewProjection;
        uniform.u_viewPos = camera.position;
        //default lighting attributes
        uniform.u_worldInverseTranspose = m4.identity();
        uniform.u_lightPos = updateLights(lights);
        uniform.u_glowColor = ribbonColor;
        uniform.u_shininess = 5.0;
        uniform.u_bias = 0.95;
        uniform.u_scale = -0.6;
        twgl.setUniforms(programInfo, uniform);
        twgl.drawBufferInfo(gl, ribbonBufferInfo, gl.TRIANGLES, ribbonBufferInfo.numelements);
        gl.depthMask(true); //reset blending settings.
        gl.disable(gl.BLEND);
    }
};

export {renderRibbon};