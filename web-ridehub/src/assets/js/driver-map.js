mapboxgl.accessToken =
  "pk.eyJ1IjoidG91a2x3ZXoiLCJhIjoiY2t2M3VvZ2Q1MGEwdTJ3cGcwMHQ3Zjh5eiJ9.LsgKO5Lxz9x55lv-5C7cmQ"

navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
  enableHighAccuracy: true
})


var data = [];
var marker = [];

async function getMarkers() {
  let rideID = localStorage.getItem('rideID');
  const url = `http://ec2-35-173-187-5.compute-1.amazonaws.com/v1/ride/${rideID}`;
  let request = await fetch(url, {
    method: 'get',
    headers: new Headers({
      'Authorization': `Bearer ${localStorage.getItem('userToken')}`
    }),
  });
  console.log(request);
  return await request.json(request)
}



function successLocation(position) {
  setupMap([-8.6279089, 41.5371497])
}

function errorLocation() {
  setupMap([-2.24, 53.48])
}

async function setupMap(center) {

  data = await getMarkers();

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/dark-v10",
    center: center,
    zoom: 15,
  })

  const nav = new mapboxgl.NavigationControl()
  map.addControl(nav)

  var directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    interactive: false
  })

  map.addControl(directions, "top-left")

  map.on('load',  function() {
    directions.setOrigin([data.geo_origem.split(',')[0], data.geo_origem.split(',')[1]]);
    directions.setDestination([data.geo_destino.split(',')[0], data.geo_destino.split(',')[1]]);
  })


}
