var tempSensorAPI = require('./temp_API.js');

console.log('Reading TEMP Sensor');
var tempSensor = new tempSensorAPI();
tempSensor.read(null,function (err, reading) {
	console.log('test');
});


console.log(tempSensor.read());


//console.log('reading: ' + reading);
