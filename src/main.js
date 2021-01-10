/********************************************
* Head
*********************************************/
import * as twgl from "../modules/twgl/twgl-full.module.js";
import {myNode} from "./myNode.js";
import {myObject} from "./myObject.js";
import {Camera} from "./camera.js";
import {Light, pack} from "./light.js";
import * as texture_shader from "../pages/Preview/src/texture-shader.js";
// import * as texture_shader from "../../pages/Preview/src/texture-shader.js";
import {models, naturePackModelNames} from "./modelList.js"
import {renderScene} from './renderScene.js';
import {initObjectList, bindObjectsWithMeshes} from './setObjects.js'
import {initNodeSet, setFrameTree, linkObjects} from './setNodes.js'
import {renderSky} from './renderSky.js'
import * as sky_shader from "../pages/Preview/src/sky_shader.js";
const m4 = twgl.m4;
const gl = document.getElementById("c").getContext("webgl");

if (!gl) console.log("Failed");
const programInfo = twgl.createProgramInfo(gl, [texture_shader.vs, texture_shader.fs]);
const skyProgramInfo = twgl.createProgramInfo(gl, [sky_shader.vs, sky_shader.fs]);

/** Some global variables **/
var g_time; /** global time (keep updated in `render()`) **/

/** IMPORTANT THINGS **/
var nodes = {};
var objects = {};
var lights=[];
var cameras=[];
var myCamera = new Camera([-200, 100, 20], 80, -23, [0, 1, 0]);

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
    let p = OBJ.downloadModels(models);

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
    bindObjectsWithMeshes(objects, meshes, textures, programInfo, gl);
    /** Set up frame trees/node graph **/
    setFrameTree(nodes);
    /** link objects with nodes **/
    linkObjects(nodes, objects);
    setCameras();
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
    console.log(allLights);
    // assign the light uniforms to all objects.
    var assignLight2Nodes = function(curNode)
    {
        if(curNode.type == "OBJECT")
        {
            for(var i = 0; i < curNode.drawInfo.groupNum; i++)
                Object.assign(curNode.drawInfo.uniformsList[i], allLights.uniforms);
        }
        curNode.children.forEach(function (child) {
            assignLight2Nodes(child);
        });
    }
    assignLight2Nodes(nodes.base_node);
}

function setCameras(){
    myCamera.node.setParent(nodes.base_node);
    cameras.push(myCamera);
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
    gl.enable(gl.CULL_FACE);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.depthFunc(gl.LESS);  // use the default depth test
    renderScene(nodes.base_node, lights, myCamera);
    gl.depthFunc(gl.LEQUAL);
    renderSky(myCamera, time);
    requestAnimationFrame(render);
}


export {twgl, m4, gl, myCamera, objects, naturePackModelNames, skyProgramInfo};