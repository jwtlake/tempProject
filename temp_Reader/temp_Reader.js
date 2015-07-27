var APIKeys = require('./APIKeys');
var locations = require('./locations.js');

var forecast = require('forecast');
var geocoder = require('node-geocoder')('google', 'https', {apiKey: APIKeys.google, formatter: null});
var tempSensorAPI = require('./temp_API.js');

//Get Indoor Temp
var tempSensor = new tempSensorAPI();
tempSensor.read(function(reading){
  	console.log('Reading Indoor TEMP Sensor(s)');
	console.log(reading);
});

//Get Outdoor Temp
var forecast = new forecast({
                service: 'forecast.io',
                key: APIKeys.forcast,
                units: 'f', //fahrenheit
                cache: true,      // Cache API requests?
                ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/
                        minutes: 27,
                        seconds: 45
                }
});

//get lat lon
geocoder.geocode(locations.home, function(err, res) {
	//get temp	
	//console.log(err);
	//console.log(resi[0]);
	//console.log(res[0].latitude);
	//console.log(res[0].longitude);	
	forecast.get([res[0].latitude, res[0].longitude], true, function(err, weather) {
		if(err) return console.log(err);
		console.log('Reading Outdoor TEMP');
		console.log(weather.currently.temperature);
	});
});
