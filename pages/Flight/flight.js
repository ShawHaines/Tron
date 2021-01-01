import { mat4, vec3, vec4 } from "../../modules/gl-matrix/src/index.js"

const pi = 3.1415926;
/**
 * time interval in miliseconds.
 */
var interval=30;
/**
 * The position in world frame.
 * convention: x points to the nose of the flight,
 * y points vertically up, z is determined by right-hand rule.
 * w=1 means point.
 * @type {vec4}
 */
var position=vec4.fromValues(0,0,0,1);
/**
 * the velocity in self frame. w=0 means vector instead of point.
 * @type {vec4}
 */
var u = vec4.fromValues(1,0,0,0);
/**
 * the velocity in world frame. w=0 means vector instead of point.
 * @type {vec4}
 */
var v = vec4.create();

/** 
 * acceleration. Vector.
 * @type {vec4}
 * */
var a = vec4.create();
const amax = 1;


/**
 * Euler Angle, three components are (in order) yaw, pitch, roll.
 * @type {vec3}
 */
var eulerAngle = vec3.fromValues(0,0,0);

/**
 * Angular velocity of yaw, pitch, roll.
 * @type {vec3}
 */
var omega = vec3.fromValues(0,0,0);
var omegaMax=1;

/**
 *Returns the 4*4 Euler Matrix of euler angle yaw, pitch, yaw.
 * @param {number} yaw
 * @param {number} pitch
 * @param {number} roll
 * @return {mat4}
 */
function euler_matrix(yaw, pitch, roll) {
    // you have to declare one variable before use.
    var R=[];
    mat4.fromYRotation(R,yaw);
    mat4.rotateZ(R,R,pitch)
    mat4.rotateX(R,R,roll);
    return R;
}
// console.log(euler_mKatrix(pi/3,0,0));
document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "a":
            speedUp();
            break;
        case "s":
            speedDown();
            break;
        case "ArrowUp":
            pitchUp();
            break;
        case "ArrowDown":
            pitchDown();
            break;
        case "ArrowLeft":
            rollLeft();
            break;
        case "ArrowRight":
            rollRight();
            break;
        default:
            console.log(event);
            break;
    }
});

var speedUp = function () { a[0] = amax; };
var speedDown = function () { a[0] = -amax; };
var pitchUp = function() { omega[1] = omegaMax; };
var pitchDown = function() { omega[1] = -omegaMax;}; 
var rollLeft = function() {omega[2] = omegaMax; };
var rollRight = function() {omega[2] = -omegaMax; };


setInterval(function(){
    // TODO: Introduce improved Euler's method, or R-K method.
    let dt=interval/1000;
    // updating all the values, starting from the higher order.
    vec3.scaleAndAdd(eulerAngle,eulerAngle,omega,dt);
    let R=euler_matrix(eulerAngle[0],eulerAngle[1],eulerAngle[2]);
    vec4.scaleAndAdd(u,u,a,dt);
    vec4.transformMat4(v,v,R);
    vec4.add(position,position,v);
},interval);

// global variables.
export {euler_matrix, eulerAngle, position};