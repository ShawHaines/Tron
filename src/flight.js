import { mat3, mat4, vec3, vec4 } from "../modules/gl-matrix/src/index.js"

const pi = 3.1415926;
/**
 * time interval in miliseconds.
 */
var interval=30;
/**
 * The position in world frame.
 * Convention: x points to the nose of the flight,
 * y points vertically up, z is determined by right-hand rule.
 * Unit is approximately MKSA unit (1m). 
 * Note that the planes are miniature planes that flies on a desk.
 * w=1 means point.
 * @type {vec4}
 */
var position=vec4.fromValues(0,0,0,1);
/**
 * the velocity in self frame. w=0 means vector instead of point.
 * @type {vec4}
 */
var u = vec4.fromValues(0.01,0,0,0);
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
const amax = 0.1;


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
 * if true, reverse the Pitch axis.
 */
var reversePitch=false;
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
    mat4.rotateZ(R,R,pitch);
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

document.addEventListener("keyup",function(event){
    switch (event.key) {
        case "a":case "s":
            resetAcceleration();
            break;
        case "ArrowUp":case "ArrowDown":
            resetPitch();
            break;
        case "ArrowLeft":case "ArrowRight":
            resetRoll();
            break;
        default:
            console.log(event);
            break;
    }
})

var speedUp = function () { a[0] = amax; };
var speedDown = function () { a[0] = -amax; };
var pitchUp = function() { omega[1] = reversePitch? omegaMax:-omegaMax; };
var pitchDown = function() { omega[1] = reversePitch? -omegaMax:omegaMax;}; 
var rollLeft = function() {omega[2] = -omegaMax; };
var rollRight = function() {omega[2] = omegaMax; };

var resetAcceleration = function(){ a[0]=0 };
var resetPitch = function(){ omega[1] = 0};
var resetRoll = function(){omega[2]=0};

setInterval(function(){
    // TODO: Introduce improved Euler's method, or R-K method.
    let dt=interval/1000;
    // updating all the values, starting from the higher order.
    let R=euler_matrix(eulerAngle[0],eulerAngle[1],eulerAngle[2]);
    // omega in world frame
    let omegaPrime=[];
    let Ry=mat4.fromYRotation([],eulerAngle[0]);
    let Rz=mat4.fromZRotation([],eulerAngle[1]);
    mat4.multiply(Rz,Rz,Ry);
    omegaPrime=vec3.scale(omegaPrime,vec3.fromValues(0,1,0),omega[0]);
    vec3.add(omegaPrime,omegaPrime,vec3.scale([],vec3.transformMat4([],vec3.fromValues(0,0,1),Ry),omega[1]));
    vec3.add(omegaPrime, omegaPrime,vec3.scale([],vec3.transformMat4([],vec3.fromValues(1,0,0),Rz),omega[2]));
    vec3.scaleAndAdd(eulerAngle,eulerAngle,omegaPrime,dt);
    // console.log(omegaPrime);
    vec4.scaleAndAdd(u,u,a,dt);
    vec4.transformMat4(v,u,R);
    vec4.add(position,position,v);
},interval);

// global variables.
export {pi,euler_matrix, eulerAngle, position};
