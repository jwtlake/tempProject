// private info
var locations = require('./locations.js');

// libaries
var Hapi = require('hapi');
var forecastAPI = require('./forecast_API.js');
var tempSensorAPI = require('./temp_API.js');

// instantiate temp objects
var tempSensor = new tempSensorAPI();
var forecastService = new forecastAPI();

// get outdoor temp
var outsideTemp = '--';
forecastService.getReading(locations.home, false, function(reading){
	outsideTemp = reading;	
	console.log('Outside Temp: ' + reading + 'F');
});

// get indoor temp
var insideTemp = '--';
tempSensor.read(function(reading){
	insideTemp = reading;
	console.log('Inside Temp: ' + reading + 'F');
});

// create webserver
var server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8080 
});

// route - current temps
server.route({
    method: 'GET',
    path:'/current', 
    handler: function (request, reply) {
       reply("<html><body><h1>Inside Temp:" + insideTemp + "F</h1><h1>Outside Temp:" + outsideTemp + "F</h1></body></html>");
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
console.log('Webserver Started @192.168.0.102:3000 Listening...');
