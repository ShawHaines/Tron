import {myNode} from './myNode.js'
import {m4, naturePackModelNames} from './main.js'

const RANDOM_NATURE_NUM = 100;

var initNodeSet = function(nodes)
{
    var base_node = new myNode();
    var viking_room_node = new myNode();
    var paper_plane_node = new myNode();
    var NaturePack_Part1_node = new myNode();
    var sun_node = new myNode();
    var customized_light_nodes = [];
    for(var i = 0; i < 5; i++)
    {
        customized_light_nodes.push(new myNode());
    }
    var random_nature_nodes = []; //randomly generated
    for(var i = 0; i < RANDOM_NATURE_NUM; i++)
    {
        random_nature_nodes.push(new myNode());
    }
    var mountain_node = new myNode();

    nodes.base_node = base_node;
    nodes.viking_room_node = viking_room_node;
    nodes.paper_plane_node = paper_plane_node;
    nodes.NaturePack_Part1_node = NaturePack_Part1_node;
    nodes.sun_node = sun_node;
    nodes.customized_light_nodes = customized_light_nodes;
    nodes.random_nature_nodes = random_nature_nodes;
    nodes.mountain_node = mountain_node;
    // fighter_base is the yaw reference frame, fighter_pitch_roll takes care of the rest of the euler angle.
    // while the fighter needs to do some transformations to fit into the frame fighter_pitch_roll.
    nodes.fighter_base = new myNode();
    nodes.fighter_pitch_roll = new myNode();
    nodes.fighter = new myNode();
};

/** create nodes for objects **/
function setFrameTree(nodes){

    /** Set relationship of the scene graph **/
    nodes.viking_room_node.setParent(nodes.base_node);
    nodes.paper_plane_node.setParent(nodes.base_node);
    nodes.NaturePack_Part1_node.setParent(nodes.base_node);
    nodes.sun_node.setParent(nodes.base_node);
    nodes.customized_light_nodes.forEach(each => {
        each.setParent(nodes.base_node); 
    });
    nodes.fighter_base.setParent(nodes.base_node);
    nodes.fighter_pitch_roll.setParent(nodes.fighter_base);
    nodes.fighter.setParent(nodes.fighter_pitch_roll);
    nodes.random_nature_nodes.forEach(function (tmp) {
        tmp.setParent(nodes.base_node);
    });
    nodes.mountain_node.setParent(nodes.base_node);
    nodes.sun_node.setParent(nodes.base_node);

    /** Set Local Matrix **/
    let world = m4.identity();    
    // Set base node
    // world = m4.identity();
    // world = m4.multiply(world, m4.translation([0, -15, 0]));
    // m4.copy(world, nodes.base_node.localMatrix);
    
    //Set local matrix of sun.
    world = m4.identity();
    // FIXME: The order of the multiplication is still confusing.
    world = m4.multiply(world, m4.translation([0, 300, 0]));
    m4.rotateX(world,-Math.PI/2,world);
    m4.copy(world, nodes.sun_node.localMatrix);

    //Set local matrix of customized lights
    world = m4.identity();
    world = m4.multiply(world, m4.translation([0, 20, -20]));
    m4.copy(world, nodes.customized_light_nodes[0].localMatrix);
    
    //Set local matrix of NaturePack_Part1.
    world = m4.identity();
    world = m4.multiply(world, m4.translation([0, 0, 0]));
    m4.scale(world, [2, 2, 2], world);
    m4.copy(world, nodes.NaturePack_Part1_node.localMatrix);
    
    //Set local matrix of viking_room.
    world = m4.identity();
    world = m4.multiply(world, m4.rotationY(-135 * Math.PI / 180));
    world = m4.multiply(world, m4.rotationX(-90 * Math.PI / 180));
    m4.scale(world, [6, 6, 6], world);
    m4.copy(world, nodes.viking_room_node.localMatrix);
    
    //Set local matrix of paper_plane.
    world = m4.identity();
    world = m4.multiply(world, m4.translation([0, 14, 45]));
    world = m4.multiply(world, m4.rotationZ(200 * Math.PI / 180));
    world = m4.multiply(world, m4.rotationY(170 * Math.PI / 180));
    world = m4.multiply(world, m4.rotationX(25 * Math.PI / 180));
    m4.scale(world, [0.01, 0.01, 0.01], world);
    m4.copy(world, nodes.paper_plane_node.localMatrix);

    // initial position of the plane.
    nodes.fighter_base.localMatrix=m4.translation([0,5,0]);
    nodes.fighter_pitch_roll.localMatrix = m4.identity();
    //Set local matrix of fighter.
    world = m4.rotationZ(Math.PI/2);
    m4.rotateX(world,Math.PI/2,world);
    m4.scale(world, [0.01, 0.01, 0.01], world);
    m4.copy(world, nodes.fighter.localMatrix);

    nodes.random_nature_nodes.forEach(function (tmp) {
        tmp.xInit = Math.random() * 40 - 20;
        tmp.yInit = Math.random() * 40 - 20;
        tmp.zInit = Math.random() * 40 - 20;
        tmp.ySpeed = Math.random() * 2 - 1;
        tmp.x = tmp.xInit;
        tmp.y = tmp.yInit;
        tmp.z = tmp.zInit;
        tmp.xRotInit = Math.random() * 360;
        tmp.yRotInit = Math.random() * 360;
        tmp.zRotInit = Math.random() * 360;
        tmp.xRotSpeed = Math.random() * 0.4 - 1;
        tmp.yRotSpeed = Math.random() * 0.4 - 1;
        tmp.zRotSpeed = Math.random() * 0.4 - 1;
        tmp.xRot = tmp.xRotInit;
        tmp.yRot = tmp.yRotInit;
        tmp.zRot = tmp.zRotInit;
        

        world = m4.identity();
        world = m4.multiply(world, m4.translation([tmp.x, tmp.y, tmp.z]));
        world = m4.multiply(world, m4.rotateX(world, tmp.xRot / 180 * Math.PI));
        world = m4.multiply(world, m4.rotateY(world, tmp.yRot / 180 * Math.PI));
        world = m4.multiply(world, m4.rotateZ(world, tmp.zRot / 180 * Math.PI));
        // m4.scale(world, [5, 5, 5], world);
        m4.copy(world, tmp.localMatrix);
    });
    
    world = m4.identity();
    world = m4.multiply(world, m4.translation([-300, 0, -300]));
    m4.scale(world, [20, 20, 20], world);
    m4.copy(world, nodes.mountain_node.localMatrix);
}

/**
 * Here you should manually link some nodes to objects
 * @param{nodes}: all nodes(:{})
 * @param{objects}: all objects(:{})
**/
function linkObjects(nodes, objects){
    /** link nodes you want to draw with actual objects **/
    // setNodeAsObject(nodes.NaturePack_Part1_node, objects.NaturePack_Part1)
    setNodeAsObject(nodes.paper_plane_node, objects.paper_plane)
    // setNodeAsObject(nodes.viking_room_node, objects.viking_room)
    nodes.random_nature_nodes.forEach(function (tmp) {
        setNodeAsObject(tmp, objects.naturePack[Math.floor(Math.random() * 142)]);
    });
    setNodeAsObject(nodes.mountain_node, objects.mountain);
    setNodeAsObject(nodes.fighter,objects.paper_plane);
}

/**
 * Internal helper function
 * set `curNode` as an object (to draw)
 * copy `curObject`'s info to `curNode`
**/
function setNodeAsObject(curNode, curObject)
{
    curNode.type = "OBJECT";
    curNode.bindObject = curObject;
    curNode.bindObjectName = curObject.name;
    
    curNode.drawInfo = {
        groupNum: 0,
        programInfoList: [],
        bufferInfoList: [],
        uniformsList: [],
    };

    var curNodeDrawInfo = curNode.drawInfo;
    
    if(curObject.useMTL) {
        var i = 0;
        // curNodeDrawInfo.bufferInfoList = curObject.bufferInfoByMaterial;
        for(i = 0; i < curObject.geoNum; i++)
        {
            // curNodeDrawInfo.materialsByIndex.push(curObject.materialsByIndex[i]);
            curNodeDrawInfo.bufferInfoList.push(curObject.bufferInfoByMaterial[i]);
            curNodeDrawInfo.programInfoList.push(curObject.programInfo);
            curNodeDrawInfo.groupNum++;
            //Set uniform
            var uniform = {};
            uniform.u_texture = curObject.textures;
            if(curObject.objectColor) uniform.u_objectColor = curObject.objectColor;
            if(curObject.materialsByIndex[i].ambient) uniform.u_ambientMaterial = curObject.materialsByIndex[i].ambient;
            // uniform.u_ambientMaterial = [0, 0, 0];
            if(curObject.materialsByIndex[i].diffuse) uniform.u_diffuseMaterial = curObject.materialsByIndex[i].diffuse;
            if(curObject.materialsByIndex[i].specular) uniform.u_specularMaterial = curObject.materialsByIndex[i].specular;
            if(curObject.materialsByIndex[i].emissive) uniform.u_emissiveMaterial = curObject.materialsByIndex[i].emissive;
            uniform.u_shininess = 23.0;
            curNodeDrawInfo.uniformsList.push(uniform);
        }
    }
    else {
        curNodeDrawInfo.bufferInfoList.push(curObject.bufferInfoByMaterial[0]);
        curNodeDrawInfo.programInfoList.push(curObject.programInfo);
        curNodeDrawInfo.groupNum = 1;
        var uniform = {};
        uniform.u_texture = curObject.textures;
        uniform.u_objectColor = curObject.objectColor;
        uniform.u_ambientMaterial = [0.3, 0.3, 0.3];
        uniform.u_diffuseMaterial = [0.3, 0.3, 0.3];
        uniform.u_specularMaterial = [0.05, 0.05, 0.05];
        uniform.u_emissiveMaterial = [0, 0, 0];
        uniform.u_ambientStrength = 0.3;
        uniform.u_shininess = 32.0;
        curNodeDrawInfo.uniformsList.push(uniform);
    }
}

export {initNodeSet, setFrameTree, linkObjects}



// function setNodeAsObject(curNode, curObject)
// {
//     curNode.type = "OBJECT";
    
//     curNode.drawInfo = {
//         groupNum: 0,
//         programInfoList: [],
//         bufferInfoList: [],
//         uniformsList: [],
//     };

//     var curNodeDrawInfo = curNode.drawInfo;
    
//     if(curObject.useMTL) {
//         var i = 0;
//         // curNodeDrawInfo.bufferInfoList = curObject.bufferInfoByMaterial;
//         for(let materialIndex in curObject.materialIndices)
//         {
//             // curNodeDrawInfo.materialsByIndex.push(curObject.materialsByIndex[i]);
//             curNodeDrawInfo.bufferInfoList.push(curObject.bufferInfoByMaterial[i]);
//             curNodeDrawInfo.programInfoList.push(curObject.programInfo);
//             curNodeDrawInfo.groupNum++;
//             //Set uniform
//             var uniform = {};
//             uniform.u_texture = curObject.textures;
//             uniform.u_objectColor = curObject.objectColor;
//             uniform.u_ambientMaterial = curObject.materialsByIndex[i].ambient;
//             // uniform.u_ambientMaterial = [0, 0, 0];
//             uniform.u_diffuseMaterial = curObject.materialsByIndex[i].diffuse;
//             uniform.u_specularMaterial = curObject.materialsByIndex[i].specular;
//             uniform.u_emissiveMaterial = curObject.materialsByIndex[i].emissive;
//             uniform.u_shininess = 23.0;
//             curNodeDrawInfo.uniformsList.push(uniform);
//             i++;
//         }
//     }
//     else {
//         curNodeDrawInfo.bufferInfoList.push(curObject.bufferInfo);
//         curNodeDrawInfo.programInfoList.push(curObject.programInfo);
//         curNodeDrawInfo.groupNum = 1;
//         var uniform = {};
//         uniform.u_texture = curObject.textures;
//         uniform.u_objectColor = curObject.objectColor;
//         uniform.u_ambientMaterial = [0.3, 0.3, 0.3];
//         uniform.u_diffuseMaterial = [0.3, 0.3, 0.3];
//         uniform.u_specularMaterial = [0.05, 0.05, 0.05];
//         uniform.u_emissiveMaterial = [0, 0, 0];
//         uniform.u_ambientStrength = 0.3;
//         uniform.u_shininess = 32.0;
//         curNodeDrawInfo.uniformsList.push(uniform);
//     }
// }