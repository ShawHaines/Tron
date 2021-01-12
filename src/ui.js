
// var display_value = 0;
window.sunAngle = 90;
window.fogDensity = 25;
window.zValue = 20;
window.yValue = 3;
// window.objSize = 10;
// Setup a ui.
webglLessonsUI.setupSlider("#Light", {value: window.sunAngle, slide: updateLightAngle, min: 0, max: 180});
webglLessonsUI.setupSlider("#Fog", {value: window.fogDensity, slide: updateFogDensity, min: 0, max: 100});
webglLessonsUI.setupSlider("#PerspectiveZ", {value: window.zValue, slide: updateZValue, min: 0.0, max: 50.0});
// scaled by a factor of 10 because the slider only allows integer values.
webglLessonsUI.setupSlider("#PerspectiveY", {value: window.yValue*10, slide: updateYValue, min: 0.0, max: 50.0});

function updateLightAngle(event, ui) {
    window.sunAngle = ui.value;
}

function updateFogDensity(event, ui) {
    window.fogDensity = ui.value;
}

function updateZValue(event, ui){
    window.zValue=ui.value;
}
function updateYValue(event, ui) {
    window.yValue=ui.value / 10;
}
// function updateObjectSize(event, ui) {
//     window.objSize = ui.value;
// }