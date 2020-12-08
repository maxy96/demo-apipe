const Swal = require('sweetalert2');
const calculate = require('./utils/calculate');
let map;
const remises = [
  {
    chofer: "Chofer 1",
    patente: "pat-1",
    estado: "Ocupado",
    ubicacion: {lat: -27.466736, lng: -58.809367}
  },
  {
    chofer: "Chofer 2",
    patente: "pat-2",
    estado: "Disponible",
    ubicacion: {lat: -27.466355, lng: -58.828250}
  },
  {
    chofer: "Chofer 3",
    patente: "pat-3",
    estado: "Disponible",
    ubicacion: {lat: -27.461481, lng: -58.836318}
  }
];
let options = {
  //bounds: defaultBounds,
  types: ['geocode']
};
const buttonCurrentPosition = document.querySelectorAll('.current-position');
const buttonCalculateDistance = document.getElementById('calculateDistance');
const inputFromAddress = document.getElementById('fromAddress');
const inputToAddress = document.getElementById('toAddress'); 
const url = document.URL;
const car = url.replace(/mapa.html/ ,'/public/images/car.png');

console.log(car);
window.positionFrom = new Object();
window.positionTo = new Object();

function setPositionFrom(pos){
  positionFrom = pos;
}

function setPositionTo(pos){
  positionTo = pos;
}


function infoRemises(map){
  for(remis of remises){
    let infowindow = new google.maps.InfoWindow();
    let marker = new google.maps.Marker({
      icon: {
          url: car,
          scaledSize: new google.maps.Size(25,25)
        },
      position: remis.ubicacion,
      map: map 
    });
    google.maps.event.addListener(marker, 'click', (function(marker, remis) {
      return function() {
        infowindow.setContent(`<div>
          <p>Chofer: ${remis.chofer}</p>
          <p>Patente: ${remis.patente}</p>
          <p>Estado: ${remis.estado}</p>
        </div>`);
        infowindow.open(map, marker);
      }
    })(marker, remis));
  }
}
//const autocomplete = new google.maps.places.Autocomplete(inputFromAddress);

function initMap() {
  const geocoder = new google.maps.Geocoder();
  const autocompleteInputFromAddress = new google.maps.places.Autocomplete(inputFromAddress);
  const autocompleteInputToAddress = new google.maps.places.Autocomplete(inputToAddress);
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -27.471381, lng: -58.832112 },
    zoom: 13,
  });

  directionsRenderer.setMap(map);

  const markerFrom = new google.maps.Marker({map: map});
  const markerTo = new google.maps.Marker({map: map});

  infoRemises(map);

  autocompleteInputFromAddress.addListener('place_changed', () => {
    const place = autocompleteInputFromAddress.getPlace();
    handleInputPlace(place, geocoder, markerFrom, inputFromAddress, positionFrom);
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  });

  autocompleteInputToAddress.addListener('place_changed', () => {
    const place = autocompleteInputToAddress.getPlace();
    handleInputPlace(place, geocoder, markerTo, inputToAddress, positionTo);
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  });

  buttonCurrentPosition[0].addEventListener('click', () => {
    handleCurrentGeocoder(inputFromAddress, geocoder, markerFrom);
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  });

  buttonCalculateDistance.addEventListener('click', () =>{
    const service = new google.maps.DistanceMatrixService();
    if(positionFrom && positionTo)
      markerFrom.setVisible(false);
      markerTo.setVisible(false);
      calculateDistance(service);
  });

}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Tu navagador no soporta geolocalizacion."
  );
  infoWindow.open(map);
}

function handleCurrentGeocoder(inputElement, geocoder, marker){
  let infoWindow = new google.maps.InfoWindow();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        positionFrom = pos;

        geocoder.geocode({location: pos}, (results, status) => {
          if(status == 'OK'){
            if(results[0]){
              inputElement.value = results[0].formatted_address;
            }
          }
        })

        map.setCenter(pos);
        marker.setPosition(pos);
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleInputPlace(place, geocoder, marker ,input, position){
  geocoder.geocode({'placeId': place.place_id}, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      const lat = results[0].geometry.location.lat();
      const lng = results[0].geometry.location.lng();
      //const direccion = place.formatted_address;
      marker.setPosition({lat: lat, lng: lng});
      position.lat = lat;
      position.lng = lng;
    }
  });
  if (!place.geometry) {
    window.alert('Datos incorrectos ');
    input.value = "";
    return;
  }  
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  if(inputFromAddress.value && inputToAddress.value){
    directionsService.route(
      {
        origin: {
          query: inputFromAddress.value,
        },
        destination: {
          query: inputToAddress.value,
        },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }
}

function calculateDistance(service){
  service.getDistanceMatrix(
    {
      origins: [new google.maps.LatLng(positionFrom.lat,positionFrom.lng)],
      destinations: [new google.maps.LatLng(positionTo.lat,positionTo.lng)],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    }, (response, status) => {
      if(status == 'OK'){
        let results = response.rows[0].elements;
        let distanceText;
        let distanceValue;
        let duration;
        
        for (let i = 0; i < results.length; i++) {
          var element = results[i];
          distanceText = element.distance.text;
          distanceValue = element.distance.value;
          duration = element.duration.text;
        } 
        let distance = distanceValue/1000;
        //toFixed(1) redondea a un solo decimal
        showInfo(distanceText, duration, distance.toFixed(1));
      }else{
        alert('error')
      }
    })
}

function showInfo(distanceText, duration, distanceNro){
  const direction = inputFromAddress.value.split(",")[0];//obtener un array de substring  antes de la coma
  const directionWPP = direction.replace(/\s/g, "%20");//reemplazar los espacio por %20
  const price = calculate.calculatePrice(distanceNro);
   
  Swal.fire({
    title: '<strong><u>Informacion sobre el recorrido</u></strong>',
    icon: 'info',
    html:
      `<p><b>Distancia:</b> ${distanceText}</p>
      <p><b>Tiempo:</b> ${duration}</p>
      <p><b>Precio:</b> $${price}</p>
      `,
    showCloseButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText:
      '<i class="fab fa-whatsapp"></i> Solicitar',
    confirmButtonAriaLabel: 'Thumbs up, great!',
    cancelButtonText:
      '<i class="fa fa-thumbs-down"></i>',
    cancelButtonAriaLabel: 'Thumbs down'
  }).then((result) => {
    if(result.value)
      window.location.href = `https://api.whatsapp.com/send?phone=5493794963811&text=Necesito%20un%20remis%20en%20${directionWPP}%20para%20la%20persona:%20ingrese%20su%20apellido%20aqui`;
  });
}

window.initMap = initMap;
//window.handleLocationError = handleLocationError;