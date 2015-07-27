// API Wrapper for External Temp service Forcast.io

var APIKeys = require('./APIKeys'); // private info

// libaries
var geocoder = require('node-geocoder')('google', 'https', {apiKey: APIKeys.google, formatter: null});
var forecast = require('forecast');
var forecast = new forecast({
	service: 'forecast.io',
	key: APIKeys.forcast,
	units: 'f', // fahrenheit
	cache: true, // Cache API request
	ttl: { // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/
		minutes: 5,
		seconds: 0
	}
});

// object constructor
var forecastService = function() {};

// get outside temp based on location
forecastService.prototype.getReading = function(address, log, callback) {
	
	//ding get lat lng from address
	geocoder.geocode(address, function(err, res) {
		
		// get first result (API allows for multiple requests)
		var response = res[0];		
	
                // logging
		if(log){
			console.log('New Lookup');
                	console.log('Address: ' + response.streetNumber + ' ' + response.streetName + ' ' + response.city + ', ' + response.stateCode + ' ' + response.zipcode);
                	console.log('Latitude: ' + response.latitude + ' Longitude: ' + response.longitude);
		}

		// get outside temp 
                forecast.get([response.latitude, response.longitude], true, function(err, weather) {
                        if(err) return console.log(err);
                        else {
                                return callback(weather.currently.temperature);
                        }
                });
        });
};

// export object
module.exports = forecastService;
