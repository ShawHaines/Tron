/********************************************
* Head
*********************************************/
import * as twgl from "../modules/twgl/twgl-full.module.js";
import {myNode} from "./myNode.js";
import {myObject} from "./myObject.js";
import {Camera,updateCameras} from "./camera.js";
import {Light, pack, updateLights} from "./light.js";
// import * as texture_shader from "../pages/Preview/src/texture-shader.js";
import * as texture_shader from "../pages/Preview/src/texture-shader-with-shadow.js";
import * as shadow_shader from '../pages/Preview/src/shadow-shader.js';
import * as sky_shader from "../pages/Preview/src/sky_shader.js";
import * as transparent_shader from "../pages/Preview/src/transparent-shader.js";
import * as flight from "./flight.js";
import {models, naturePackModelNames} from "./modelList.js"
import {renderScene} from './renderScene.js';
import { renderShadow } from "./renderShadow.js";
import {renderSky} from './renderSky.js'
import { renderRibbon } from "./renderRibbon.js";

import {initObjectList, bindObjectsWithMeshes} from './setObjects.js'
import {initNodeSet, setFrameTree, linkObjects} from './setNodes.js'
import {parseModel} from './objLoader.js'
import {moveNavCamera} from './navInteraction.js'
import {bindOBJExportInfo2Nodes} from './objExport.js'

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
const transparentProgramInfo=twgl.createProgramInfo(gl,[transparent_shader.vs,transparent_shader.fs]);
const depthTextureSize = 1024;
// set the textures as attachments for the framebuffer. See the comments in preview.js
const attachments = [
    {format: gl.DEPTH_COMPONENT},
    {format: gl.RGBA }, //default to RGBA, actually it can work withou this excessive texture attachment.
];
const depthFramebufferInfo = twgl.createFramebufferInfo(gl, attachments, depthTextureSize, depthTextureSize);
console.log(depthFramebufferInfo);
/** Some global variables **/
var g_time = 0; /** global time (keep updated in `render()`), unit is seconds **/
var g_time_interval = 0;
/**
 * Keeps track of the running time and decides whether to render and update or not
 */
var old_time = 0, new_time = 0;

/** IMPORTANT THINGS **/
var nodes = {};
var objects = {};
var lights=[];
var cameras={};
var myCamera = new Camera([-200, 100, 0], 80, -23, [0, 1, 0]);

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
    /** bind objects with mesh info (to export as OBJ later) **/
    bindOBJExportInfo2Nodes(nodes.base_node, meshes);
    /** Set cameras **/
    setCameras();
    /** Set lights **/
    setLights();
    /** Set fogs **/
    assignFog2Nodes(nodes.base_node);

    requestAnimationFrame(main);
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
    cameras.myCamera=myCamera;

    // camera that follows the fighter.
    let tailCamera=new Camera();
    tailCamera.node.setParent(nodes.sidekick);
    let tail=m4.identity();
    m4.translate(tail,[0,3,20],tail);
    // m4.rotateY(tail,-Math.PI/2,tail);
    // m4.rotateZ(tail,Math.PI/2,tail);
    tailCamera.node.localMatrix=tail;
    cameras.tailCamera=tailCamera;
}

/********************************************
* main() function
*********************************************/
var main = function(time){
    time *= 0.001;
    new_time = time;
    //Limit on maximum FPS. If the render speed is too fast, skip this frame.
    if(new_time - old_time < 1.0 / 60.0)
    {
        requestAnimationFrame(main);
        return;
    }
    // set globally by ui. If paused, the movements of the objects(which is defined in update()) will be frozen.
    if(!window.pauseCond)
    {
        // g_time_interval = (new_time - old_time <= 0.1)?(new_time - old_time):0.1;
        g_time_interval = new_time - old_time;
        g_time += g_time_interval;
    }
    old_time = new_time;

    update(time);
    if(window.navMode)
        render(time, cameras.myCamera);
    else if(cameras.tailCamera.projection)
        render(time, cameras.tailCamera);
    requestAnimationFrame(main);
};

/********************************************
* update() function
*********************************************/
function update(time) {
    if(!window.pauseCond) updateModels(); //if pause, every model should not update
                                              //FIXME: plane's internal position should stop moving
    /** sliders to adjust **/
    sliderSunlight();
    sliderPerspective();
    /** Set fogs **/
    assignFog2Nodes(nodes.base_node);
    /** Update Navigation Camera **/
    moveNavCamera(myCamera);
    /** Update world matrix for every node **/
    nodes.base_node.updateWorldMatrix();
    updateCameras(gl, cameras);
}

/********************************************
* render() function
*********************************************/
function render(time, camera) {
    time *= 0.001;

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
    renderScene(nodes.base_node, lights, camera);
    gl.depthFunc(gl.LEQUAL);
    if(!window.isIPAD) renderSky(camera, time*1000);
    // draw ribbon.
    renderRibbon(lights,camera,transparentProgramInfo,window.ribbonColor);
}



function sliderSunlight(){
    /** Update the sun light position **/
    var world=m4.identity();
    m4.rotateX(world, -(window.sunAngle / 180)* Math.PI, world);
    m4.copy(world, nodes.sun_node.localMatrix);
}

function sliderPerspective(){
    var tail=m4.identity();
    m4.translate(tail,[0,window.yValue, window.zValue],tail);
    cameras.tailCamera.node.localMatrix=tail;
}

// Ring buffer keeping track of the position and orientation.
var record = {
    position: [],
    orientation: [],
    pointer: 0,
    size: 20,
    // records whether the ring buffer has started over again.
    full: false,
}
function updateModels(){
    /** Rotate the paper plane **/
    var world = m4.identity();
    world = m4.multiply(world, m4.translation([0, 14, 45]));
    world = m4.multiply(world, m4.rotationX(1.1 * g_time));
    world = m4.multiply(world, m4.rotationZ(200 * Math.PI / 180));
    world = m4.multiply(world, m4.rotationY(170 * Math.PI / 180));
    world = m4.multiply(world, m4.rotationX(25 * Math.PI / 180));
    m4.scale(world, [0.02, 0.02, 0.02], world);
    m4.copy(world, nodes.paper_plane_node.localMatrix);

    flight.updateFlight(g_time_interval);
    // fighter position update.
    let fighter = m4.translation(flight.position);
    // m4.rotateX(fighter,Math.PI/2,fighter);
    m4.multiply(fighter, flight.orientation, fighter);
    nodes.fighter_base.localMatrix = fighter;
    let sidekickPosition=m4.identity(),sidekickOrientation=m4.identity();
    // write into the ring buffer.
    if (!record.full){
        // not full yet, just use the earliest possible value.
        // FIXME: be careful about the shallow copy!
        record.position.push(m4.copy(flight.position));
        record.orientation.push(m4.copy(flight.orientation));
        m4.copy(record.position[0],sidekickPosition);
        m4.copy(record.orientation[0],sidekickOrientation);
        record.pointer++;
        if (record.pointer>=record.size){
            record.full=true;
            record.pointer-=record.size;
        }
    } else{
        // already full, use the one that's going to be overwritten.
        m4.copy(record.position[record.pointer],sidekickPosition);
        m4.copy(record.orientation[record.pointer],sidekickOrientation);
        record.position[record.pointer]=m4.copy(flight.position);
        record.orientation[record.pointer]=m4.copy(flight.orientation);
        record.pointer=(record.pointer+1)%record.size;
    }
    let sidekick=m4.lookAt(sidekickPosition,flight.position,[0,1,0]);
    nodes.sidekick.localMatrix=sidekick;
    /** Update random objects **/
    //FIXME: need to improve the bounding with g_time
    nodes.random_nature_nodes.forEach(function (tmp) {
        // tmp.xRot = tmp.xRotInit + tmp.xRotSpeed * g_time;
        // tmp.yRot = tmp.yRotInit + tmp.yRotSpeed * g_time;
        // tmp.zRot = tmp.zRotInit + tmp.zRotSpeed * g_time;
        // tmp.y = tmp.yInit + tmp.ySpeed * g_time;

        tmp.xRot += tmp.xRotSpeed * g_time_interval;
        tmp.yRot += tmp.yRotSpeed * g_time_interval;
        tmp.zRot += tmp.zRotSpeed * g_time_interval;
        // tmp.y += tmp.ySpeed * g_time_interval;

        while(tmp.xRot > 360) tmp.xRot -= 360;
        while(tmp.yRot > 360) tmp.yRot -= 360;
        while(tmp.zRot > 360) tmp.zRot -= 360;
        while(tmp.xRot < 0) tmp.xRot += 360;
        while(tmp.yRot < 0) tmp.yRot += 360;
        while(tmp.zRot < 0) tmp.zRot += 360;
        // while(tmp.y > 100) tmp.y -= 100;
        // while(tmp.y < 0) tmp.y += 100;
        
        var world = m4.identity();
        world = m4.multiply(world, m4.translation([tmp.x, tmp.y, tmp.z]));
        world = m4.multiply(world, m4.rotateX(world, tmp.xRot / 180 * Math.PI));
        world = m4.multiply(world, m4.rotateY(world, tmp.yRot / 180 * Math.PI));
        world = m4.multiply(world, m4.rotateZ(world, tmp.zRot / 180 * Math.PI));
        m4.scale(world, [5, 5, 5], world);
        m4.copy(world, tmp.localMatrix);
    });
}

var assignFog2Nodes = function(curNode)
    {
        if(curNode.type == "OBJECT")
        {
            for(var i = 0; i < curNode.drawInfo.groupNum; i++)
            {
                if(!window.isIPAD) 
                    Object.assign(curNode.drawInfo.uniformsList[i], {
                        u_fogDensity: window.fogDensity / 10000,
                        u_fogColor: [0.8, 0.9, 1, 1]
                    });
                else
                    Object.assign(curNode.drawInfo.uniformsList[i], {
                        u_fogDensity: 0,
                        u_fogColor: [0.8, 0.9, 1, 1]
                    });
            }
                
        }
        curNode.children.forEach(function (child) {
            assignFog2Nodes(child);
        });
    }



export {twgl, m4, gl, myCamera, objects, naturePackModelNames, skyProgramInfo, shadowProgramInfo, depthFramebufferInfo, g_time_interval, g_time, nodes};