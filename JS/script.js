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

//put number of earthquakes in the last x on the page. Could use quakes.mag.length or quakes.number
quakes.printData = function(){
	$(".number").text(quakes.mag.length);
};

//make quake c3 graph
quakes.makeGraph = function() {
	var chart = c3.generate({
			    data: {			    	
			        json: {
			            earthquakes: quakes.mag,
			        }
			    },
			    tooltip: {
			            contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
			            	for (i = 0; i < quakes.mag.length; i++) {
				                return  "Magnitude: " + d[0].value +
				                    "<br>" +
				                    "Date: " + quakes.date[i] +
				                    "<br>" +
				                    "Location: " + quakes.deets[i];

				            }
				        }
				       } 
	});
};

//make map
quakes.map = function (){
      L.mapbox.accessToken = 'pk.eyJ1IjoiY2FyeXMiLCJhIjoiY2lmcnA0bDAxMG1yNHMybTB4cDFkMnEzMyJ9.4Z26iDuKWwLy8qs1MyTkDg';
   var map = L.mapbox.map('map', 'carys.o80m0io8')
       .setView([62, -105.50], 3);

       for (i = 0; i < quakes.mag.length; i++) {

	       if (quakes.mag[i] <= 1) {	
	       L.marker([quakes.lat[i], quakes.long[i]], {
	           icon: L.mapbox.marker.icon({
	               'marker-color': '#E5F993',
	               'marker-size' : 'small'
	           }) 
	         }).addTo(map);
	     };
 	};
 };

// change everything when user changes time period. TBD
// quakes.change = function(stuff){
//   $('#quake-select').on("change", function(){
//     var firstTime = $(this).val();
//     quakes.getData();
//     quakes.sortData();
//     quakes.makeGraph();
//     quakes.printData();
//   });
// }; 

quakes.init = function() {
	quakes.getData();	
};

$(document).ready(function(){
  quakes.init();
  $("h1").fitText(1.2);
  // quakes.change();
});