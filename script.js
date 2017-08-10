// declare the variables
var quakes = {};
quakes.mag = [];
quakes.felt = [];
quakes.lat =[];
quakes.long =[];
quakes.time = [];
quakes.deets = [];
quakes.date = [];

//for mapbox layers
quakes.markerLayerOne = L.layerGroup();
quakes.markerLayerTwo = L.layerGroup();
quakes.markerLayerThree= L.layerGroup();
quakes.markerLayerFour = L.layerGroup();



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
	  quakes.mapper();
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
		  	   if (typeof data[info].location != "undefined") {
		  	      quakes.deets.push(data[info].location.en);
		  	   } else {
		  	   	 quakes.deets = "";
		  	   };
	  	}
	  }
	  quakes.mag.reverse();
	  quakes.felt.reverse();
	  quakes.lat.reverse();
	  quakes.long.reverse();
	  quakes.time.reverse();
	  quakes.date.reverse();
	  quakes.deets.reverse();
};

//put number of earthquakes in the last x on the page. 
quakes.printData = function(){

	$(".number").text(quakes.mag.length);	
	$(".date").text(quakes.date[quakes.date.length - 1]);
	$(".time").text(quakes.time[quakes.date.length - 1].replace((/\+.*$/),''));

	if (quakes.deets != "") {
	   $(".location").text(quakes.deets[quakes.date.length - 1].toLowerCase());
	} else {
		$(".location").text("(Location details temporarily unavailable.)");
	};

	var big = quakes.mag;
	var i = big.indexOf(Math.max.apply(Math, big));
	$(".mag").text(quakes.mag[i]);

	if (quakes.deets != "") {
	   $(".bigPlace").text(quakes.deets[i].toLowerCase());
	} else {
		$(".bigPlace").text("(Location details temporarily unavailable.)");
	};

};

function tooltip_contents(d, defaultTitleFormat, defaultValueFormat, color) {
	return "<strong> Magnitude: </strong>" + d[0].value + "<br>" +
		   "<strong> Location: </strong>" + quakes.deets[d[0].x] + "<br>" +
	       "<strong> Date: </strong>" + quakes.date[d[0].x]; 
	  };

//make quake c3 graph
quakes.makeGraph = function() {
	var months = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
	var jsonData = [];
	for (i = 0 ; i < quakes.mag.length; i++) {
		jsonData.push({"total": quakes.mag[i], "indicator": months[new Date(quakes.date[i]).getMonth()] + " " + new Date(quakes.date[i]).getDate()
})

	}

	var chart = c3.generate({

	    data: {
	        json: jsonData,
	        keys: {
	            x: 'indicator',
	            value: ['total']
	        }
	    },
	    axis: {
	            x: {
	                type: 'category',

	                tick: {
	                	culling: true,
	                	count: 5,
	                }
	            }
	    },
	     tooltip: {
	    			contents: tooltip_contents
	    		}
	});
};


//make map
quakes.mapper = function (){
      L.mapbox.accessToken = 'pk.eyJ1IjoiY2FyeXMiLCJhIjoiY2lmcnA0bDAxMG1yNHMybTB4cDFkMnEzMyJ9.4Z26iDuKWwLy8qs1MyTkDg';

       var mq = window.matchMedia( "(min-width: 700px)" );
       if (mq.matches){
           quakes.map = new L.mapbox.map('map', 'carys.o80m0io8').setView([62, -100.50], 3); //zoom for desktop size
       } else {
           quakes.map = new L.mapbox.map('map', 'carys.o80m0io8').setView([62, -100.50], 2); //for mobile size
       };

       for (i = 0; i < quakes.mag.length; i++) {

       	var pop = "<strong> Magnitude: </strong>" + quakes.mag[i] + "<br>" +
	     		"<strong> Felt: </strong>" + quakes.felt[i].replace(/t/i, "Yes") + "<br>" + 
	     		"<strong> Date: </strong>" + quakes.date[i] + "<br>" +
	     		"<strong> Time: </strong>" + quakes.time[i].replace((/\+.*$/),'') + "<br>" + 
	     		"<strong> Location: </strong>" + quakes.deets[i]

	       if (quakes.mag[i] <= 2) {
	       	L.circleMarker([quakes.lat[i], quakes.long[i]], {
	       	                color: '#FFF',
	       	                radius: 4,
	       	          })
	       	      	.bindPopup(pop)
	       	      	.addTo(quakes.markerLayerOne);
	       	}

	     else if (quakes.mag[i] > 2 && quakes.mag[i] < 3) {
	     	      	L.circleMarker([quakes.lat[i], quakes.long[i]], {
	     	                color: '#FF0',
	     	                radius: 6,
	     	          })
	     	      	.bindPopup(pop)
	     	      	.addTo(quakes.markerLayerTwo);
	     	}

	     else if (quakes.mag[i] > 3 && quakes.mag[i] < 4) {
	           	L.circleMarker([quakes.lat[i], quakes.long[i]], {
	                     color:  '#ffa500',
	                     radius: 8,
	               })
	           	.bindPopup(pop)
	           	.addTo(quakes.markerLayerThree);
	     }

	     else if (quakes.mag[i] > 4) {
	     	L.circleMarker([quakes.lat[i], quakes.long[i]], {
	               color: '#BF211E',
	               radius: 10,
	               zIndex : 1000
	         })
	     	.bindPopup(pop)
	     	.addTo(quakes.markerLayerFour);
	     }
 	};
 	  quakes.markerLayerOne.addTo(quakes.map);
 	  quakes.markerLayerTwo.addTo(quakes.map);
 	  quakes.markerLayerThree.addTo(quakes.map);
 	  quakes.markerLayerFour.addTo(quakes.map);

 }; 

	$( "input" ).on( "click", function() {

		if($('#small').is(':checked')) { 
			quakes.map.removeLayer(quakes.markerLayerTwo);
			quakes.map.removeLayer(quakes.markerLayerThree);
			quakes.map.removeLayer(quakes.markerLayerFour);
			quakes.markerLayerOne.addTo(quakes.map);
		}

		else if ($('#smallish').is(':checked')) { 
			quakes.map.removeLayer(quakes.markerLayerOne);
			quakes.map.removeLayer(quakes.markerLayerThree);
			quakes.map.removeLayer(quakes.markerLayerFour);
			quakes.markerLayerTwo.addTo(quakes.map);
		}

		else if ($('#medium').is(':checked')) { 
			quakes.map.removeLayer(quakes.markerLayerOne);
			quakes.map.removeLayer(quakes.markerLayerTwo);
			quakes.map.removeLayer(quakes.markerLayerFour);
			quakes.markerLayerThree.addTo(quakes.map);
		}

		else if ($('#big').is(':checked')) { 
			quakes.map.removeLayer(quakes.markerLayerOne);
			quakes.map.removeLayer(quakes.markerLayerTwo);
			quakes.map.removeLayer(quakes.markerLayerThree);
			quakes.markerLayerFour.addTo(quakes.map);
		}

		else if ($('#all').is(':checked')) { 
			quakes.markerLayerOne.addTo(quakes.map);
			quakes.markerLayerTwo.addTo(quakes.map);
			quakes.markerLayerThree.addTo(quakes.map);
			quakes.markerLayerFour.addTo(quakes.map);
		}
	});

$("button").click(function(){
   $(".wrapper").effect("shake", {times:4}, 1000 );
});

quakes.init = function() {
	quakes.getData();	
};

$(document).ready(function(){
  quakes.init();
  $("h1").fitText(0.9);
});