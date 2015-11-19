var quakes = {};
quakes.mag = [];

//*Get quake data
quakes.getData = function() {
	$.ajax({
	  url: 'http://www.earthquakescanada.nrcan.gc.ca/api/earthquakes/latest/7d.json',
	  method: 'GET',
	  dataType: 'json'
	}).then(function(res) {
	  quakes.sortData(res);
	  quakes.printData();
	});
	};

//sort quake data
quakes.sortData = function(data) {
	quakes.number = data.metadata.request.resultCount;
	  for (var info in data) {
	  	if (data[info].request) {
		  	quakes.number = data[info].request.resultCount;
	  	} else {
	  		quakes.details = data[info];
	  		quakes.mag = quakes.details.magnitude;
	  		quakes.felt = quakes.details.felt;
	  		quakes.where = quakes.details.geoJSON.coordinates;
	  		quakes.time = quakes.details.origin_time;
	  	}
	  }
};	

//put number of earthquakes in the last year on the page
quakes.printData = function(){
	$(".number").text(quakes.number);
};


//put it all together in the init 
quakes.init = function() {
	quakes.getData();	
};

//run the init on page ready
$(document).ready(function(){
  quakes.init();
});