//顶点着色器程序
const vs =
`attribute vec4 a_Position;
//uniform mat4 proj;
//varying vec4 a_color;
//attribute vec4 g_color;
uniform float time;
uniform float resolution[2];
void main() {
//设置坐标

gl_Position = a_Position;
if(resolution[0] > resolution[1])
    gl_Position.x *= resolution[1] / resolution[0];
else
    gl_Position.y *= resolution[1] / resolution[0];
gl_Position += vec4(time, 0, 0, 0);
//a_color = g_color;
}`;

//片元着色器
const fs =
`precision mediump float; //指定精度
varying vec4 a_color;
void main() {
//设置颜色
//gl_FragColor = a_color;
gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

window.onload = function ()
{
    const gl = document.getElementById("c").getContext("webgl");
    if (!gl) {
        console.log("Failed");
        return;
    }
    const programInfo = twgl.createProgramInfo(gl, [vs, fs]);

    const arrays = {
        a_Position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
    };
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
    //console.log(twgl)
    function render(time) {
        twgl.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
        const uniforms = {
        time: time * 0.001,
        resolution: [gl.canvas.width, gl.canvas.height],
        };
    
        gl.useProgram(programInfo.program);
        twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
        twgl.setUniforms(programInfo, uniforms);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, bufferInfo);
        //console.log("hello!");
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);    
}

