/********************************************
* Head
*********************************************/
import * as twgl from "../modules/twgl/twgl-full.module.js";
import {myNode} from "./myNode.js";
import {myObject} from "./myObject.js";
import {Camera} from "./camera.js";
import {Light, pack} from "./light.js";
// import * as texture_shader from "../pages/Preview/src/texture-shader.js";
import * as texture_shader from "../pages/Preview/src/texture-shader-with-shadow.js";
import * as shadow_shader from '../pages/Preview/src/shadow-shader.js';
import * as sky_shader from "../pages/Preview/src/sky_shader.js";
import * as flight from "../pages/Flight/flight.js";
import {models, naturePackModelNames} from "./modelList.js"
import {renderScene} from './renderScene.js';
import { renderShadow } from "./renderShadow.js";
import {initObjectList, bindObjectsWithMeshes} from './setObjects.js'
import {initNodeSet, setFrameTree, linkObjects} from './setNodes.js'
import {renderSky} from './renderSky.js'
import {parseModel} from './objLoader.js'
const m4 = twgl.m4;
const gl = document.getElementById("c").getContext("webgl");
if (!gl) console.log("Failed");
const ext = gl.getExtension('WEBGL_depth_texture');
if (!ext) {
    alert('need WEBGL_depth_texture');  // eslint-disable-line
}
const programInfo = twgl.createProgramInfo(gl, [texture_shader.vs, texture_shader.fs]);
const skyProgramInfo = twgl.createProgramInfo(gl, [sky_shader.vs, sky_shader.fs]);
const shadowProgramInfo = twgl.createProgramInfo(gl, [shadow_shader.shadow_vs, shadow_shader.shadow_fs]);
const depthTextureSize = 1024;
// set the textures as attachments for the framebuffer. See the comments in preview.js
const attachments = [
    {format: gl.DEPTH_COMPONENT},
    {format: gl.RGBA }, //default to RGBA, actually it can work withou this excessive texture attachment.
];
const depthFramebufferInfo = twgl.createFramebufferInfo(gl, attachments, depthTextureSize, depthTextureSize);
console.log(depthFramebufferInfo);
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
    // let p = OBJ.downloadModels(models);

    // p.then(models => {
    //     test(models);
    //     console.log(models);
    // });

    parseModel(models, webGLStart);
    
}

//As long as meshes is downloaded successfully, do the following
function webGLStart(meshes){
    console.log(meshes);
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

    // console.log(meshes);
    requestAnimationFrame(main);
    requestAnimationFrame(render);
}

function setLights(){
    // only the first light source can have the privilege to generate shadows.
    let sunLight = new Light();
    // nodes are predefined elsewhere in setNodes()
    sunLight.node = nodes.sun_node;
    sunLight.uniforms.u_lightPos=[0,0,1,0];
    lights.push(sunLight);

    let majorLight=new Light();
    majorLight.node = nodes.base_node;
    lights.push(majorLight);

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
    // set aspect ratio according to the size of the canvas.
    myCamera.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    myCamera.updateProjectionMatrix();
    cameras.push(myCamera);
}

/********************************************
* [Example]: Rotate the paper plane 60 times a second
*********************************************/
var main = function(time){
    update(time);
    render(time);
    requestAnimationFrame(main);
};

function update(time) {
    /** Rotate the plane **/
    var world = m4.identity();
    world = m4.multiply(world, m4.translation([0, 14, 45]));
    world = m4.multiply(world, m4.rotationX(1.1 * g_time));
    world = m4.multiply(world, m4.rotationZ(200 * Math.PI / 180));
    world = m4.multiply(world, m4.rotationY(170 * Math.PI / 180));
    world = m4.multiply(world, m4.rotationX(25 * Math.PI / 180));
    m4.scale(world, [0.02, 0.02, 0.02], world);
    m4.copy(world, nodes.paper_plane_node.localMatrix);

    /** Update the sun light position **/
    world = m4.translation([0,300,0]);
    m4.rotateX(world, -(window.sunAngle / 180)* Math.PI, world);
    m4.copy(world, nodes.sun_node.localMatrix);
    // fighter position update.
    let fighter = m4.translation(flight.position);
    m4.multiply(fighter, flight.orientation, fighter);
    nodes.fighter_base.localMatrix = fighter;

    /** Update world matrix for every node **/
    nodes.base_node.updateWorldMatrix();
}

/********************************************
* Render Function
*********************************************/
function render(time) {
    time *= 0.001;
    g_time = time;

    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LESS);  // use the default depth test

    // render the shadow map to texture.
    // By default, only the shadow of light[0] is generated, and it should be a directional light.
    twgl.bindFramebufferInfo(gl, depthFramebufferInfo);
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(shadowProgramInfo.program);
    renderShadow(nodes.base_node, lights);

    // switch framebuffer back to canvas.
    twgl.bindFramebufferInfo(gl);
    gl.clearColor(0.1, 0.8, 0.9, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    renderScene(nodes.base_node, lights, myCamera);
    gl.depthFunc(gl.LEQUAL);
    renderSky(myCamera, time);
}


export {twgl, m4, gl, myCamera, objects, naturePackModelNames, skyProgramInfo, shadowProgramInfo, depthFramebufferInfo};