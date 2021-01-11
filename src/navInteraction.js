/********************************************
* Interaction Control
*********************************************/
import {myCamera, g_time_interval} from "./main.js";

var navMovePosFlags = [0, 0, 0];

function moveNavCamera(camera)
{
    const FACTOR = 20;
    //only enabled when `navMode` is on
    if(window.navMode){
        //joystick
        if(joystick.right()) {
            camera.movePos(FACTOR * g_time_interval, 0, 0)
        }
        if(joystick.left()) {
            camera.movePos(-FACTOR  * g_time_interval, 0, 0)
        }
        if(joystick.up()) {
            camera.movePos(0, 0, -FACTOR * g_time_interval)
        }
        if(joystick.down()) {
            camera.movePos(0, 0, -FACTOR * g_time_interval)
        }
        //keyboard
        camera.movePos(FACTOR * navMovePosFlags[0] * g_time_interval, FACTOR * navMovePosFlags[1] * g_time_interval, FACTOR * navMovePosFlags[2] * g_time_interval);
    }
}

/* mouse, keyboard, and virtual joystick support */
document.addEventListener("keydown", function (event) {
    if(window.navMode) {
        switch (event.key) {
            case "w":
                navMovePosFlags[2] = -1;
                break;
            case "a":
                navMovePosFlags[0] = -1;
                break;
            case "s":
                navMovePosFlags[2] = 1;
                break;
            case "d":
                navMovePosFlags[0] = 1;
                break;
            case "e":
                navMovePosFlags[1] = 1;
                break;
            case "q":
                navMovePosFlags[1] = -1;
                break;
        }
    }
    // console.log("Keydown:", myCamera.viewMatrix);
});

/* key up */
document.addEventListener("keyup", function (event) {
    switch (event.key) {
        case "w":
            navMovePosFlags[2] = 0;
            break;
        case "a":
            navMovePosFlags[0] = 0;
            break;
        case "s":
            navMovePosFlags[2] = 0;
            break;
        case "d":
            navMovePosFlags[0] = 0;
            break;
        case "e":
            navMovePosFlags[1] = 0;
            break;
        case "q":
            navMovePosFlags[1] = 0;
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
    if(window.navMode){
        mouseDownX = e.pageX;
        mouseDownY = e.pageY;
        mouseDownFlag = true;
    }
}

document.getElementById("c").onmousemove = function(e) {
    if(window.navMode){
        var moveX = e.pageX - mouseX;
        var moveY = e.pageY - mouseY;
        mouseX = e.pageX;
        mouseY = e.pageY;
        if(mouseDownFlag) {
            // console.log("Mousemove:", myCamera.viewMatrix);
            myCamera.moveView(-moveX * 0.05, moveY * 0.05);
        }
    }
}

document.getElementById("c").onmouseup = function(e) {
    if(window.navMode) mouseDownFlag = false;
}



var touchX = 0;
var touchY = 0;
var touchId;
var touchDownFlag = false;

document.getElementById("c").ontouchstart = function(e) {
    if(window.navMode){
        touchDownFlag = true;
        touchId = e.changedTouches[0].identifier;
        touchX = e.changedTouches[0].pageX;
        touchY = e.changedTouches[0].pageY;
    }
}
document.getElementById("c").ontouchend = function(e) {
    if(window.navMode){
        touchDownFlag = false;
        touchId = null;
    }
}

document.getElementById("c").ontouchmove = function(e) {
    
    // if(mouseDownFlag) {
    //     myCamera.changeWatchDir(-moveX * 0.002, moveY * 0.002);
    // }

    // // try to find our touch event
    if(window.navMode){
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
}

export {moveNavCamera}