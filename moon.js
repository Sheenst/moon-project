var timestamp13 = new Date().getTime();
var timestamp;
var fullMoon;
var newMoon;

function refresh () {
	$('#pageRefresh').on("click", function() { 
		console.log("refresh button clicked");
		location.reload(true);
	});
};

function time () {
	timestamp = Math.round(timestamp13 / 1000);
}

function getDateInfo () {
	var dayArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	$("#dateSection h2#dayOfWeek").html(dayArray[moment.unix(timestamp).format("E")-1]);
	$("#dateSection h2#date").html(moment.unix(timestamp).format("MMMM DD, YYYY"));
};

function datePicker () {
	$('#hiddenDate').datepicker({
    dateFormat: "@",
    onSelect: function(date) {
    	timestamp13 = date;
    	time();
    	moonAPI();
			getDateInfo();
    }
  });
  $('#pickDate').click(function (e) {
    $('#hiddenDate').datepicker("show");
    e.preventDefault();
  });

};

function moonAPI () {
	var moonAPIUrl = "http://api.burningsoul.in/moon/" + timestamp + "/N";

	$.getJSON(moonAPIUrl,function(data) {
		var illumination;
		var phase;
		console.log(moonAPIUrl);

		/*Display correct moon graphic based on moon age*/
		var moonGraphic;

		if((data.age <= .5) || (data.age >= 29)) {
			moonGraphic = 1
		} else {
			moonGraphic = Math.round(data.age);	
		}
		console.log("data.age = " + data.age);

		console.log("moonGraphic = " + moonGraphic);
		$("div#moonImage").html("<img src='images/phases/" + moonGraphic + ".png'/>");

		$("p#moonAge").html((data.age).toFixed(2) + " days");
		
		/*Moon phase based on age and illumination*/

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
		console.log("Moon age = " + ((data.age).toFixed(2)) + ", illumination = " + illumination + "%");

		/*New Moon & Full Moon*/
		fullMoon = moment.unix(Math.round(data.FM.UT)).format("MMMM DD, YYYY");
		newMoon = moment.unix(data.NNM.UT).format("MMMM DD, YYYY");
		console.log("NNM= " + data.NNM.UT);
		console.log("FM= " + data.FM.UT);

		nextFullMoon();
	});

};

function nextFullMoon() {
	$('#nextMoonEvent').html("Full moon on " + fullMoon);
};

function nextNewMoon() {
	$('#nextMoonEvent').html("New moon on " + newMoon);
};

function moonToggle() {
	var isVisible = $('.toggleSwitch').is(':visible');
	var isHidden = $('.toggleSwitch').is(':hidden');

	$('.toggleTrack').on("click", function() {
		$('p.toggleSwitchNew').toggle();
		$('p.toggleSwitchFull').toggle();
		
		if ($('.toggleSwitchFull').is(":visible")) {
			console.log("toggleSwitchNew is hidden");
			nextFullMoon();
		}
		if ($('.toggleSwitchNew').is(":visible")) {
			console.log("toggleSwitchNew is visible");
			nextNewMoon();
		}
	});
};

function jumpDay () {

	var unixDay = 86400

	$("img#rightButton").on("click", function () {
		moonAPIUrl = "http://api.burningsoul.in/moon/" + (timestamp+unixDay) + "/N";
		timestamp += unixDay;
		console.log("Right button clicked: timestamp = " + timestamp + " URL = " + moonAPIUrl);
		moonAPI();
		getDateInfo();
	});

	$("img#leftButton").on("click", function () {
		moonAPIUrl = "http://api.burningsoul.in/moon/" + (timestamp-unixDay) + "/N";
		timestamp -= unixDay;
		console.log("Left button clicked: timestamp = " + timestamp + " URL = " + moonAPIUrl);
		moonAPI();
		getDateInfo();
	});	

	$(".moonDateSection").on("swipeleft", function () {
		moonAPIUrl = "http://api.burningsoul.in/moon/" + (timestamp+unixDay) + "/N";
		timestamp += unixDay;
		console.log("Swiped left: timestamp = " + timestamp + " URL = " + moonAPIUrl);
		moonAPI();
		getDateInfo();
	});

	$(".moonDateSection").on("swiperight", function () {
		moonAPIUrl = "http://api.burningsoul.in/moon/" + (timestamp-unixDay) + "/N";
		timestamp -= unixDay;
		console.log("Swiped right: timestamp = " + timestamp + " URL = " + moonAPIUrl);
		moonAPI();
		getDateInfo();
	});	

}


$(document).ready(function() {
	
	$('p.toggleSwitchNew').hide();

	time();
	moonAPI();
	getDateInfo();
	datePicker();	
	moonToggle();
	jumpDay();
	refresh();

});