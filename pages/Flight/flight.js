import { mat4, vec3, vec4 } from "../../modules/gl-matrix/src/index.js"

/**
 * The position in world frame.
 * Convention: (DIFFERENT from the screen coordinates, but conforms with the navigation convention)
 * x points to the nose of the flight,
 * z points vertically down, y is determined by right-hand rule.
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
 * time interval in miliseconds.
 */
var interval = 10;


/** 
 * A transformation matrix that represents the orientation from world frame to self frame.
 * @type {mat4} */
var orientation=mat4.create();

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
var omegaMax=Math.PI;
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
    mat4.fromZRotation(R,yaw);
    mat4.rotateY(R,R,pitch);
    mat4.rotateX(R,R,roll);
    return R;
}


/**
 * the inteval count to insert a new vertex in ribbon.
 */
const ribbonInterval=1;
/** maximum number of vertices */
const maxRibbonLength=100;
var ribbonCount=0;
var ribbonLength=0;
const ribbonWidth=0.1;

/**
 * @typedef {Object} bufferArray
 * @property {[number]} a_position
 * @property {[number]} a_normal
 * @property {[number]} a_texcoord
 * @property {[number]} indices
 * */


/** @type {bufferArray} */
var ribbon = {
    a_position: [],
    a_normal: [],
    indices: [],
    length:0,
}

function updateRibbon() {
    // TODO: Improve the efficiency by getting rid of the array.shift().
    let displacement=vec4.fromValues(0,ribbonWidth/2,0,0);
    vec4.transformMat4(displacement,displacement,orientation);
    let up = vec3.fromValues(0, 0, -1, 0);
    vec3.transformMat4(up, up, orientation);
    // aliases
    let a_position=ribbon.a_position;
    let a_normal = ribbon.a_normal;
    let indices=ribbon.indices;
    // first the left-hand-side, then the rfs.
    if (ribbonLength<maxRibbonLength){
        // not overfloating yet.
        a_position.push.apply(a_position,vec3.add([], position, displacement));
        a_position.push.apply(a_position,vec3.subtract([], position, displacement));
        // indices
        if (ribbonLength > 0){
            // left triangle, counter-clockwise.
            indices.push.apply(indices,[ribbonLength*2,ribbonLength*2-2,ribbonLength*2+1]);
            // right triangle, ccw
            indices.push.apply(indices,[ribbonLength*2+1,ribbonLength*2-2,ribbonLength*2-1]);
            // left triangle, cw.
            indices.push.apply(indices, [ribbonLength * 2 + 1,ribbonLength*2,ribbonLength*2-2]);
            // right triangle, cw.
            indices.push.apply(indices, [ribbonLength * 2 - 1,ribbonLength*2+1,ribbonLength*2-2]);
        }
        a_normal.push.apply(a_normal,up);
        a_normal.push.apply(a_normal,up);
    } else{
        // considering the indices, it's better to deal with it like a ring buffer.
        let a_position=ribbon.a_position;
        // set a marker
        let index=ribbonLength % maxRibbonLength;
        let end=[];
        vec3.add(end,position,displacement);
        // 3 components for each position and normal.
        for (let i=index*6,j=0;i<index*6+3;i++,j++){
            a_position[i]=end[j];
            a_normal[i]=up[j];
        }
        vec3.subtract(end, position, displacement);
        for (let i=index*6+3,j=0;i<index*6+6;i++,j++){
            a_position[i]=end[j];
            a_normal[i]=up[j];
        }
        // // FIXME: as it turns out, you do have to move one index.
        let j= (ribbonLength-1)%(maxRibbonLength-1);
        let oldIndex=index>0?index-1:maxRibbonLength-1;
        indices[j*12  ]=2*index;
        indices[j*12+1]=2*oldIndex;
        indices[j*12+2]=2*index+1;
        indices[j*12+3]=2*index+1;
        indices[j*12+4]=2*oldIndex;
        indices[j*12+5]=2*oldIndex+1;
        // clockwise, back facet.
        indices[j*12+6]=2*index;
        indices[j*12+7]=2*index+1;
        indices[j*12+8]=2*oldIndex;
        indices[j*12+9]=2*index+1;
        indices[j*12+10]=2*oldIndex+1;
        indices[j*12+11]=2*oldIndex;
        // prevent overfloat
        ribbonLength = ribbonLength % (2 * (maxRibbonLength - 1) * maxRibbonLength) + (2 * (maxRibbonLength - 1) * maxRibbonLength);
    }
    ribbonLength++;
}

document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "z":
            speedUp();
            break;
        case "x":
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
        case "z":case "x":
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

// update the plane's orientation and position information.
setInterval(function(){
    // TODO: Introduce improved Euler's method, or R-K method.
    let dt=interval/1000;
    // updating all the values, starting from the higher order.
    // let R=euler_matrix(eulerAngle[0],eulerAngle[1],eulerAngle[2]);
    // vec3.scaleAndAdd(eulerAngle,eulerAngle,omega,dt);
    let dYaw=0,dPitch=omega[1]*dt,dRoll=omega[2]*dt;
    let Ry=[],Rx=[];
    mat4.fromYRotation(Ry,dPitch);
    mat4.fromXRotation(Rx,dRoll);
    // FIXME: the order matters! first pitch, then roll. Also note the multiplying order.
    mat4.multiply(orientation,orientation,Rx);
    mat4.multiply(orientation, orientation,Ry);
    vec4.scaleAndAdd(u,u,a,dt);
    vec4.transformMat4(v,u,orientation);
    vec4.add(position,position,v);

    // update ribbon.
    ribbonCount++;
    if (ribbonCount>=ribbonInterval){
        ribbonCount-=ribbonInterval;
        updateRibbon();
    }
},interval);

// global variables.
export {euler_matrix, orientation, position, ribbon , ribbonLength};
