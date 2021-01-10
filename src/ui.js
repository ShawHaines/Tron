
var display_value = 0;
// Setup a ui.
webglLessonsUI.setupSlider("#Light", {value: display_value, slide: updateRotation, min: 0, max: 100});
webglLessonsUI.setupSlider("#OBJ-size", {value: display_value, slide: updateRotation, min: 0, max: 100});

function updateRotation(event, ui) {
    display_value = ui.value;
}