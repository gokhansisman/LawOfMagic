var socket = io();

socket.on('new coordinate', handleNewCoordinate);

main();
function main() {
    fetch('/api/coordinates')
    .then(data => data.json())
    .then(coordinates => {
        coordinates.forEach(coordinate => {
            addLog(coordinate);
        });
    })
}

function addTempMarker(latLng) {
    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        icon: {
            url: '/images/signal.gif',
        },
        optimized: false
    });

    setTimeout(removeMarker.bind(this, marker), 5000);
}

function removeMarker(marker) {
    marker.setMap(null);
    delete marker;
}

function handleNewCoordinate(coordinate) {
    var latLng = {
        lat: coordinate.lat,
        lng: coordinate.lng
    };
    
    addTempMarker(latLng);
    addLog(coordinate);
}

function addLog(coordinate) {
    var logCloneHTML = $('#log-clone').html()
    logCloneHTML = logCloneHTML.replaceAll('$LAT', coordinate.lat)
    logCloneHTML = logCloneHTML.replaceAll('$LNG', coordinate.lng)
    logCloneHTML = logCloneHTML.replaceAll('$DATE', new Date(coordinate.date).toGMTString())

    $('.logs-container').prepend(logCloneHTML);
}

function goToCoordinate(lat, lng) {
    var center = new google.maps.LatLng(lat, lng);
    map.panTo(center);
    map.setZoom(14);
    var latLng = { lat: lat, lng: lng };
    addTempMarker(latLng);
}