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

    vec3 result = (ambient + diffuse + specular)* objectColor;
    // vec3 result = (ambient + diffuse)* objectColor;
    gl_FragColor = vec4(result, 1.0);
}`;

var camera_x = 0;
var camera_y = 0;
var camera_z = 0;

import * as twgl from '../modules/twgl/twgl-full.module.js';
const m4 = twgl.m4;
const gl = document.getElementById("c").getContext("webgl");
if (!gl) console.log("Failed");
const programInfo = twgl.createProgramInfo(gl, [vs, fs]);

/****************************** Load Obj Begin ******************************/

var g_meshes = {};
var arrays={};
function webGLStart(meshes) {
    g_meshes = meshes;
    console.log(g_meshes);
    arrays.a_position = g_meshes.paper_plane.vertices;
    arrays.indices = g_meshes.paper_plane.indices;
    arrays.a_normal = g_meshes.paper_plane.vertexNormals;
    console.log(arrays);

    bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
    console.log(bufferInfo);
    requestAnimationFrame(render);
}

window.onload = function () {
    OBJ.downloadMeshes({
        // 'viking_room': 'src/resource/viking_room.obj', // located in the models folder on the server
        // Note that the relative path is from the index.
        'paper_plane': "./resource/paper+airplane.obj",
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

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fov = 30 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.5;
    const zFar = 1000;
    const projection = m4.perspective(fov, aspect, zNear, zFar);
    const eye = [1000 + camera_x, 400 + camera_y, -60 + camera_z];
    const target = [0 + camera_x, 0 + camera_y, 0 + camera_z];
    const up = [0, 1, 0];

    const camera = m4.lookAt(eye, target, up);
    const view = m4.inverse(camera);
    const viewProjection = m4.multiply(projection, view);
    const world = m4.rotationY(time);

    uniforms.view = view;
    uniforms.model = world;
    uniforms.projection = projection;
    uniforms.viewPos=eye;
    // uniforms.u_worldViewProjection = m4.multiply(viewProjection, world);

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);

    //All 3 ways work fine!
    twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES, bufferInfo.numelements);
    // twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
    // gl.drawElements(gl.TRIANGLES, bufferInfo.numElements, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(render);
}
