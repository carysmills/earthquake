// declare the variables

var quakes = {};
quakes.mag = [];
quakes.felt = [];
quakes.lat =[];
quakes.long =[];
quakes.time = [];
quakes.deets = [];
quakes.date = [];
quakes.firstTime = "7d";

//*Get quake data
quakes.getData = function() {
	$.ajax({
	  url: 'http://www.earthquakescanada.nrcan.gc.ca/api/earthquakes/latest/' + quakes.firstTime + '.json',
	  method: 'GET',
	  dataType: 'json'
	}).then(function(res) {
	  quakes.sortData(res);
	  quakes.printData();
	  quakes.makeGraph();
	  quakes.map();
	});
	};

//sort quake data
quakes.sortData = function(data) {
	  for (var info in data) {
	  	if (data[info].request) {
		  	quakes.number = data[info].request.resultCount;
	  	} else {
	  		quakes.mag.push(data[info].magnitude);
	  		quakes.string = quakes.mag.toString().replace(/,/g, ', ');
	  		quakes.felt.push(data[info].felt);
	  		quakes.lat.push(data[info].geoJSON.coordinates[0]);
	  		quakes.long.push(data[info].geoJSON.coordinates[1]);
	  		quakes.time.push(data[info].origin_time);
	  		quakes.date.push(data[info].origin_time.replace(/T.*$/, ""));
	  		quakes.deets.push(data[info].location.en);
	  	}
	  }
};

//put number of earthquakes in the last year on the page
quakes.printData = function(){
	$(".number").text(quakes.number);
};

quakes.makeGraph = function() {
	var chart = c3.generate({
			    data: {
			        json: {
			            earthquakes: quakes.mag,
			        }
			    }
	});
};

quakes.map = function (){
      L.mapbox.accessToken = 'pk.eyJ1IjoiY2FyeXMiLCJhIjoiY2lmcnA0bDAxMG1yNHMybTB4cDFkMnEzMyJ9.4Z26iDuKWwLy8qs1MyTkDg';
   var map = L.mapbox.map('map', 'carys.nn6p55nf')
       .setView([62, -105.50], 2);

       L.marker([quakes.lat, quakes.long], {
           icon: L.mapbox.marker.icon({
               'marker-size': 'large',
               'marker-symbol': 'bus',
               'marker-color': '#fa0'
           })
       }).addTo(map);
};


//put it all together in the init 
quakes.init = function() {
	quakes.getData();	
};

//run the init on page ready
$(document).ready(function(){
  quakes.init();
  $('#quake-select').on("change", function(){
    var firstTime = $(this).val();
    quakes.getData();
    quakes.sortData();
    quakes.makeGraph();
  });
});