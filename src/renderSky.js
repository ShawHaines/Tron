import {twgl, m4, gl, skyProgramInfo} from './main.js'


const skyUniform = {

}

var renderSky = function(myCamera, time)
{
    const fov = 30 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.5;
    const zFar = 500;
    const projection = m4.perspective(fov, aspect, zNear, zFar);

    // const camera = m4.lookAt(myCamera.Eye, myCamera.Target, myCamera.Up);
    // const view = m4.inverse(camera);
    var view = m4.copy(myCamera.viewMatrix);
    view[12] = 0;
    view[13] = 0;
    view[14] = 0;
    const viewProjection = m4.multiply(projection, view);
   
    const viewProjectionInverse = m4.inverse(viewProjection);

    const skyArrays = {
        a_position: [-1, -1, 1,
                     1, -1, 1, 
                     -1, 1, 1, 
                     1, 1, 1,
                     -1, 1, 1, 
                     1, -1, 1, 
                     ],
    };
    const skyBufferInfo = twgl.createBufferInfoFromArrays(gl, skyArrays);
    skyUniform.u_time = time;
    skyUniform.u_worldViewProjectionInverse = viewProjectionInverse;

    gl.useProgram(skyProgramInfo.program);
    twgl.setUniforms(skyProgramInfo, skyUniform);
    twgl.setBuffersAndAttributes(gl, skyProgramInfo, skyBufferInfo);
    // **draw**
    twgl.drawBufferInfo(gl, skyBufferInfo, gl.TRIANGLES);
}

export{renderSky}