const vs = `
attribute vec3 a_position;
attribute vec3 a_normal;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

varying vec3 Normal;
varying vec3 fragPos;
void main()
{
    gl_Position = projection * view * model * vec4(a_position, 1.0);
    Normal = a_normal;
    fragPos = (model * vec4(a_position, 1.0)).xyz;
}
`
const fs =`
precision highp float;
uniform vec3 objectColor;
uniform vec3 lightColor;
uniform vec3 lightPos;
uniform vec3 viewPos;

varying vec3 Normal;
varying vec3 fragPos;
void main()
{
    float ambientStrength = 0.5;
    vec3 ambient = ambientStrength * lightColor;

    vec3 lightDir = normalize(lightPos - fragPos);
    float diff = max(dot(lightDir, normalize(Normal)),0.0);
    vec3 diffuse = lightColor * diff;

    vec3 viewDir = normalize(viewPos - fragPos);
    vec3 reflectDir = reflect(-lightDir, normalize(Normal));
    // // 32 times
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = lightColor * spec * 0.5;

    // vec3 result = (ambient + diffuse + specular)* objectColor;
    vec3 result = (ambient + diffuse)* objectColor;
    gl_FragColor = vec4(result, 1.0);
}`;

var camera_x = 0;
var camera_y = 0;
var camera_z = 0;

import { mat4, vec4 } from '../../modules/gl-matrix/src/index.js';
import * as twgl from '../../modules/twgl/twgl-full.module.js';
const m4 = twgl.m4;
import * as flight from "./flight.js";
const gl = document.getElementById("c").getContext("webgl");
if (!gl) console.log("Failed");
const programInfo = twgl.createProgramInfo(gl, [vs, fs]);

/****************************** Load Obj Begin ******************************/

var g_meshes = {};
var arrays={};
function webGLStart(meshes) {
    g_meshes = meshes;
    console.log(g_meshes);
    arrays.a_position = g_meshes.fighter.vertices;
    arrays.indices = g_meshes.fighter.indices;
    arrays.a_normal = g_meshes.fighter.vertexNormals;
    console.log(arrays);

    bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
    console.log(bufferInfo);
    requestAnimationFrame(render);
}

window.onload = function () {
    OBJ.downloadMeshes({
        // 'viking_room': 'src/resource/viking_room.obj', // located in the models folder on the server
        // Note that the relative path is from the index.
        'fighter': "../../resource/rff.obj",
    }, webGLStart);
}
/****************************** Load Obj End ******************************/
    
var bufferInfo;

const uniforms = {
    objectColor:[0.8,0.8,0.5],
    lightColor:[1.0,1.0,1.0],
    lightPos:[0.,3.,5],
};

function render(time) {
    time *= 0.001;
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    // FIXME: This line of code would clip out the back facets.
    // gl.enable(gl.CULL_FACE);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fov = 30 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.5;
    const zFar = 20;
    const projection = m4.perspective(fov, aspect, zNear, zFar);
    const eye = [0 + camera_x, 0 + camera_y, 6 + camera_z];
    const target = [0 + camera_x, 0 + camera_y, 0 + camera_z];
    const up = [0, 1, 0];

    const camera = m4.lookAt(eye, target, up);
    const view = m4.inverse(camera);
    const viewProjection = m4.multiply(projection, view);
    
    var model=[];
    mat4.fromTranslation(model,flight.position);
    let euler=flight.eulerAngle;
    mat4.multiply(model,model,flight.orientation);
    // // mat4.rotateY(model,model,Math.PI/2);
    mat4.rotateZ(model,model,-Math.PI/2);
    mat4.rotateX(model,model,-Math.PI/2);
    mat4.scale(model,model,vec4.fromValues(0.05,0.05,0.05));

    uniforms.view = view;
    uniforms.model = model;
    uniforms.projection = projection;
    uniforms.viewPos=eye;
    // uniforms.u_worldViewProjection = m4.multiply(viewProjection, world);

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);

    //All 3 ways work fine!
    twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES, bufferInfo.numelements);

    // draw ribbon.
    if (flight.ribbonLength > 1){
        let ribbonBuffer=twgl.createBufferInfoFromArrays(gl,flight.ribbon);
        twgl.setBuffersAndAttributes(gl,programInfo,ribbonBuffer);
        uniforms.model=m4.identity();
        twgl.setUniforms(programInfo,uniforms);
        twgl.drawBufferInfo(gl,ribbonBuffer,gl.TRIANGLES,ribbonBuffer.numelements);
    }
    requestAnimationFrame(render);
}
