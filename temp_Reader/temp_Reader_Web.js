// private info
var locations = require('./settings/locations.js');

// libaries
var Hapi = require('hapi');
var ip = require('ip');
var forecastAPI = require('./api/forecast_API.js');
var tempSensorAPI = require('./api/usb_API.js');

// instantiate temp objects
var tempSensor = new tempSensorAPI();
var forecastService = new forecastAPI();

// variables
var updateInterval = 5; // in minutes
var lastUpdated = '--';
var outsideTemp = '--';
var insideTemp = '--';

// get latest readings
function getLatest(){
	
	// update time stamp
	var datetime = new Date();
	lastUpdated = datetime;
	console.log('Getting Current Temperature...');
	console.log('Refresh Interval: [' + updateInterval  + '] Minutes');
	
	// get outdoor temp
	forecastService.getReading(locations.home, false, function(reading){
        	outsideTemp = reading;
        	console.log('Outside Temp: ' + reading + 'F');
	});

	// get indoor temp
	tempSensor.getReading(function(reading){
        	insideTemp = reading;
        	console.log('Inside Temp: ' + reading + 'F');
	});
};
getLatest(); //get first reading
setInterval(getLatest, updateInterval * 60000); //get new readings every x minutes

// create webserver
var port = 3000
var server = new Hapi.Server();
server.connection({ 
    port: port 
}); // host: 'localhost', --removed because it wasnt working

// route - current temps
server.route({
    method: 'GET',
    path:'/current', 
    handler: function (request, reply) {
       reply("<html><body><h1>Inside Temp:" + insideTemp + "F</h1><h1>Outside Temp:" + outsideTemp + "F</h1><p>Last Updated:" + lastUpdated + "</p></body></html>");
    }
});

// route - hello world
server.route({
    method: 'GET',
    path:'/',
    handler: function (request, reply) {
       reply("Hello World");
    }
});

// start the server
server.start();
console.log('Webserver Started @' + ip.address() + ':' + port + ' Listening...');
