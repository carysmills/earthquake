// declare the variables
var quakes = {};
quakes.mag = [];
quakes.felt = [];
quakes.lat =[];
quakes.long =[];
quakes.time = [];
quakes.deets = [];
quakes.date = [];

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

//put number of earthquakes in the last x on the page. 
quakes.printData = function(){
	$(".number").text(quakes.mag.length);
	$(".location").text(quakes.deets[0]);
	$(".date").text(quakes.date[0]);
	$(".time").text(quakes.time[0]);

	var big = quakes.mag;
	var i = big.indexOf(Math.max.apply(Math, big));

	$(".mag").text(quakes.mag[i]);
	$(".bigPlace").text(quakes.deets[i]);

};

function tooltip_contents(d, defaultTitleFormat, defaultValueFormat, color) {
	return "<strong> Magnitude: </strong>" + d[0].value + "<br>" +
		   "<strong> Location: </strong>" + quakes.deets[d[0].x] + "<br>" +
	       "<strong> Date: </strong>" + quakes.date[d[0].x]; 
	  };

//make quake c3 graph
quakes.makeGraph = function() {
	var chart = c3.generate({
			    data: {			    	
			        json: {
			            "Earthquakes this week by magnitude": quakes.mag,
			        }
			    },
			    axis: {
			        x: {
			            label: 'Earthquakes this week'
			        },
			        y: {
			            label: 'Magnitude'
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
       .setView([62, -100.50], 2);

       for (i = 0; i < quakes.mag.length; i++) {

       	var pop = "<strong> Magnitude: </strong>" + quakes.mag[i] + "<br>" +
	     		"<strong> Felt: </strong>" + quakes.felt[i].replace(/t/i, "Yes") + "<br>" + 
	     		"<strong> Date: </strong>" + quakes.date[i] + "<br>" +
	     		"<strong> Time: </strong>" + quakes.time[i] + "<br>" + 
	     		"<strong> Location: </strong>" + quakes.deets[i]

	       if (quakes.mag[i] <= 2) {
	       	      	L.circleMarker([quakes.lat[i], quakes.long[i]], {
	       	                color: '#8BA870',
	       	                radius: 6,
	       	          })
	       	      	.bindPopup(pop)
	       	      	.addTo(map);
	       	}

	     else if (quakes.mag[i] > 2 && quakes.mag[i] < 3) {
	     	      	L.circleMarker([quakes.lat[i], quakes.long[i]], {
	     	                color: '#FF0',
	     	                radius: 8,
	     	          })
	     	      	.bindPopup(pop)
	     	      	.addTo(map);
	     	}

	     else if (quakes.mag[i] > 3 && quakes.mag[i] < 4) {
	           	L.circleMarker([quakes.lat[i], quakes.long[i]], {
	                     color:  '#ffa500',
	                     radius: 10,
	               })
	           	.bindPopup(pop)
	           	.addTo(map);
	     }

	     else if (quakes.mag[i] > 4 && quakes.mag[i] < 100) {
	     	quakes.red = L.circleMarker([quakes.lat[i], quakes.long[i]], {
	               color: '#BF211E',
	               radius: 12,
	               zIndex : 1000
	         })
	     	.bindPopup(pop)
	     	.addTo(map);
	     }
 	};
 }; 

$("button").click(function(){
   $(".wrapper").effect( "shake", {times:4}, 1000 );
});

quakes.init = function() {
	quakes.getData();	
};

$(document).ready(function(){
  quakes.init();
  $("h1").fitText(1.2);
});