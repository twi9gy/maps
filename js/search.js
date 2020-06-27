var places = [];
var metro = [];
var name_metro = [];
var name_places = [];
var count_request = 0;
var button_route = false;

$(document).ready(function() {
    $('#search').submit(function(e) {
        e.preventDefault();
        //Получаем место
        var place = $(this).find($('#place')).val();
        var pointList;
        //отправляем запрос в геокодер
        $.ajax({
            url: "https://geocode-maps.yandex.ru/1.x/?apikey=555b2a9f-b331-4c9d-8d22-9b57782980eb&format=json&kind=metro&geocode="+place,
            success: function(response)
            {
                if(count_request == 0){
                    $('#route_table').show();
                }
                else if(count_request > 0 && !button_route){
                    var container=document.getElementById('container-search');
                    container.style.height = $('#container-search').height() + 80 + "px"
                    $('#create_route').show();
                    button_route = true;
                }

                //Добавляем точку на карту
                var point = response.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
                var re = ' ';
                pointList = point.split(re);
                places.push([parseFloat(pointList[1]), parseFloat(pointList[0])]);
                name_places.push(place);
                addObject(place, 'метка', places[places.length - 1]);

                //Добавляем адрес в список интересных мест
                var container=document.getElementById('container-search');
                container.style.height = $('#container-search').height() + 80 + "px"
                $('#route_table > tbody:last-child').append(
                                                        '<tr>' +
                                                            '<th scope="row">'+ place +'</th>' +
                                                            '<td>' + places[places.length-1] + '</td>' +
                                                        '</tr>');

                count_request=count_request+1;

                //Поиск метро
                var geocode_str = places[places.length-1][1] + ',' + places[places.length-1][0];
                $.ajax({
                    url: 'https://geocode-maps.yandex.ru/1.x/?apikey=555b2a9f-b331-4c9d-8d22-9b57782980eb&geocode=' +
                        geocode_str + '&kind=metro&format=json&results=1',
                    success: function(data)
                    {
                        var point_metro = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
                        pointList = point.split(re);
                        metro.push([parseFloat(pointList[1]), parseFloat(pointList[0])]);
                        name_metro.push(data.response.GeoObjectCollection.featureMember[0].GeoObject.name);
                        addObject(name_metro, 'метро', metro[metro.length-1]);
                    }
                });
            }
        });
    });
});

function addObject(place, status, point) {
    var preset_type;
    if(status == 'метро'){
        preset_type = 'islands#redStretchyIcon';
    }
    else if(status == 'метка'){
        preset_type = 'islands#blackStretchyIcon';
    }
    // Создание геообъекта с типом точка (метка).
    var myGeoObject = new ymaps.GeoObject({
        geometry: {
            type: "Point", // тип геометрии - точка
            coordinates: point, // координаты точки
            metro: true
        },
        properties: {
            iconContent: place,
        },
    },{
        preset: preset_type,
        // Метку можно перемещать.
        draggable: true
    });
    // Размещение геообъекта на карте.
    myMap.geoObjects.add(myGeoObject);
}