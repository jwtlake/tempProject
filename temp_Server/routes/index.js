//routes
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
        handler: function (request, reply){
                reply('current temp.');
                console.log('current temp');
        }
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


//export routes
module.exports = Routes;



