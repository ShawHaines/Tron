import { updateLights,Light } from './light.js';
import {twgl, m4, gl} from './main.js'
import {Camera} from './camera.js';
import { myNode } from './myNode.js';

/**
 * renderScene.
 *
 * @param {myNode} base_node
 * @param {[Light]} lights
 * @param {Camera} myCamera
 */
var renderScene = function(base_node, lights, myCamera){
        const projection=myCamera.projection;
        const view = myCamera.viewMatrix;
        const viewProjection = m4.multiply(projection, view);

        /** Update world matrix for every node **/
        base_node.updateWorldMatrix();
        let lightPos=updateLights(lights);
        
        
        var drawNode = function(curNode){
            if(curNode.type == "OBJECT")
            {
                let drawInfo = curNode.drawInfo; //debug
                // console.log(curNode)
                for(var i = 0; i < drawInfo.groupNum; i++) //traverse curNode's draw info
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
                    uniform.u_worldViewProjection = m4.multiply(viewProjection, curNode.worldMatrix);
                    uniform.u_viewPos = myCamera.position;
                    //default lighting attributes
                    uniform.u_worldInverseTranspose = m4.transpose(m4.inverse(curNode.worldMatrix));
                    uniform.u_lightPos=lightPos;

                    
                    gl.useProgram(programInfo.program);
                    twgl.setUniforms(programInfo, uniform);
                    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
                    // **draw**
                    twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
                }
            }
            curNode.children.forEach(function (child) {
                drawNode(child);
            });
        }
        //recursively draw from root
        drawNode(base_node);
};

export {renderScene}