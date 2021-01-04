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
import {initObjectList, bindObjectsDrawInfo, placeObjects} from './setObjects.js'
import {initNodeSet, setFrameTree} from './setNodes.js'
const m4 = twgl.m4;
const gl = document.getElementById("c").getContext("webgl");

if (!gl) console.log("Failed");
const programInfo = twgl.createProgramInfo(gl, [texture_shader.vs, texture_shader.fs]);

/** Some global variables **/
var g_time; /** global time (keep updated in `render()`) **/

/** IMPORTANT THINGS **/
var nodes = {};
var objects = {};
var lights=[];
var cameras=[];


//If you want to update them later, use internal methods...

/** Load Textures **/
const textures = twgl.createTextures(gl, {
    // a power of 2 image
    viking_room: { src: "./resource/viking_room.png", mag: gl.NEAREST },
    paper_plane: { src: "./resource/paper+airplane_textures.jpg" }
    })

/** Download objects; then call webGLStart() **/
window.onload = function(){
    /** Load Models **/
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
        {
            name: 'NaturePack_Part1',
            obj: '/xth/src/resource/uploads_files_2242278_NaturePack/NaturePack_Part1.obj',
            mtl: '/xth/src/resource/uploads_files_2242278_NaturePack/NaturePack_Part1.mtl',
        },
    ]);

    p.then(models => {
        webGLStart(models);
    });
}

//As long as meshes is downloaded successfully, do the following
function webGLStart(meshes){
    /** Initialize the them! **/
    initObjectList(objects);
    initNodeSet(nodes);
    /** Bind objects with info **/
    bindObjectsDrawInfo(objects, meshes, textures, programInfo, gl);
    /** Set up frame trees/node graph **/
    setFrameTree(nodes);
    /** Bind objects with nodes **/
    placeObjects(objects, nodes);
    /** Set lights **/
    setLights();

    console.log(meshes);
    requestAnimationFrame(example);
    requestAnimationFrame(render);
}

function setLights(){
    let majorLight=new Light();
    majorLight.node = nodes.base_node;
    lights.push(majorLight);

    let sunLight = new Light();
    sunLight.node = nodes.sun_node;
    lights.push(sunLight);

    let cusLights = [];
    for(var i = 0; i < 5; i++)
    {
        cusLights.push(new Light());
        cusLights[i].node = nodes.customized_light_nodes[i];
    }
    lights.push(cusLights[0]);
    
    let allLights=pack(lights);
    // assign the light uniforms to all objects.
    Object.values(objects).forEach(function(each){
        Object.assign(each.drawInfo.uniforms,allLights.uniforms);
    });
}


/********************************************
* [Example]: Rotate the paper plane 60 times a second
*********************************************/
var example = function(){
    var world = m4.identity();
    world = m4.multiply(world, m4.translation([0, 14, 45]));
    world = m4.multiply(world, m4.rotationX(1.1 * g_time));
    world = m4.multiply(world, m4.rotationZ(200 * Math.PI / 180));
    world = m4.multiply(world, m4.rotationY(170 * Math.PI / 180));
    world = m4.multiply(world, m4.rotationX(25 * Math.PI / 180));
    m4.scale(world, [0.02, 0.02, 0.02], world);
    m4.copy(world, nodes.paper_plane_node.localMatrix);
    requestAnimationFrame(example);
};


/********************************************
* Render Function
*********************************************/
function render(time) {
    gl.clearColor(0.1, 0.8, 0.9, 1);

    time *= 0.001;
    g_time = time;

    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.CULL_FACE);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    renderScene(nodes.base_node, Object.values(objects), lights, myCamera);
    
    requestAnimationFrame(render);
}


export {twgl, m4, gl, myCamera, objects};