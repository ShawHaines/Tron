/********************************************
* Interaction Control
*********************************************/

import {Camera} from './camera.js';

/* mouse, keyboard, and virtual joystick support */
document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "w":
            myCamera.movePos(0, 0, -2);
            break;
        case "a":
            myCamera.movePos(-2, 0, 0);
            break;
        case "s":
            myCamera.movePos(0, 0, 2);
            break;
        case "d":
            myCamera.movePos(2, 0, 0);
            break;
        case "e":
            myCamera.movePos(0, 2, 0);
            break;
        case "q":
            myCamera.movePos(0, -2, 0);
            break;
        case "j":
            myCamera.moveView(-2, 0);
            break;
        case "l":
            myCamera.moveView(2, 0);
            break;
        case "i":
            myCamera.moveView(0, 2);
            break;
        case "k":
            myCamera.moveView(0, -2);
            break;
    }
    // console.log("Keydown:", myCamera.viewMatrix);
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
        myCamera.moveView(-moveX * 0.05, moveY * 0.05);
        // console.log("Mousemove:", myCamera.viewMatrix);
    }

}

document.getElementById("c").onmouseup = function(e) {
    mouseDownFlag = false;
}

setInterval(function(){
    if(joystick.right()) {
        myCamera.movePos(2, 0, 0);
    }
    if(joystick.left()) {
        myCamera.movePos(-2, 0, 0);
    }
    if(joystick.up()) {
        // console.log("Forward!")
        myCamera.movePos(0, 0, -2);
    }
    if(joystick.down()) {
        myCamera.movePos(0, 0, 2);
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
        myCamera.moveView(-touchMoveX * 0.05, touchMoveY * 0.05);
}

export {myCamera};