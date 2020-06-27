ymaps.ready(init);
var myMap;
function init(){
    myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 7
    });
    myMap.controls.remove('searchControl');
}

$(document).ready(function() {
    $('#create_route').hide();
    $('#route_table').hide();
});