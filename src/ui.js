
// var display_value = 0;
window.sunAngle = 90;
window.fogDensity = 25;
// window.objSize = 10;
// Setup a ui.
webglLessonsUI.setupSlider("#Light", {value: window.sunAngle, slide: updateLightAngle, min: 0, max: 180});
webglLessonsUI.setupSlider("#Fog", {value: window.fogDensity, slide: updateFogDensity, min: 0, max: 100});

function updateLightAngle(event, ui) {
    window.sunAngle = ui.value;
}

function updateFogDensity(event, ui) {
    window.fogDensity = ui.value;
}

// function updateObjectSize(event, ui) {
//     window.objSize = ui.value;
// }