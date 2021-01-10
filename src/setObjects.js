import {myObject} from './myObject.js'
import {twgl, naturePackModelNames} from './main.js'


/********************************************
* Set up every models (initially)
*********************************************/



var initObjectList = function(objects)
{
    var viking_room=new myObject(), paper_plane=new myObject(), NaturePack_Part1=new myObject();
    var naturePack = [];
    naturePackModelNames.forEach(function () {
        naturePack.push(new Object());
    });

    objects.NaturePack_Part1 = NaturePack_Part1;
    objects.viking_room = viking_room;
    objects.paper_plane = paper_plane;
    objects.naturePack = naturePack;
}


var bindObjectsWithMeshes = function(objects, meshes, textures, programInfo, gl)
{
    const NaturePack_Part1 = objects.NaturePack_Part1;
    const viking_room = objects.viking_room;
    const paper_plane = objects.paper_plane;

    // var bind = function(curObjectName, curObject)
    // {
    //     /** Set curObject **/
    //     //Prepare buffer array
    //     const curObject_bufferArray = {};
    //     curObject_bufferArray.a_position = meshes[curObjectName].vertices;
    //     curObject_bufferArray.indices = meshes[curObjectName].indices;
    //     if(meshes[curObjectName].textures.length > 0) curObject_bufferArray.a_texcoord = meshes[curObjectName].textures;
    //     curObject_bufferArray.a_normal = meshes[curObjectName].vertexNormals;
    //     console.log(curObjectName, curObject_bufferArray)
    //     const curObject_bufferInfo = twgl.createBufferInfoFromArrays(gl, curObject_bufferArray);
    //     //Set programInfo, bufferInfo
    //     curObject.programInfo = programInfo;
    //     curObject.bufferInfo = curObject_bufferInfo;
    //     //Set more details
    //     if(textures[curObjectName])
    //         curObject.textures = textures[curObjectName];
    //     else curObject.objectColor = [1.0, 1.0, 1.0, 1.0];
    //     console.log(curObject);
    //     //Also, mark `useMTL` = *true*
    //     if(Object.keys(meshes[curObjectName].materialsByIndex).length > 0)
    //     {
    //         //Prepare indices by materials
    //         const curObject_bufferInfoByMaterial = []; //an array of indices arrays info
    //         meshes[curObjectName].indicesPerMaterial.forEach(function(object) {
    //             const curObject_bufferArrayByMaterial = {};
    //             curObject_bufferArrayByMaterial.a_position = meshes[curObjectName].vertices;
    //             curObject_bufferArrayByMaterial.indices = object;
    //             if(meshes[curObjectName].textures.length > 0) curObject_bufferArrayByMaterial.a_texcoord = meshes[curObjectName].textures;
    //             curObject_bufferArrayByMaterial.a_normal = meshes[curObjectName].vertexNormals;
    //             const tmpBufferInfo = twgl.createBufferInfoFromArrays(gl, curObject_bufferArrayByMaterial);
    //             curObject_bufferInfoByMaterial.push(tmpBufferInfo);
    //         });
    //         //add
    //         curObject.bufferInfoByMaterial = curObject_bufferInfoByMaterial;
    //         curObject.useMTL = true; //set flag
    //         curObject.materialIndices = meshes[curObjectName].materialIndices; //set material indices
    //         curObject.materialsByIndex = meshes[curObjectName].materialsByIndex; //set mtl
    //     }
    // }

    var bind = function(curObjectName, curObject)
    {
        curObject.programInfo = programInfo;
        if(textures[curObjectName])
            curObject.textures = textures[curObjectName];
        else curObject.objectColor = [1.0, 1.0, 1.0, 1.0];
        //Prepare indices by materials
        curObject.useMTL = meshes[curObjectName].useMTL;
        const curObject_bufferInfoByMaterial = []; //an array of indices arrays info
        curObject.materialsByIndex = [];
        curObject.geoNum = 0;
        meshes[curObjectName].geometries.forEach(function(object) {
            const curObject_bufferArrayByMaterial = {};
            curObject_bufferArrayByMaterial.a_position = object.data.vertices;
            if(object.data.textures) curObject_bufferArrayByMaterial.a_texcoord = object.data.textures;
            curObject_bufferArrayByMaterial.a_normal = object.data.vertexNormals;
            const tmpBufferInfo = twgl.createBufferInfoFromArrays(gl, curObject_bufferArrayByMaterial);
            curObject_bufferInfoByMaterial.push(tmpBufferInfo);
            
            if(meshes[curObjectName].useMTL)
            {
                const name = object.material;
                curObject.materialsByIndex.push(meshes[curObjectName].materials[name]);
            }
            curObject.geoNum++;
        });
        //add
        curObject.bufferInfoByMaterial = curObject_bufferInfoByMaterial; 
        console.log(curObject);
    }
    bind("NaturePack_Part1", NaturePack_Part1);
    // NaturePack_Part1.objectColor = [1.0, 1.0, 1.0, 1.0];    //(optional)If materials are provided (or enabled)
    bind("viking_room", viking_room);
    bind("paper_plane", paper_plane);

    var i = 0;

    objects.naturePack.forEach(function (tmp) {
        bind(naturePackModelNames[i], tmp)
        i++;
    });
    
    // ball_tree1.objectColor = [1.0, 1.0, 1.0, 1.0];    //(optional)If materials are provided (or enabled)
    
};

export {initObjectList, bindObjectsWithMeshes}