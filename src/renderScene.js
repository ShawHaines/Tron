import { updateLights,Light } from './light.js';
import { twgl, m4, gl, depthFramebufferInfo} from './main.js'
import {Camera} from './camera.js';
import { myNode } from './myNode.js';
import { attributes } from '../modules/twgl/twgl-full.module.js';
/**
 * renderScene.
 * @param {myNode} base_node
 * @param {[Light]} lights
 * @param {Camera} myCamera
 */
var renderScene = function(base_node, lights, myCamera){
    const projection=myCamera.projection;
    const view = myCamera.viewMatrix;
    const viewProjection = m4.multiply(projection, view);
    let lightPos=updateLights(lights);
    // the sidelength of the area that is lit
    let sideLength = 300;
    let lightProjectionMatrix = m4.ortho(-sideLength / 2, sideLength / 2, -sideLength / 2, sideLength / 2, -300, 300);
    let lightWorldMatrix = lights[0].node.worldMatrix;
    let textureMatrix=m4.identity();
    textureMatrix = m4.translate(textureMatrix, [0.5, 0.5, 0.5]);
    textureMatrix = m4.scale(textureMatrix, [0.5, 0.5, 0.5]);
    m4.multiply(textureMatrix, lightProjectionMatrix, textureMatrix);
    m4.multiply(textureMatrix, m4.inverse(lightWorldMatrix), textureMatrix);
    //recursively draw from root
    drawNode(base_node, viewProjection);

    function drawNode(curNode) {
        if (curNode.type == "OBJECT" || curNode.type == "BOUNDINGBOX") {
            let drawInfo = curNode.drawInfo; //debug
            // console.log(curNode)
            for (var i = 0; i < drawInfo.groupNum; i++) //traverse curNode's draw info
            {
                /**
                * 3 important things to do:
                * program, uniforms, buffer(attributes)
                **/
                const uniform = drawInfo.uniformsList[i];
                const programInfo = drawInfo.programInfoList[i];
                const bufferInfo = drawInfo.bufferInfoList[i];
                // const programInfo = drawInfo.programInfo;
                // const bufferInfo = drawInfo.bufferInfo;

                uniform.u_world = curNode.worldMatrix;
                uniform.u_worldView = m4.multiply(view, curNode.worldMatrix);
                uniform.u_worldViewProjection = m4.multiply(viewProjection, curNode.worldMatrix);
                uniform.u_viewPos = myCamera.position;
                //default lighting attributes
                uniform.u_worldInverseTranspose = m4.transpose(m4.inverse(curNode.worldMatrix));
                uniform.u_lightPos = lightPos;
                uniform.u_textureMatrix = textureMatrix;
                uniform.u_projectedTexture=depthFramebufferInfo.attachments[0];

                gl.useProgram(programInfo.program);
                twgl.setUniforms(programInfo, uniform);
                twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
                // **draw**
                twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
                if(curNode.type == "OBJECT") twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
                else if (window.wireFrame) twgl.drawBufferInfo(gl, bufferInfo, gl.LINES);
            }
        }
        curNode.children.forEach(function (child) {
            drawNode(child, viewProjection);
        });
    }
};

export {renderScene};