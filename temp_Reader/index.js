// private settings
var settings = require('./settings/settings.js');
var locations = require('./settings/locations.js');

// libaries
var request = require('request');
var forecastAPI = require('./api/forecast_API.js');
var usbAPI = require('./api/usb_API.js');

// instantiate reader objects
var tempSensor = new usbAPI();
var forecastService = new forecastAPI();

// variables
var readings = new Array(); // readings store
// var lastUpdated = '--';

// check settings for readers
var readers = settings.readers;
readers.forEach(function(reader) {
	if(reader.enabled) {

		console.log('**New reader: ' + reader.name + ' Type: ' + reader.type);

		//start reading loop
		getLatest(reader); //get first reading
		setInterval(function() { getLatest(reader); }, reader.frequency * 60000); //get new readings every x minutes
	}
});

//reporting loop
setInterval(checkForReadings, 5000); //send new readings to server every x seconds

// get latest reading
function getLatest(reader) {

        console.log('Getting Current Temperature for [' + reader.name + ']...');
        console.log('Refresh Interval: [' + reader.frequency  + '] Minutes');
        
        // check reader type
	    switch (reader.type) {
	    	case "usb":
	    		// get temp reading
				tempSensor.getReading(function(reading){			                        
				    storeReading(reader, reading); // store reading
				});
	    		break;
	    	case "forecastio":
	    		// get temp reading
				forecastService.getReading(reader.location, false, function(reading) {
			        storeReading(reader, reading); // store reading
				});
	    		break;
	    	default:
	    		console.log('unknown reader type');
	    }

        function storeReading(reader, reading) {

        	// new reading
	        var newReading = {
        		name: reader.name,
                temp: reading,
             	server: reader.server,
             	key: reader.key,
                timestamp: new Date() // current timestamp
	        };

        	// push to reading store
            readings.push(newReading);
            // log
            console.log(newReading.name + ' Temp: ' + newReading.temp + 'F @[' + newReading.timestamp + ']');
        };
};

// reporting loop
function checkForReadings() {

        console.log('Checking reading store... [' + readings.length + ']');
        if(readings.length > 0) {
                var reading = readings.shift(); // pull out the first reading
                reportReading(reading); // send to server
        }
};  

// report reading to server
function reportReading(reading) {
        
        console.log('Sending new reading...');

        var postURL = 'http://' + reading.server + '/temp/api';

        // send reading to server via post
        request.post({
                url: postURL, 
                form: {
                        name: reading.name,
                        temp: reading.temp,
                        key: reading.key,                    
                        timestamp: reading.timestamp
                }
        }, function(err, httpResponse, body) {
                
                if(err){
                        console.log(err);
                        readings.push(reading) // back to reading store queue
                }     
                else{
                        //console.log(httpResponse);
                        //console.log(body);
                        console.log('Success!');
                }          
        });
};