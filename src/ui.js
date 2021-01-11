
// var display_value = 0;
window.sunAngle = 90;
// window.objSize = 10;
// Setup a ui.
webglLessonsUI.setupSlider("#Light", {value: window.sunAngle, slide: updateLightAngle, min: 0, max: 180});
// webglLessonsUI.setupSlider("#OBJ-size", {value: window.objSize, slide: updateObjectSize, min: 1, max: 100});

function updateLightAngle(event, ui) {
    window.sunAngle = ui.value;
}

// function updateObjectSize(event, ui) {
//     window.objSize = ui.value;
// }