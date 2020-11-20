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
const buttonCurrentPosition = document.querySelectorAll('.current-position')
const inputFromAddress = document.getElementById('fromAddress');
const inputToAddress = document.getElementById('toAddress'); 
const car = 'http://localhost:3000/public/images/car.png'; 

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

function initMap() {
  const geocoder = new google.maps.Geocoder();
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -27.471381, lng: -58.832112 },
    zoom: 13,
  });
  infoRemises(map);
  //infoWindow = new google.maps.InfoWindow();  
  
  buttonCurrentPosition[0].addEventListener("click", () => {
    handleCurrentGeocoder(inputFromAddress, geocoder);
  });
  buttonCurrentPosition[1].addEventListener("click", () => {
    handleCurrentGeocoder(inputToAddress, geocoder);
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

function handleCurrentGeocoder(inputElement, geocoder){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        geocoder.geocode({location: pos}, (results, status) => {
          if(status == 'OK'){
            if(results[0]){
              inputElement.value = results[0].formatted_address;
            }
          }
        })

        map.setCenter(pos);
        const marker = new google.maps.Marker({
          position: pos,
          map: map,
        });
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

window.initMap = initMap;
//window.handleLocationError = handleLocationError;