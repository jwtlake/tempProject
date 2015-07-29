var Hapi = require('hapi');  //framework
var pg = require('pg'); //postgres libary

var dbInfo = require('./dbInfo'); //private conection screens

//create new server object
var server = new Hapi.Server();
server.connection({ port: 3000});

console.log('Connecting to db');

//connect to postgres server
var query = 'select s.name, st.type from source as s join sourcetype as st on s.sourcetypeid = st.id;';

pg.connect(dbInfo.conString, function(err, client, done) {
	if(err) {
		return console.error('error fetching client from pool', err);
	}
	
	client.query(query, function(err, result) {
		//call `done()` to release the client back to the pool
		done();

		if(err) {
			return console.error('error running query', err);
		}
		console.log(result.rows[0]);
    		//output: 1
	});
});

//route for displaying current temp
server.route({
	path: '/temp/current',
	method: ['GET','POST']
	handler: function(request, reply) {
		if(request.method === 'get') {
			reply('Its Hot');
		} else {
			reply.redirect('/');
		}
	}
});

//look for onRequest event, call back function
server.ext('onRequest', function(request, reply) {
	console.log('Request received: ' + request.path);
	reply.continue(); //continue request life cycle
});

//start server
server.start(function() {
	console.log('Listening in ' + server.info.uri);
});
