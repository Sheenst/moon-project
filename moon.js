var dateInfo = new Date;
var timestamp = Math.round((new Date()).getTime() / 1000);
var moonGraphic;


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

		var illumination;
		var phase;
		/*var phaseArray = ['New moon', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full moon', 'Waning gibbous', 'Third quarter', 'Waning crescent'];*/

		console.log(moonAPIUrl);

/*Display correct moon graphic based on moon age*/

		if((data.age <= .5) || (data.age >= 29)) {
			moonGraphic = 1
		} else {
			moonGraphic = Math.round(data.age);	
		}
		console.log("data.age = " + data.age);

		console.log("moonGraphic = " + moonGraphic);
		$("div#moonImage").html("<img src='images/phases/" + moonGraphic + ".png'/>");

		$("p#moonAge").html((data.age).toFixed(2) + " days");
		
/*		Moon phase based on age and illumination*/

		if(data.illumination <= 1) {
			phase = "New moon"
		}
		if(data.illumination > 1 && data.illumination <= 49 && data.age < 14.77) {
			phase = "Waxing crescent"
		}
		if(data.illumination > 49 && data.illumination < 51 && data.age < 14.77) {
			phase = "First quarter"
		}
		if(data.illumination >= 51 && data.illumination <= 99 && data.age < 14.77) {
			phase = "Waxing gibbous"
		}
		if(data.illumination > 99 && data.illumination <= 100) {
			phase = "Full moon"
		}
		if(data.illumination >= 51 && data.illumination <= 99 && data.age > 14.77) {
			phase = "Waning gibbous"
		}
		if(data.illumination > 49 && data.illumination < 51 && data.age > 14.77) {
			phase = "Third quarter"
		}
		if(data.illumination > 1 && data.illumination <= 49 && data.age > 14.77) {
			phase = "Waning crescent"
		}
		$("p#moonPhase").html(phase);
		
/*Illumination as integer, unless it's below 1*/
		if(data.illumination >= 1) {
			illumination = parseInt(data.illumination);
		} else if (data.illumination < 1) {
			illumination = data.illumination.toFixed(2);
		}
		$("p#illuminated").html(illumination + "%");
		
		$("h3#nextFullMoon").html("Next Full Moon on " + data.FM.DT);
		
		$("h3#nextNewMoon").html("Next New Moon on " + data.NNM.DT);

		console.log("Moon age = " + ((data.age).toFixed(2)) + ", illumination = " + illumination + "%");
	});
};

function jumpDay () {

	var unixDay = 86400

	$("img#rightButton").on("click", function () {
		moonAPIUrl = "http://api.burningsoul.in/moon/" + (timestamp+unixDay) + "/N";
		timestamp += unixDay;
/*		$("#moonImage").css("background", "red"); //for testing*/
		console.log("Right button clicked: timestamp = " + timestamp + " URL = " + moonAPIUrl);
		moonAPI();
	});

	$("img#leftButton").on("click", function () {
		moonAPIUrl = "http://api.burningsoul.in/moon/" + (timestamp-unixDay) + "/N";
		timestamp -= unixDay;
/*		$("#moonImage").css("background", "teal"); //for testing*/
		console.log("Left button clicked: timestamp = " + timestamp + " URL = " + moonAPIUrl);
		moonAPI();
	});	

	$(".moonDateSection").on("swipeleft", function () {
		moonAPIUrl = "http://api.burningsoul.in/moon/" + (timestamp+unixDay) + "/N";
		timestamp += unixDay;
/*		$("#moonImage").css("background", "red"); //for testing*/
		console.log("Swiped left: timestamp = " + timestamp + " URL = " + moonAPIUrl);
		moonAPI();
	});

	$(".moonDateSection").on("swiperight", function () {
		moonAPIUrl = "http://api.burningsoul.in/moon/" + (timestamp-unixDay) + "/N";
		timestamp -= unixDay;
/*		$("#moonImage").css("background", "teal"); //for testing*/
		console.log("Swiped right: timestamp = " + timestamp + " URL = " + moonAPIUrl);
		moonAPI();
	});	

}


$(document).ready(function() {

	moonAPI();

	getDayInfo();
	getDateInfo();
	
	
	jumpDay();

});