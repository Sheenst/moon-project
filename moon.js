var dateInfo = new Date;
var timestamp = Math.round((new Date()).getTime() / 1000);
var moonGraphic;
var apiResults = null;
var illumination;
var phase;


function getDayInfo () {
	var dayArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	$("#datePicker h2#dayOfWeek").html(dayArray[dateInfo.getDay()-1]);
};

function getDateInfo () {
	var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	$("#datePicker h2#date").html(monthArray[dateInfo.getMonth()] + " " + dateInfo.getDate() + ", " + dateInfo.getFullYear());
};


function moonAPI () {

	var moonAPIUrl = "http://api.burningsoul.in/moon/" + timestamp + "/N";

	$.getJSON(moonAPIUrl,function(data) {

		console.log(moonAPIUrl);

		return data;
	});
};

/*Display correct moon graphic based on moon age*/
function moonGraphic (apiResults) {

	if((apiResults.age <= .5) || (apiResults.age >= 29)) {
		moonGraphic = 1
	} else {
		moonGraphic = Math.round(apiResults.age);	
	}
	console.log("apiResults.age = " + apiResults.age);

	console.log("moonGraphic = " + moonGraphic);
	$("div#moonImage").html("<img src='images/phases/" + moonGraphic + ".png'/>");

	$("p#moonAge").html((apiResults.age).toFixed(2) + " days");

};
		
/*		Moon phase based on age and illumination*/
function moonPhase (apiResults) {
	if(apiResults.illumination <= 1) {
		phase = "New moon"
	}
	if(apiResults.illumination > 1 && apiResults.illumination <= 49 && apiResults.age < 14.77) {
		phase = "Waxing crescent"
	}
	if(apiResults.illumination > 49 && apiResults.illumination < 51 && apiResults.age < 14.77) {
		phase = "First quarter"
	}
	if(apiResults.illumination >= 51 && apiResults.illumination <= 99 && apiResults.age < 14.77) {
		phase = "Waxing gibbous"
	}
	if(apiResults.illumination > 99 && apiResults.illumination <= 100) {
		phase = "Full moon"
	}
	if(apiResults.illumination >= 51 && apiResults.illumination <= 99 && apiResults.age > 14.77) {
		phase = "Waning gibbous"
	}
	if(apiResults.illumination > 49 && apiResults.illumination < 51 && apiResults.age > 14.77) {
		phase = "Third quarter"
	}
	if(apiResults.illumination > 1 && apiResults.illumination <= 49 && apiResults.age > 14.77) {
		phase = "Waning crescent"
	}
	$("p#moonPhase").html(phase);
};
		
/*Illumination as integer, unless it's below 1*/
function illuminationInteger (apiResults) {
		if(apiResults.illumination >= 1) {
			illumination = parseInt(apiResults.illumination);
		} else if (apiResults.illumination < 1) {
			illumination = apiResults.illumination.toFixed(2);
		}
		$("p#illuminated").html(illumination + "%");
		
		$("h3#nextFullMoon").html("Next Full Moon on " + apiResults.FM.DT);
		
		$("h3#nextNewMoon").html("Next New Moon on " + apiResults.NNM.DT);

		console.log("Moon age = " + ((apiResults.age).toFixed(2)) + ", illumination = " + illumination + "%");
};

function jumpDay () {

	var unixDay = 86400

	$("img#rightButton").on("click", function () {
		moonAPIUrl = "http://api.burningsoul.in/moon/" + (timestamp+unixDay) + "/N";
		timestamp += unixDay;
		$("#moonImage").css("background", "red"); //for testing
		console.log("Right button clicked: timestamp = " + timestamp + " URL = " + moonAPIUrl);
		moonAPI();
	});

	$("img#leftButton").on("click", function () {
		moonAPIUrl = "http://api.burningsoul.in/moon/" + (timestamp-unixDay) + "/N";
		timestamp -= unixDay;
		$("#moonImage").css("background", "teal"); //for testing
		console.log("Left button clicked: timestamp = " + timestamp + " URL = " + moonAPIUrl);
		moonAPI();
	});	

	$(".moonDateSection").on("swipeleft", function () {
		moonAPIUrl = "http://api.burningsoul.in/moon/" + (timestamp+unixDay) + "/N";
		timestamp += unixDay;
		$("#moonImage").css("background", "red"); //for testing
		console.log("Swiped left: timestamp = " + timestamp + " URL = " + moonAPIUrl);
		moonAPI();
	});

	$(".moonDateSection").on("swiperight", function () {
		moonAPIUrl = "http://api.burningsoul.in/moon/" + (timestamp-unixDay) + "/N";
		timestamp -= unixDay;
		$("#moonImage").css("background", "teal"); //for testing
		console.log("Swiped right: timestamp = " + timestamp + " URL = " + moonAPIUrl);
		moonAPI();
	});	

};


$(document).ready(function() {
	apiResults = moonAPI();
	moonGraphic(apiResults);
	moonPhase(apiResults);
	illuminationInteger(apiResults);

	getDayInfo();
	getDateInfo();
	jumpDay();

});