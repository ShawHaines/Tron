import { updateLights, Light } from './light.js';
import { twgl, m4, gl, shadowProgramInfo } from './main.js'
import { Camera } from './camera.js';
import { myNode } from './myNode.js';
/**
 * renderShadow.
 * @param {myNode} base_node
 * @param {[Light]} lights
 */
var renderShadow = function (base_node, lights) {
    // the sidelength of the area that is lit
    let sideLength = 300;
    let lightProjectionMatrix = m4.ortho(-sideLength / 2, sideLength / 2, -sideLength / 2, sideLength / 2, 5, 500);
    let lightWorldMatrix=lights[0].node.worldMatrix;
    let viewProjection=m4.multiply(lightProjectionMatrix,m4.inverse(lightWorldMatrix));
    //recursively draw from root.
    drawShadow(base_node, viewProjection);    
};

function drawShadow(curNode, viewProjection) {
    if (curNode.type == "OBJECT") {
        let drawInfo = curNode.drawInfo; //debug
        // console.log(curNode)
        for (var i = 0; i < drawInfo.groupNum; i++) {//traverse curNode's draw info
            /**
            * 3 important things to do:
            * program, uniforms, buffer(attributes)
            **/
            const uniform = drawInfo.uniformsList[i];
            const bufferInfo = drawInfo.bufferInfoList[i];

            uniform.u_world = curNode.worldMatrix;
            uniform.u_worldViewProjection = m4.multiply(viewProjection, curNode.worldMatrix);
            uniform.u_worldInverseTranspose = m4.transpose(m4.inverse(curNode.worldMatrix));

            twgl.setUniforms(shadowProgramInfo, uniform);
            twgl.setBuffersAndAttributes(gl, shadowProgramInfo, bufferInfo);
            // **draw**
            twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
        }
    }
    curNode.children.forEach(function (child) {
        drawShadow(child, viewProjection);
    });
}

export { renderShadow };