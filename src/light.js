import { vec4 } from "../modules/gl-matrix/src/index.js"

class Light{
    /**
     * Creates an instance of Light. 
     * If empty is false, assign default values to light colors.
     * @param {boolean} [empty] If empty is not specified, assume empty is false.
     * @memberof Light
     */
    constructor(empty){
        empty= empty || false;
        this.uniforms = {
            // yet to be defined.
            u_lightNumber: 0,
            u_lightPos: [],
            u_ambientLight: [],
            u_diffuseLight: [],
            u_specularLight: [],
        };
        this.node={};
        if (!empty){
            /**
             * yet to be defined. Default is point source(the 4th component is 1).
             */
            this.uniforms.u_lightPos= [0,0,0,1];
            this.uniforms.u_ambientLight= [1.0, 1.0, 1.0];
            this.uniforms.u_diffuseLight= [1.0, 1.0, 1.0];
            this.uniforms.u_specularLight=[1.0, 1.0, 1.0];
        }
    }
    updatePosition(){
        if (this.uniforms.u_lightPos[3] > 0){
            // point source.
            // a point at the origin.
            let origin=vec4.fromValues(0,0,0,1);
            vec4.transformMat4(this.uniforms.u_lightPos, origin ,this.node.worldMatrix);
        } else{
            // directional light binds with the z axis of its node.
            let xAxis=vec4.fromValues(0,0,1,0);
            vec4.transformMat4(this.uniforms.u_lightPos, xAxis, this.node.worldMatrix);
        }
    }
}

/**
 * update position and pack all the lightPos from lightList into a giant uniform.
 * returns a giant pack of light.
 * Usage: at init times.
 * @param {[Light]} lightList
 * @returns {Light}
 */
function pack(lightList){
    var allLights=new Light(true);
    let uniforms=allLights.uniforms;
    lightList.forEach(function(light){
        // pack all the properties into allLights property.
        for (let property in uniforms){
            // console.log(property);
            if (Array.isArray(uniforms[property])){
                // console.log(property);
                uniforms[property].push.apply(uniforms[property],light.uniforms[property]);
            }
        }
        // Note that the u_lightPos should be updated.
    });
    // FIXME: length is unreliable.
    allLights.uniforms.u_lightNumber=lightList.length;
    return allLights;
}


/**
 * updates all the positions of the light.
 * Returns a list of position.
 * Usage: call before each render run
 * @param {[Light]} lightList
 * @returns {[number]} position
 */
function updateLights(lightList){
    var position=[];
    lightList.forEach(function(light){
        light.updatePosition();
        position.push.apply(position,light.uniforms.u_lightPos);
    });
    return position;
}

export {Light, updateLights, pack};