import {myObject} from './myObject.js'
import {twgl, naturePackModelNames} from './main.js'
import {terrain} from './terrain.js'


/********************************************
* Set up every models (initially)
*********************************************/



var initObjectList = function(objects)
{
    var viking_room=new myObject(), paper_plane=new myObject(), NaturePack_Part1=new myObject();
    var mountain = new myObject();
    var naturePack = [];
    naturePackModelNames.forEach(function () {
        naturePack.push(new myObject());
    });

    objects.NaturePack_Part1 = NaturePack_Part1;
    objects.viking_room = viking_room;
    objects.paper_plane = paper_plane;
    objects.naturePack = naturePack;
    objects.mountain = mountain;
    objects.fighter = new myObject();
}



/**
 * Bind objects in the objectList with meshes and textures.
 *
 * @param {{myObject}} objects a dictionary of objects.
 * @param {*} meshes
 * @param {*} textures
 * @param {import('../modules/twgl/twgl-full.module.js').ProgramInfo} programInfo
 * @param {*} gl
 */
var bindObjectsWithMeshes = function(objects, meshes, textures, programInfo, gl)
{
    const NaturePack_Part1 = objects.NaturePack_Part1;
    
    /** @type {myObject} */
    const mountain = objects.mountain;
    const viking_room = objects.viking_room;
    const paper_plane = objects.paper_plane;
    const fighter = objects.fighter;

    /**
     * bind short utility funcion.
     * @param {myObject} obj
     * @param {string} name
     */
    function bindObjectByName(obj,name){
        obj.bind(name,meshes[name],textures[name],programInfo,gl);
    }
    
    bindObjectByName(viking_room,"viking_room");
    bindObjectByName(paper_plane,"paper_plane");
    bindObjectByName(fighter,"fighter");
    // bindObject(NaturePack_Part1,"NaturePack_Part1");
    // NaturePack_Part1.objectColor = [1.0, 1.0, 1.0, 1.0];    //(optional)If materials are provided (or enabled)

    var i = 0;
    objects.naturePack.forEach(function (tmp) {
        bindObjectByName(tmp,naturePackModelNames[i++]);
    });

    //bind mountain terrain
    var myTerrain = new terrain(30);
    myTerrain.createTerrain();
    myTerrain.computefaceNormal();
    myTerrain.computevertexNormal();
    mountain.programInfo = programInfo;
    mountain.useMTL = true;
    mountain.objectColor = [1.0, 1.0, 1.0, 1.0];
    mountain.bufferInfoByMaterial = [];
    mountain.materialsByIndex = [];
    mountain.geoNum = 1;
    const mountain_bufferArrayByMaterial = {};
    mountain_bufferArrayByMaterial.a_position = myTerrain.position;
    mountain_bufferArrayByMaterial.a_normal = myTerrain.normal;
    mountain_bufferArrayByMaterial.a_texcoord = myTerrain.texcoord;
    mountain_bufferArrayByMaterial.indices = myTerrain.indices;
    const tmpBufferInfo = twgl.createBufferInfoFromArrays(gl, mountain_bufferArrayByMaterial);
    mountain.bufferInfoByMaterial.push(tmpBufferInfo);
    const mountainMaterial = {
        ambient: [0.1, 0.1, 0.1],
        diffuse: [0.087083 * 2, 0.192105 * 2, 0.012817 * 2],
        specular: [0.05, 0.05, 0.05],
        emissive: [0, 0, 0]
    }
    mountain.materialsByIndex.push(mountainMaterial);
    console.log(myTerrain);
    console.log(mountain);
    
    
    // ball_tree1.objectColor = [1.0, 1.0, 1.0, 1.0];    //(optional)If materials are provided (or enabled)
    
};

export {initObjectList, bindObjectsWithMeshes}