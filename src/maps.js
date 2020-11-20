let map;
let infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 6,
  });
  infoWindow = new google.maps.InfoWindow();
 
  const geocoder = new google.maps.Geocoder();
  const locationButton = document.getElementById('myPosition');

  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          geocoder.geocode({location: pos}, (results, status) => {
            if(status == 'OK'){
              if(results[0]){
                console.log(results);
                let address = results[0].address_components;
                document.getElementById('fromAddress').value = address[1].long_name +' '+ address[0].long_name; 
              }
            }
          })
          //infoWindow.setPosition(pos);
          //infoWindow.setContent("Location found.");
          //infoWindow.open(map);
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

window.initMap = initMap;
window.handleLocationError = handleLocationError;