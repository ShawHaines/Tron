import {twgl, m4, gl} from './main.js'

var renderScene = function(base_node, objects, myCamera){
        /** Set projection matrix **/
        const fov = 30 * Math.PI / 180;
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.5;
        const zFar = 500;
        const projection = m4.perspective(fov, aspect, zNear, zFar);

        const camera = m4.lookAt(myCamera.Eye, myCamera.Target, myCamera.Up);
        const view = m4.inverse(camera);
        const viewProjection = m4.multiply(projection, view);

        /** Update world matrix for every node **/
        base_node.updateWorldMatrix();
        /** Set default `uniforms` for each element in `objects` **/
        objects.forEach(function(object) {
            let each=object.drawInfo;
            each.uniforms.u_world = object.node.worldMatrix;
            each.uniforms.u_worldViewProjection = m4.multiply(viewProjection, object.node.worldMatrix);
            each.uniforms.u_viewPos = myCamera.Eye;
            //default lighting attributes
            each.uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(object.node.worldMatrix));

            let programInfo = each.programInfo;
            let bufferInfo = each.bufferInfo;
            
            /**
            * 3 important things to do:
            * program, uniforms, buffer(attributes)
            **/
            gl.useProgram(programInfo.program);

            if(each.useMTL) //if materials are specified
            {
                var i = 0;
                for(let materialIndex in each.materialIndices)
                {
                    //Set buffer
                    twgl.setBuffersAndAttributes(gl, programInfo, each.bufferInfoByMaterial[i]);
                    //Update material!
                    each.uniforms.u_ambientMaterial = each.materialsByIndex[i].ambient;
                    each.uniforms.u_diffuseMaterial = each.materialsByIndex[i].diffuse;
                    each.uniforms.u_specularMaterial = each.materialsByIndex[i].specular;
                    twgl.setUniforms(programInfo, each.uniforms);
                    // **draw**
                    twgl.drawBufferInfo(gl, each.bufferInfoByMaterial[i], gl.TRIANGLES);
                    i++;
                }
            }
            else //default
            {
                //Set buffer
                twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
                //Use default uniforms
                twgl.setUniforms(programInfo, each.uniforms);       
                // **draw**
                twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
            }
        });
};

export {renderScene}