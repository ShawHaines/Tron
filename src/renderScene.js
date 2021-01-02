import {twgl, m4, gl} from './main.js'

var renderScene = function(base_node, objects, objectsToDraw, myCamera){
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
            object.drawInfo.uniforms.u_world = object.worldMatrix;
            object.drawInfo.uniforms.u_worldViewProjection = m4.multiply(viewProjection, object.worldMatrix);
            
            //default lighting attributes
            object.drawInfo.uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(object.worldMatrix));
            object.drawInfo.uniforms.u_lightPos = [0, 3, 3];
            object.drawInfo.uniforms.u_viewPos = myCamera.Eye;
            object.drawInfo.uniforms.u_ambientLight = [1.0, 1.0, 1.0];
            object.drawInfo.uniforms.u_diffuseLight = [1.0, 1.0, 1.0];
            object.drawInfo.uniforms.u_specularLight = [1.0, 1.0, 1.0];
            object.drawInfo.uniforms.u_shininess = 50;
            object.drawInfo.uniforms.u_ambientStrength = 0.4;

            object.drawInfo.uniforms.u_ambientMaterial = [1.0, 1.0, 1.0];
            object.drawInfo.uniforms.u_diffuseMaterial = [1.0, 1.0, 1.0];
            object.drawInfo.uniforms.u_specularMaterial = [1.0, 1.0, 1.0];
        });
        /** Render `objectsToDraw` (a.k.a. `objects[i].drawInfo`) **/
        objectsToDraw.forEach(function(object) {
            var programInfo = object.programInfo;
            var bufferInfo = object.bufferInfo;
            
            /**
            * 3 important things to do:
            * program, uniforms, buffer(attributes)
            **/
            gl.useProgram(programInfo.program);

            if(object.useMTL) //if materials are specified
            {
                var i = 0;
                for(let materialIndex in object.materialIndices)
                {
                    //Set buffer
                    twgl.setBuffersAndAttributes(gl, programInfo, object.bufferInfoByMaterial[i]);
                    //Update material!
                    object.uniforms.u_ambientMaterial = object.materialsByIndex[i].ambient;
                    object.uniforms.u_diffuseMaterial = object.materialsByIndex[i].diffuse;
                    object.uniforms.u_specularMaterial = object.materialsByIndex[i].specular;
                    twgl.setUniforms(programInfo, object.uniforms);
                    // **draw**
                    twgl.drawBufferInfo(gl, object.bufferInfoByMaterial[i], gl.TRIANGLES);
                    i++;
                }
            }
            else //default
            {
                //Set buffer
                twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
                //Use default uniforms
                twgl.setUniforms(programInfo, object.uniforms);       
                // **draw**
                twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
            }
        });
};

export {renderScene}