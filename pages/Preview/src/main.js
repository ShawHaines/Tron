    /********************************************
    * Head
    *********************************************/
    import * as twgl from "../../../modules/twgl-full.module.js"
    import * as tinyCamera from './camera.js';
    import {myNode} from './myNode.js';
    
    const m4 = twgl.m4;
    const gl = document.getElementById("c").getContext("webgl");
    
    if (!gl) console.log("Failed");
    const programInfo = twgl.createProgramInfo(gl, [vs, fs]);

    /** Some global variables **/
    var myCamera = tinyCamera.Camera(80, 2); /** camera definition **/
    var g_time; /** global time (keep updated in `render()`) **/


    /********************************************
    * Set up every models (initially)
    *********************************************/
    var objects = []; /**  Wrap every object **/
    var objectsToDraw = []; /** Wrap every object's drawing info **/
    
    /** create nodes for objects **/
    var base_node = new myNode();
    
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

        /** Set projection matrix **/
        const fov = 30 * Math.PI / 180;
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.5;
        const zFar = 500;
        const projection = m4.perspective(fov, aspect, zNear, zFar);

        const camera = m4.lookAt(myCamera.Eye, myCamera.Target, myCamera.Up);
        const view = m4.inverse(camera);
        const viewProjection = m4.multiply(projection, view);

        var world = m4.identity();
        world = m4.rotationZ(time);
        world = m4.multiply(world, m4.rotationX(Math.PI));
        m4.scale(world, [0.1, 0.1, 0.1], world);
        
        // var uniforms = {};
        // uniforms.u_viewInverse = camera;
        // uniforms.u_world = world;
        // uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(world));
        // uniforms.u_worldViewProjection = m4.multiply(viewProjection, world);
        
        
        /** Update world matrix for every node **/
        base_node.updateWorldMatrix();
        /** Multiply with `viewProjection` to get uniform variable `u_worldViewProjection` **/
        objects.forEach(function(object) {
            object.drawInfo.uniforms.u_world = object.worldMatrix;
            object.drawInfo.uniforms.u_worldViewProjection = m4.multiply(viewProjection, object.worldMatrix);
            object.drawInfo.uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(object.worldMatrix));
        });
        /** Render `objectsToDraw` (a.k.a. `objects[i].drawInfo`) **/
        objectsToDraw.forEach(function(object) {
            var programInfo = object.programInfo;
            var bufferInfo = object.bufferInfo;
            
            //3 important things to do!
            gl.useProgram(programInfo.program);
            twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
            twgl.setUniforms(programInfo, object.uniforms);
            
            // **draw**
            twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
        });
        // console.log(objectsToDraw);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);  
    


export {myCamera}