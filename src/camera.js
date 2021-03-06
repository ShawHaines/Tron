import {m4} from '../modules/twgl/twgl-full.module.js'
import { twgl } from './main.js';
import { myNode } from './myNode.js';


/**
* Create a camera with axis u, v, n
* Notice u is always on XOZ(world) plane!
*
* @param {_pos} in the initial position of the camera
* @param {_phi} in the angle(left/right)
* @param {_theta} in the angle(up/down)
* @param {_up} in the up vector
* @returns {camera} the camera object
*/
class Camera {
    constructor(_pos, _phi, _theta, _up) {
        /**
        * the up vector
        * @type {vec3}
        */
        this.up = [0, 1, 0];
        /**
        * the phi angle
        * @type {float}
        */
        this.phi = 0;
        /**
        * the theta angle
        * @type {float}
        */
        this.theta = 0;
        /**
        * the camera's position
        * @type {vec3}
        */
        this.position = [0, 0, 0];
        /**
        * the viewMatrix of the camera
        * `viewMatrix` -- a *transposed* matrix:
        *  U_x   V_x   N_x  0
        *  U_y   V_y   N_y  0
        *  U_z   V_z   N_z  0
        * -Posx -Posy -Posz 1
        * @type {mat4}
        */
        /** Set projection matrix **/
        this.fov = 30 * Math.PI / 180;
        // should be reset in main.
        this.aspect = 1.0;
        this.zNear = 0.5;
        this.zFar = 500;
        // should be updated as soon as aspect is correctly set.
        this.projection = m4.identity();
        this.viewMatrix = m4.identity();
        // the view matrix, position, etc, are all relative to this
        this.node=new myNode();
        this.node.type="LIGHT";
        //initialize
        if (_pos) {
            this.position[0] = _pos[0];
            this.position[1] = _pos[1];
            this.position[2] = _pos[2];
        }
        if (_phi)
            this.phi = _phi;
        if (_theta)
            this.theta = _theta;
        if (_up)
            this.up = _up;
        this.updateViewMatrix();
    }
    /**
    * Change view direction (phi, theta) of the camera to (_phi, _theta)
    *
    * @param {_theta} in camera.theta = _theta
    * @param {_phi} in camera.phi = _phi
    */
    changeView(_theta, _phi) {
        this.phi = _phi;
        this.theta = _theta;
        while (this.phi < 0)
            this.phi += 360;
        while (this.theta < 0)
            this.theta += 360;
        while (this.phi >= 360)
            this.phi -= 360;
        while (this.theta >= 360)
            this.theta -= 360;
        this.updateViewMatrix();
    }
    /**
    * Move view direction of the camera
    * If dot(`v`, `up`) >= 0, (phi, theta) -> (phi + deltaLR, theta - deltaUD)
    * If dot(`v`, `up`) <  0, (phi, theta) -> (phi - deltaLR, theta - deltaUD)
    *
    * @param {deltaLR} in delta phi(left/right)
    * @param {deltaUD} in delta theta(up/down)
    */
    moveView(deltaLR, deltaUD) {
        var v = [this.viewMatrix[1], this.viewMatrix[5], this.viewMatrix[9]];
        var reverseFlag = (v[0] * this.up[0] + v[1] * this.up[1] + v[2] * this.up[2] >= 0) ? 1 : -1;

        this.phi += deltaLR * reverseFlag;
        this.theta += deltaUD;
        while (this.phi < 0)
            this.phi += 360;
        while (this.theta < 0)
            this.theta += 360;
        while (this.phi >= 360)
            this.phi -= 360;
        while (this.theta >= 360)
            this.theta -= 360;
        this.updateViewMatrix();
    }
    /**
    * Change world position of the camera to (_x, _y, _z)
    *
    * @param {_x} in position[0] = _x
    * @param {_y} in position[1] = _y
    * @param {_z} in position[2] = _z
    */
    changePos(_x, _y, _z) {
        this.position[0] = _x;
        this.position[1] = _y;
        this.position[2] = _z;
        this.updateViewMatrix();
    }
    /**
    * Move position of the camera (for navigation)
    *
    * @param {deltaU} in delta u(left/right)
    * @param {deltaV} in delta v(up/down)
    * @param {deltaN} in delta n(front/back)
    */
    movePos(deltaU, deltaV, deltaN) {
        var transBackToWorld = this.node.worldMatrix;

        var deltaX = deltaU * transBackToWorld[0] + deltaV * transBackToWorld[4] + deltaN * transBackToWorld[8];
        var deltaY = deltaU * transBackToWorld[1] + deltaV * transBackToWorld[5] + deltaN * transBackToWorld[9];
        var deltaZ = deltaU * transBackToWorld[2] + deltaV * transBackToWorld[6] + deltaN * transBackToWorld[10];

        this.position[0] += deltaX;
        this.position[1] += deltaY;
        this.position[2] += deltaZ;

        this.updateViewMatrix();
    }
    //Internal function, update `viewMatrix`
    updateViewMatrix() {
        var cameraMatrix = m4.identity();
        m4.multiply(m4.rotationX(this.theta * Math.PI / 180), cameraMatrix, cameraMatrix);
        m4.multiply(m4.axisRotation(this.up, -this.phi * Math.PI / 180), cameraMatrix, cameraMatrix);
        m4.multiply(m4.translation(this.position), cameraMatrix, cameraMatrix);
        m4.copy(m4.inverse(cameraMatrix), this.viewMatrix);
        this.node.localMatrix=m4.inverse(this.viewMatrix);
    }
    /**
    * Get view direction of the camera
    *
    * @returns {vec3} the view direction
    */
    viewDir() {
        return [-this.viewMatrix[2], -this.viewMatrix[6], -this.viewMatrix[10]];
    }
    updateProjectionMatrix(gl){
        this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        this.projection = m4.perspective(this.fov, this.aspect, this.zNear, this.zFar);
        return this.projection;
    }
}

/**
 * update all the viewMatrix in the cameraList.
 * @param {{Camera}} cameraList
 * @returns {void}
 */
function updateCameras(gl, cameraList){
    for (let each in cameraList){
        let item=cameraList[each];
        item.updateProjectionMatrix(gl);
        item.viewMatrix=m4.inverse(item.node.worldMatrix);
    }
}

export {Camera, updateCameras};