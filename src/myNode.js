/********************************************
    * Class **myNode** definition
*********************************************/
import {m4} from "../modules/twgl/twgl-full.module.js";
var myNode = function() {
    this.children = [];
    this.localMatrix = m4.identity();
    this.worldMatrix = m4.identity();
    this.drawInfo = {
            uniforms: {},
            useMTL: false,
    };
};

myNode.prototype.setParent = function(parent) {
    // Move from old parent
    if (this.parent) {
      var ndx = this.parent.children.indexOf(this);
      if (ndx >= 0) {
        this.parent.children.splice(ndx, 1);
      }
    }
   
    // Add to parent
    if (parent) {
      parent.children.push(this);
    }
    this.parent = parent;
};


myNode.prototype.updateWorldMatrix = function(parentWorldMatrix) {
    if (parentWorldMatrix) {
      // a matrix was passed in so do the math
      m4.multiply(parentWorldMatrix, this.localMatrix, this.worldMatrix);
    } else {
      // no matrix was passed in so just copy local to world
      m4.copy(this.localMatrix, this.worldMatrix);
    }

    // now process all the children
    var worldMatrix = this.worldMatrix;
    this.children.forEach(function(child) {
      child.updateWorldMatrix(worldMatrix);
    });
  };

export {myNode};