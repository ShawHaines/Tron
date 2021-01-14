import * as twgl from "../modules/twgl/twgl-full.module.js";
import { myNode } from "./myNode.js";
import {vec3, vec4} from "../modules/gl-matrix/src/index.js";
const m4=twgl.m4;

/**
 * Tests whether there is collision between nodes n1 and n2
 * @param {myNode} n1
 * @param {myNode} n2
 * @returns {boolean} true if collided.
 */
function collisionTest(n1,n2){
    if (!(n1.hasBoxInfo&&n2.hasBoxInfo)) return false;
    // Important! otherwise it always collides with itself.
    if (n1 == n2) return false;
    /* centroid 1 */
    let c1=vec3.clone(n1.boxInfo[0].centroid);
    /* the diagonal line of bounding box 1*/
    let b1=vec3.clone(n1.boxInfo[0].boundingBox);
    // point and vector respectively.
    c1[3]=1;b1[3]=0;
    // transform into the world frame.
    vec4.transformMat4(c1,c1,n1.worldMatrix);
    vec4.transformMat4(b1,b1,n1.worldMatrix);
    // The radius of circumsphere. 
    let r1=vec4.length(b1)/2;

    // repeats on n2.
    let c2 = vec3.clone(n2.boxInfo[0].centroid);
    let b2 = vec3.clone(n2.boxInfo[0].boundingBox);
    c2[3] = 1; b2[3] = 0;
    vec4.transformMat4(c2, c2, n2.worldMatrix);
    vec4.transformMat4(b2, b2, n2.worldMatrix);
    let r2 = vec4.length(b2) / 2;

    // rough estimation based on the circumsphere.
    if (vec3.distance(c1,c2)>r1+r2) return false;
    return true;
}

/**
 * Tests whether the node collides with the nodes tree whose root base.
 * @param {myNode} node
 * @param {myNode} base
 */
function collisionWithAll(node,base){
    if (collisionTest(node,base)) return true;
    for (let child of base.children){
        if (collisionWithAll(node,child)) return true;
    }
    return false;
}

export{collisionWithAll};