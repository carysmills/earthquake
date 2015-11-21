// declare the variables

var quakes = {};
quakes.mag = [];
quakes.felt = [];
quakes.where =[];
quakes.time = [];
quakes.deets = [];
quakes.date = [];

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
	  for (var info in data) {
	  	if (data[info].request) {
		  	quakes.number = data[info].request.resultCount;
	  	} else {
	  		quakes.mag.push(data[info].magnitude);
	  		quakes.string = quakes.mag.toString().replace(/,/g, ', ');
	  		quakes.felt.push(data[info].felt);
	  		quakes.where.push(data[info].geoJSON.coordinates);
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


//start of graph
            // line chart data
            var cheeseData = {
                labels : [quakes.date],
                datasets : [
                  {
            label: "Specialty cheese consuption per capita",
            fillColor: "#FFF380",
            strokeColor: "#800080",
            pointColor: "#FFF380",
            pointStrokeColor: "#800080",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "#800080",
                    data : [quakes.string]
                  }
    ]
};

            // get line chart canvas
            var cheese = document.getElementById('cheese').getContext('2d');
            // draw line chart
            new Chart(cheese).Line(cheeseData, {
        });

 //end of graph           


//put it all together in the init 
quakes.init = function() {
	quakes.getData();	
};

//run the init on page ready
$(document).ready(function(){
  quakes.init();
});