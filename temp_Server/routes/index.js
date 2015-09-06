//routes
//why dont i have to pass paramaters for handler functions?
var Routes = [{
	path: '/',
	method: 'GET',
	handler: function (request, reply){
		reply.redirect('/temp/current');
	}
},
{
        path: '/temp/current',
        method: 'GET',
        handler: getCurrent
},
{
	path: '/temp/api',
        method: 'GET',
        handler: apiGET
},
{
        path: '/temp/api',
        method: 'POST',
        handler: apiPOST
}];


//think these might be handlers
//not sure where to put this
var readingController = require('../controllers/readingController.js');
var readingObject = require('../objects/readingObject.js');
var controller = new readingController();

//get all readings
function apiGET(request, reply) {
	//reply('get');
	//console.log('get');
	controller.getAllReadings(function(readings){
		reply(readings);
	});
};

//post new reading
function apiPOST(request, reply) {
	var reading = new readingObject(
		null,
		request.payload.temp,
		request.payload.name,
		null,
		request.payload.key,
		request.payload.timestamp,
		null);

	//console.log(reading);
	controller.authenticateReader(reading,function(verifiedReading){controller.newReading(verifiedReading)});
	
	reply(reading);
//	console.log(reading);
};

//get current temps
function getCurrent(request, reply) {

	//reply('get');
        //console.log('get');
        controller.getCurrentReadings(function(readings){
                reply(readings);
        });
};



//export routes
module.exports = Routes;



