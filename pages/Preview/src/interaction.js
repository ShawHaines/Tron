/********************************************
* Interaction Control
*********************************************/

import {Camera} from './camera.js';

var myCamera=Camera(10,0.1);
console.log(myCamera);
/* mouse, keyboard, and virtual joystick support */
document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "w":
            myCamera.moveForward();
            break;
        case "a":
            myCamera.moveLeft();
            break;
        case "s":
            myCamera.moveBackward();
            break;
        case "d":
            myCamera.moveRight();
            break;
        case "e":
            myCamera.moveUp();
            break;
        case "q":
            myCamera.moveDown();
            break;
        case "j":
            myCamera.watchLeft();
            break;
        case "l":
            myCamera.watchRight();
            break;
        case "i":
            myCamera.watchUp();
            break;
        case "k":
            myCamera.watchDown();
            break;
    }
});

var mouseDownX = 0;
var mouseDownY = 0;
var mouseX = 0;
var mouseY = 0;
var mouseDownFlag = false;
document.getElementById("c").onmousedown = function(e) {
    mouseDownX = e.pageX;
    mouseDownY = e.pageY;
    mouseDownFlag = true;
}

document.getElementById("c").onmousemove = function(e) {
    var moveX = e.pageX - mouseX;
    var moveY = e.pageY - mouseY;
    mouseX = e.pageX;
    mouseY = e.pageY;

    if(mouseDownFlag) {
        myCamera.changeWatchDir(moveX * 0.001, -moveY * 0.001);
    }

}

document.getElementById("c").onmouseup = function(e) {
    mouseDownFlag = false;
}

setInterval(function(){
    if(joystick.right()) {
        myCamera.moveRight();
    }
    if(joystick.left()) {
        myCamera.moveLeft();
    }
    if(joystick.up()) {
        // console.log("Forward!")
        myCamera.moveForward();
    }
    if(joystick.down()) {
        myCamera.moveBackward();
    }

}, 1/30 * 1000);


var touchX = 0;
var touchY = 0;
var touchId;
var touchDownFlag = false;

document.getElementById("c").ontouchstart = function(e) {
    touchDownFlag = true;
    touchId = e.changedTouches[0].identifier;
    touchX = e.changedTouches[0].pageX;
    touchY = e.changedTouches[0].pageY;
}
document.getElementById("c").ontouchend = function(e) {
    touchDownFlag = false;
    touchId = null;
}

document.getElementById("c").ontouchmove = function(e) {
    

    // if(mouseDownFlag) {
    //     myCamera.changeWatchDir(-moveX * 0.002, moveY * 0.002);
    // }

    // // try to find our touch event
    var touchList	= e.changedTouches;
    for(var i = 0; i < touchList.length && touchList[i].identifier !== touchId; i++ );
    // if touch event with the proper identifier isnt found, do nothing
    if( i === touchList.length )	return;
    var touch	= touchList[i];

    var touchMoveX = touch.pageX - touchX;
    var touchMoveY = touch.pageY - touchY;

    touchX = touch.pageX;
    touchY = touch.pageY;

    // e.preventDefault();

    // var x		= touch.pageX - this._biasX;
    // var y		= touch.pageY - this._biasY;
    // console.log(-touchMoveX * 0.002, touchMoveY * 0.002);
    if(touchDownFlag == true)
        // myCamera.watchLeft();
        myCamera.changeWatchDir(touchMoveX * 0.001, -touchMoveY * 0.001);
}

export {myCamera};