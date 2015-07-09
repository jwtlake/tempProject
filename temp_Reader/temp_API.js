//API Wrapper for Local USB Temp Sensor

var util = require('util');
var exec = require('child_process').exec;
var child;

// unix command for sensor
var unixCommand = '../usb-thermometer-master/pcsensor';

// constructor
var tempSensor = function() {};

// read temp sesnor
tempSensor.prototype.read = function(reading) {
	
	//var reading;
	child = exec(unixCommand, function (error, stdout, stderr) {
		var reading;
		//sys.print('stdout: ' + stdout);
        	//sys.print('stderr: ' + stderr);
        	if (error !== null) {
                	reading = 'exec error: ' + error;
        	} else {
                	reading = stdout;
		}
		//console.log('debug: ' + reading);
		return reading;
	});
	//return reading;
};

// export constructor
module.exports = tempSensor;
