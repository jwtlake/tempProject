var Hapi = require('hapi');
var ip = require('ip');

// Create new server object and pass in some options to
// log errors when a 500 happens
var port = 3000;
var server = new Hapi.Server({ debug: { request: ['error'] } });

server.connection({
    port: port
});

//routes
server.route(require('./routes/index.js'));

//start server
server.start(function() {
	console.log('Webserver Started @' + ip.address() + ':' + port + ' Listening...');
});

//debug
//var readingController = require('./controllers/readingController.js');
//var readingObject = require('./objects/readingObject.js');
//var controller = new readingController();
//var reading = new readingObject(null,100.02,1,'2011-05-16 15:36:38',null);

//controller.newReading(reading);
//controller.getAllReadings();

