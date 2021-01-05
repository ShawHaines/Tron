import {myObject} from './myObject.js'
import {twgl} from './main.js'


/********************************************
* Set up every models (initially)
*********************************************/



var initObjectList = function(objects)
{
    var viking_room=new myObject(), paper_plane=new myObject(), NaturePack_Part1=new myObject();

    objects.NaturePack_Part1 = NaturePack_Part1;
    objects.viking_room = viking_room;
    objects.paper_plane = paper_plane;
}


var bindObjectsDrawInfo = function(objects, meshes, textures, programInfo, gl)
{
    const NaturePack_Part1 = objects.NaturePack_Part1;
    const viking_room = objects.viking_room;
    const paper_plane = objects.paper_plane;

    /** Set NaturePack_Part1 **/
    //Prepare buffer array
    const NaturePack_Part1_bufferArray = {};
    NaturePack_Part1_bufferArray.a_position = meshes.NaturePack_Part1.vertices;
    NaturePack_Part1_bufferArray.indices = meshes.NaturePack_Part1.indices;
    NaturePack_Part1_bufferArray.a_texcoord = meshes.NaturePack_Part1.textures;
    NaturePack_Part1_bufferArray.a_normal = meshes.NaturePack_Part1.vertexNormals;
    const NaturePack_Part1_bufferInfo = twgl.createBufferInfoFromArrays(gl, NaturePack_Part1_bufferArray);
    //Set `drawInfo`
    //uniforms, programInfo, bufferInfo
    NaturePack_Part1.drawInfo.uniforms.u_texture = textures.NaturePack_Part1;
    NaturePack_Part1.drawInfo.programInfo = programInfo;
    NaturePack_Part1.drawInfo.bufferInfo = NaturePack_Part1_bufferInfo;
    NaturePack_Part1.drawInfo.uniforms.u_objectColor = [1.0, 1.0, 1.0, 1.0];    //(optional)If materials are provided (or enabled)
    //Set more details in `drawInfo`
    //Also, mark drawInfo.`useMTL` = *true*
    if(Object.keys(meshes.NaturePack_Part1.materialsByIndex).length > 0)
    {
        //Prepare indices by materials
        const NaturePack_Part1_bufferInfoByMaterial = []; //an array of indices arrays info
        meshes.NaturePack_Part1.indicesPerMaterial.forEach(function(object) {
            const NaturePack_Part1_bufferArrayByMaterial = {};
            NaturePack_Part1_bufferArrayByMaterial.a_position = meshes.NaturePack_Part1.vertices;
            NaturePack_Part1_bufferArrayByMaterial.indices = object;
            NaturePack_Part1_bufferArrayByMaterial.a_texcoord = meshes.NaturePack_Part1.textures;
            NaturePack_Part1_bufferArrayByMaterial.a_normal = meshes.NaturePack_Part1.vertexNormals;
            const tmpBufferInfo = twgl.createBufferInfoFromArrays(gl, NaturePack_Part1_bufferArrayByMaterial);
            NaturePack_Part1_bufferInfoByMaterial.push(tmpBufferInfo);
        });
        //add to drawInfo
        NaturePack_Part1.drawInfo.bufferInfoByMaterial = NaturePack_Part1_bufferInfoByMaterial;
        NaturePack_Part1.drawInfo.useMTL = true; //set flag
        NaturePack_Part1.drawInfo.materialIndices = meshes.NaturePack_Part1.materialIndices; //set material indices
        NaturePack_Part1.drawInfo.materialsByIndex = meshes.NaturePack_Part1.materialsByIndex; //set mtl
        console.log(NaturePack_Part1);
    }

    /** Set viking_room **/
    //Prepare buffer array
    const viking_room_bufferArray = {};
    viking_room_bufferArray.a_position = meshes.viking_room.vertices;
    viking_room_bufferArray.indices = meshes.viking_room.indices;
    viking_room_bufferArray.a_texcoord = meshes.viking_room.textures;
    viking_room_bufferArray.a_normal = meshes.viking_room.vertexNormals;
    const viking_room_bufferInfo = twgl.createBufferInfoFromArrays(gl, viking_room_bufferArray);
    //Set `drawInfo`
    //uniforms, programInfo, bufferInfo
    viking_room.drawInfo.uniforms.u_texture = textures.viking_room;
    viking_room.drawInfo.programInfo = programInfo;
    viking_room.drawInfo.bufferInfo = viking_room_bufferInfo;
    //(optional)If materials are provided (or enabled)
    //Set more details in `drawInfo`
    //Also, mark drawInfo.`useMTL` = *true*
    if(Object.keys(meshes.viking_room.materialsByIndex).length > 0)
    {
        //Prepare indices by materials
        const viking_room_bufferInfoByMaterial = []; //an array of indices arrays info
        meshes.viking_room.indicesPerMaterial.forEach(function(object) {
            const viking_room_bufferArrayByMaterial = {};
            viking_room_bufferArrayByMaterial.a_position = meshes.viking_room.vertices;
            viking_room_bufferArrayByMaterial.indices = object;
            viking_room_bufferArrayByMaterial.a_texcoord = meshes.viking_room.textures;
            viking_room_bufferArrayByMaterial.a_normal = meshes.viking_room.vertexNormals;
            const tmpBufferInfo = twgl.createBufferInfoFromArrays(gl, viking_room_bufferArrayByMaterial);
            viking_room_bufferInfoByMaterial.push(tmpBufferInfo);
        });
        //add to drawInfo
        viking_room.drawInfo.bufferInfoByMaterial = viking_room_bufferInfoByMaterial;
        viking_room.drawInfo.useMTL = true; //set flag
        viking_room.drawInfo.materialIndices = meshes.viking_room.materialIndices; //set material indices
        viking_room.drawInfo.materialsByIndex = meshes.viking_room.materialsByIndex; //set mtl
        console.log(viking_room);
    }
    
    
    /** Set paper_plane **/
    //Prepare buffer array
    const paper_plane_bufferArray = {};
    paper_plane_bufferArray.a_position = meshes.paper_plane.vertices;
    paper_plane_bufferArray.indices = meshes.paper_plane.indices;
    paper_plane_bufferArray.a_texcoord = meshes.paper_plane.textures;
    paper_plane_bufferArray.a_normal = meshes.paper_plane.vertexNormals;
    const paper_plane_bufferInfo = twgl.createBufferInfoFromArrays(gl, paper_plane_bufferArray);
    
    //Set `drawInfo`
    //uniforms, programInfo, bufferInfo
    paper_plane.drawInfo.uniforms.u_texture = textures.paper_plane;
    paper_plane.drawInfo.programInfo = programInfo;
    paper_plane.drawInfo.bufferInfo = paper_plane_bufferInfo;
};

var placeObjects = function(objects, nodes)
{
    /** Great! Now set nodes for objects initially **/
    //FIXME: an object should have > 1 node binds
    objects.NaturePack_Part1.node = nodes.NaturePack_Part1_node;
    objects.viking_room.node = nodes.viking_room_node;
    objects.paper_plane.node = nodes.paper_plane_node;
};

export {initObjectList, bindObjectsDrawInfo, placeObjects}