var dateInfo = new Date;
var timestamp = Math.round((new Date()).getTime() / 1000);


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
		var stage = data.stage;

		console.log(moonAPIUrl);

		$("p#moonAge").html((data.age).toFixed(2) + " days");
		$("p#moonPhase").html(stage);
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
		console.log("Left button clicked: timestamp = " + timestamp + " URL = " + moonAPIUrl);
		moonAPI();
	});

	$("img#leftButton").on("click", function () {
		moonAPIUrl = "http://api.burningsoul.in/moon/" + (timestamp-unixDay) + "/N";
		timestamp -= unixDay;
		console.log("Left button clicked: timestamp = " + timestamp + " URL = " + moonAPIUrl);
		moonAPI();
	});	
}


$(document).ready(function() {

	moonAPI();

	getDayInfo();
	getDateInfo();
	
	
	jumpDay();

});