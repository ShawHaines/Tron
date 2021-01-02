/********************************************
* Head
*********************************************/
import * as twgl from "../modules/twgl/twgl-full.module.js";
import {myCamera} from "./interaction.js";
import {myNode} from './myNode.js';
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
var objects = []; /**  Wrap every object **/

/** create nodes for objects **/
var base_node = new myNode();
var viking_room_node = new myNode();
var paper_plane_node = new myNode();

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
    var world = m4.identity();

    /** Set relationship of the scene graph **/
    paper_plane_node.setParent(base_node);
    viking_room_node.setParent(base_node);

    /** Add all the things you want to draw into `objects`**/
    objects = [
        viking_room_node,
        paper_plane_node,
    ];
    //If you want to update them later, use methods like `push()`...


    /** Great! Now set every node initially **/

    /** Set base node **/
    world = m4.identity();
    world = m4.multiply(world, m4.translation([0, -15, 0]));
    m4.copy(world, base_node.localMatrix);

    
    /** Set viking_room node **/
    //Prepare buffer array
    const viking_room_bufferArray = {};
    viking_room_bufferArray.a_position = meshes.viking_room.vertices;
    viking_room_bufferArray.indices = meshes.viking_room.indices;
    viking_room_bufferArray.a_texcoord = meshes.viking_room.textures;
    viking_room_bufferArray.a_normal = meshes.viking_room.vertexNormals;
    const viking_room_bufferInfo = twgl.createBufferInfoFromArrays(gl, viking_room_bufferArray);
    //Set local matrix
    world = m4.identity();
    world = m4.multiply(world, m4.rotationY(-135 * Math.PI / 180));
    world = m4.multiply(world, m4.rotationX(-90 * Math.PI / 180));
    m4.scale(world, [30, 30, 30], world);
    m4.copy(world, viking_room_node.localMatrix);
    //Set node.`drawInfo`
    //uniforms, programInfo, bufferInfo
    viking_room_node.drawInfo.uniforms.u_texture = textures.viking_room;
    viking_room_node.drawInfo.programInfo = programInfo;
    viking_room_node.drawInfo.bufferInfo = viking_room_bufferInfo;
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
        viking_room_node.drawInfo.bufferInfoByMaterial = viking_room_bufferInfoByMaterial;
        viking_room_node.drawInfo.useMTL = true; //set flag
        viking_room_node.drawInfo.materialIndices = meshes.viking_room.materialIndices; //set material indices
        viking_room_node.drawInfo.materialsByIndex = meshes.viking_room.materialsByIndex; //set mtl
        console.log(viking_room_node);
    }
    
    

    /** Set paper_plane node **/
    //Prepare buffer array
    const paper_plane_bufferArray = {};
    paper_plane_bufferArray.a_position = meshes.paper_plane.vertices;
    paper_plane_bufferArray.indices = meshes.paper_plane.indices;
    paper_plane_bufferArray.a_texcoord = meshes.paper_plane.textures;
    paper_plane_bufferArray.a_normal = meshes.paper_plane.vertexNormals;
    const paper_plane_bufferInfo = twgl.createBufferInfoFromArrays(gl, paper_plane_bufferArray);
    //Set local matrix
    world = m4.identity();
    world = m4.multiply(world, m4.translation([0, 14, 45]));
    world = m4.multiply(world, m4.rotationZ(200 * Math.PI / 180));
    world = m4.multiply(world, m4.rotationY(170 * Math.PI / 180));
    world = m4.multiply(world, m4.rotationX(25 * Math.PI / 180));
    m4.scale(world, [0.02, 0.02, 0.02], world);
    m4.copy(world, paper_plane_node.localMatrix);
    //Set node.`drawInfo`
    //uniforms, programInfo, bufferInfo
    paper_plane_node.drawInfo.uniforms.u_texture = textures.paper_plane;
    paper_plane_node.drawInfo.programInfo = programInfo;
    paper_plane_node.drawInfo.bufferInfo = paper_plane_bufferInfo;

    console.log(meshes);
    setObjects();
    requestAnimationFrame(render);
}

function setObjects(){
    const defaultUniform={
        u_lightNumber : 1,
        u_lightPos :[0, 3, 3],
        u_ambientLight :[1.0, 1.0, 1.0],
        u_diffuseLight :[1.0, 1.0, 1.0],
        u_specularLight :[1.0, 1.0, 1.0],
        u_shininess : 50,
        u_ambientStrength : 0.4,

        u_ambientMaterial :[1.0, 1.0, 1.0],
        u_diffuseMaterial :[1.0, 1.0, 1.0],
        u_specularMaterial :[1.0, 1.0, 1.0],
    }
    objects.forEach(function(each){
        Object.assign(each.drawInfo.uniforms,defaultUniform);
    });
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
    
    renderScene(base_node, objects, myCamera);
    
    requestAnimationFrame(render);
}


export {twgl, m4, gl};