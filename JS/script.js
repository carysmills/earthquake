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
	  url: 'http://www.earthquakescanada.nrcan.gc.ca/api/earthquakes/latest/' + '7d' + '.json',
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
	  		quakes.time.push(data[info].origin_time.replace(/^.+T/,''));
	  		quakes.date.push(data[info].origin_time.replace(/T.*$/, ""));
	  		quakes.deets.push(data[info].location.en);
	  	}
	  }
};

//put number of earthquakes in the last x on the page. Could use quakes.mag.length or quakes.number
quakes.printData = function(){
	$(".number").text(quakes.mag.length);
};

function tooltip_contents(d, defaultTitleFormat, defaultValueFormat, color) {
	return  "Magnitude: " + d[0].value +
	    "<br>" +
	    "Location: " + quakes.deets[i];
    };

//make quake c3 graph
quakes.makeGraph = function() {
	var chart = c3.generate({
			    data: {			    	
			        json: {
			            "Earthquakes by magnitude": quakes.mag,
			        }
			    },
			    tooltip: {
			            contents: tooltip_contents
				       }
	});
};


//make map
quakes.map = function (){
      L.mapbox.accessToken = 'pk.eyJ1IjoiY2FyeXMiLCJhIjoiY2lmcnA0bDAxMG1yNHMybTB4cDFkMnEzMyJ9.4Z26iDuKWwLy8qs1MyTkDg';
   var map = L.mapbox.map('map', 'carys.o80m0io8')
       .setView([62, -100.50], 3);

       for (i = 0; i < quakes.mag.length; i++) {

       	var pop = "<strong> Magnitude: </strong>" + quakes.mag[i] + "<br>" +
	     		"<strong> Felt: </strong>" + quakes.felt[i].replace(/t/i, "Yes") + "<br>" + 
	     		"<strong> Date: </strong>" + quakes.date[i] + "<br>" +
	     		"<strong> Time: </strong>" + quakes.time[i] + "<br>" + 
	     		"<strong> Location: </strong>" + quakes.deets[i]

	       if (quakes.mag[i] <= 2) {
	       	      	L.circleMarker([quakes.lat[i], quakes.long[i]], {
	       	                color: '#E5F993',
	       	                radius: 6,
	       	          })
	       	      	.bindPopup(pop)
	       	      	.addTo(map);
	       	}

	     else if (quakes.mag[i] > 2 && quakes.mag[i] < 3) {
	     	      	L.circleMarker([quakes.lat[i], quakes.long[i]], {
	     	                color: '#F9DC5C',
	     	                radius: 8,
	     	          })
	     	      	.bindPopup(pop)
	     	      	.addTo(map);
	     	}

	     else if (quakes.mag[i] > 3 && quakes.mag[i] < 4) {
	           	L.circleMarker([quakes.lat[i], quakes.long[i]], {
	                     color: '#E9CE2C',
	                     radius: 10,
	               })
	           	.bindPopup(pop)
	           	.addTo(map);
	     }

	     else if (quakes.mag[i] > 4 && quakes.mag[i] < 100) {
	     	L.circleMarker([quakes.lat[i], quakes.long[i]], {
	               color: '#BF211E',
	               radius: 12,
	               zIndex : 1000
	         })
	     	.bindPopup(pop)
	     	.addTo(map);
	     }
 	};
 }; 

quakes.init = function() {
	quakes.getData();	
};

$(document).ready(function(){
  quakes.init();
  $("h1").fitText(1.2);
});