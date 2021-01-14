import * as twgl from "../modules/twgl/twgl-full.module.js";

class myObject {
    constructor() {
        //Basic attributes
        this.name = "";
        this.bufferInfoByMaterial = [];
        this.programInfo = undefined;
        //More details
        this.objectColor = [0, 0, 0, 0];
        this.useMTL = false;
        this.hasBoxInfo=false;
        this.boxInfo = [];
        this.textures=undefined;
        // if (this.useMTL), there would be these properties.
        this.materialsByIndex=[];
        this.geoNum=0;
        this.centroid=[0,0,0];
        this.boundingBox=[0,0,0];
    }

    /**
     * bind the current object with mesh, texture, programInfo
     * @param {string} curObjectName
     * @param {} mesh
     * @param {} texture
     * @param {import("../modules/twgl/twgl-full.module").ProgramInfo} programInfo
     */
    bind(curObjectName, mesh, texture, programInfo, gl) {
        this.name = curObjectName;
        this.programInfo = programInfo;
        if (texture)
            this.textures = texture;
        else this.objectColor = [1.0, 1.0, 1.0, 1.0];
        //Prepare indices by materials
        this.useMTL = mesh.useMTL;
        this.hasBoxInfo=true;
        const curObject_bufferInfoByMaterial = []; //an array of indices arrays info
        this.geoNum = 0;
        // use ()=> arrow function to avoid messing with this.
        const curObject_bufferArrayByMaterial = {};
        mesh.geometries.forEach((geometry)=>{
            curObject_bufferArrayByMaterial.a_position = geometry.data.vertices;
            if (geometry.data.textures) curObject_bufferArrayByMaterial.a_texcoord = geometry.data.textures;
            curObject_bufferArrayByMaterial.a_normal = geometry.data.vertexNormals;
            const tmpBufferInfo = twgl.createBufferInfoFromArrays(gl, curObject_bufferArrayByMaterial);
            curObject_bufferInfoByMaterial.push(tmpBufferInfo);

            if (mesh.useMTL) {
                const name = geometry.material;
                this.materialsByIndex.push(mesh.materials[name]);
            }
            //add box info
            this.boxInfo.push({
                centroid: geometry.centroid,
                boundingBox: geometry.boundingBox,
            });
            this.geoNum++;
        });
        //add
        this.bufferInfoByMaterial = curObject_bufferInfoByMaterial;
        // console.log(this);
    }
}

export { myObject };