/********************************************
* Head
*********************************************/
import * as twgl from "../modules/twgl/twgl-full.module.js";
import {myCamera} from "./interaction.js";
import {myNode} from "./myNode.js";
import {myObject} from "./myObject.js";
import {Light, pack} from "./light.js";
import * as texture_shader from "../pages/Preview/src/texture-shader.js";
import {renderScene} from './renderScene.js';
const m4 = twgl.m4;
const gl = document.getElementById("c").getContext("webgl");

if (!gl) console.log("Failed");
const programInfo = twgl.createProgramInfo(gl, [texture_shader.vs, texture_shader.fs]);

/** Some global variables **/
var g_time; /** global time (keep updated in `render()`) **/


/********************************************
* Set up every models (initially)
*********************************************/

var base_node = new myNode();
var viking_room_node = new myNode();
var paper_plane_node = new myNode();

/** Wrap up all the objects. 
 * Add all the things you want to draw into `objects`**/
var viking_room=new myObject(),paper_plane=new myObject();
var objects = [viking_room,paper_plane];
var lights=[];
var cameras=[];
//If you want to update them later, use methods like `push()`...

/** Load Textures **/
const textures = twgl.createTextures(gl, {
// a power of 2 image
viking_room: { src: "./resource/viking_room.png", mag: gl.NEAREST },
paper_plane: { src: "./resource/paper+airplane_textures.jpg" }
});

/** Download objects; then call webGLStart() **/
window.onload = function(){

    let p = OBJ.downloadModels([
        {
            name: 'viking_room',
            obj: './resource/viking_room.obj', // located in the models folder on the server
            mtl: './resource/viking_room.mtl',
        },
        {
            name: 'paper_plane',
            obj: './resource/paper+airplane.obj',
        },
    ]);

    p.then(models => {
        webGLStart(models);
    });

    // OBJ.downloadMeshes({
    //     'viking_room': 'src/resource/viking_room.obj', // located in the models folder on the server
    //     'paper_plane': 'src/resource/paper+airplane.obj',
    // }, webGLStart);

}

//As long as meshes is downloaded successfully, do the following
function webGLStart(meshes){
    setFrameTree();
    /** Great! Now set every node initially **/
    
    /** Set viking_room node **/
    viking_room.node=viking_room_node;
    //Prepare buffer array
    const viking_room_bufferArray = {};
    viking_room_bufferArray.a_position = meshes.viking_room.vertices;
    viking_room_bufferArray.indices = meshes.viking_room.indices;
    viking_room_bufferArray.a_texcoord = meshes.viking_room.textures;
    viking_room_bufferArray.a_normal = meshes.viking_room.vertexNormals;
    const viking_room_bufferInfo = twgl.createBufferInfoFromArrays(gl, viking_room_bufferArray);
    //Set node.`drawInfo`
    //uniforms, programInfo, bufferInfo
    viking_room.drawInfo.uniforms.u_texture = textures.viking_room;
    viking_room.drawInfo.programInfo = programInfo;
    viking_room.drawInfo.bufferInfo = viking_room_bufferInfo;
    //(optional)If materials are provided (or enabled)
    //Set more details in node.`drawInfo`
    //Also, mark node.drawInfo.`useMTL` = *true*
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
    
    
    /** Set paper_plane node **/
    paper_plane.node=paper_plane_node;
    //Prepare buffer array
    const paper_plane_bufferArray = {};
    paper_plane_bufferArray.a_position = meshes.paper_plane.vertices;
    paper_plane_bufferArray.indices = meshes.paper_plane.indices;
    paper_plane_bufferArray.a_texcoord = meshes.paper_plane.textures;
    paper_plane_bufferArray.a_normal = meshes.paper_plane.vertexNormals;
    const paper_plane_bufferInfo = twgl.createBufferInfoFromArrays(gl, paper_plane_bufferArray);
    
    //Set node.`drawInfo`
    //uniforms, programInfo, bufferInfo
    paper_plane.drawInfo.uniforms.u_texture = textures.paper_plane;
    paper_plane.drawInfo.programInfo = programInfo;
    paper_plane.drawInfo.bufferInfo = paper_plane_bufferInfo;

    console.log(meshes);
    setLights();
    requestAnimationFrame(render);
}

function setLights(){
    let majorLight=new Light();
    majorLight.node=base_node;
    lights.push(majorLight);
    let allLights=pack(lights);
    // assign the light uniforms to all objects.
    objects.forEach(function(each){
        Object.assign(each.drawInfo.uniforms,allLights.uniforms);
    });
}
/** create nodes for objects **/
function setFrameTree(){
    /** Set relationship of the scene graph **/
    paper_plane_node.setParent(base_node);
    viking_room_node.setParent(base_node);

    /** Set base node **/
    // world = m4.identity();
    // world = m4.multiply(world, m4.translation([0, -15, 0]));
    // m4.copy(world, base_node.localMatrix);
    //Set local matrix of viking_room.
    let world = m4.identity();
    world = m4.multiply(world, m4.rotationY(-135 * Math.PI / 180));
    world = m4.multiply(world, m4.rotationX(-90 * Math.PI / 180));
    m4.scale(world, [30, 30, 30], world);
    m4.copy(world, viking_room_node.localMatrix);
    //Set local matrix of paper_plane.
    world = m4.identity();
    world = m4.multiply(world, m4.translation([0, 14, 45]));
    world = m4.multiply(world, m4.rotationZ(200 * Math.PI / 180));
    world = m4.multiply(world, m4.rotationY(170 * Math.PI / 180));
    world = m4.multiply(world, m4.rotationX(25 * Math.PI / 180));
    m4.scale(world, [0.02, 0.02, 0.02], world);
    m4.copy(world, paper_plane_node.localMatrix);
}

/********************************************
* [Example]: Rotate the paper plane 60 times a second
*********************************************/
setInterval(function(){
    var world = m4.identity();
    world = m4.multiply(world, m4.translation([0, 14, 45]));
    world = m4.multiply(world, m4.rotationX(1.1 * g_time));
    world = m4.multiply(world, m4.rotationZ(200 * Math.PI / 180));
    world = m4.multiply(world, m4.rotationY(170 * Math.PI / 180));
    world = m4.multiply(world, m4.rotationX(25 * Math.PI / 180));
    m4.scale(world, [0.02, 0.02, 0.02], world);
    m4.copy(world, paper_plane_node.localMatrix);
}, 1/60 * 1000);


/********************************************
* Render Function
*********************************************/
function render(time) {
    gl.clearColor(0, 0, 0, 1);

    time *= 0.001;
    g_time = time;

    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.CULL_FACE);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    renderScene(base_node, objects, lights, myCamera);
    
    requestAnimationFrame(render);
}


export {twgl, m4, gl};