//API Wrapper for Local USB Temp Sensor

var util = require('util');
var exec = require('child_process').exec;
var child;

// unix command for sensor
var unixCommand = '../usb-thermometer-master/pcsensor';

// constructor
var tempSensor = function() {};

// read temp sesnor
tempSensor.prototype.getReading = function(callback) {
	
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

		//format usb result
		format(reading, function(reading_F) {
			//return f temp value
			return callback(reading_F); 
		});	
	});
};

// format temp sensor output 
var format = function(reading, callback) {
	
	//split into array
	reading = reading.trim(); // remove character return
	var array = reading.split(' '); // split by space characters

	//console.log(array);
		
	//result vales
	var date = array[0]; // 2015/07/26
	var time = array[1]; // 10:55:08
	var type = array[2]; // Temperature
	var reading_F = array[3]; // 78.69F
	var reading_C = array[4]; // 25.94C
	
	//remove temp character
	reading_F  = reading_F.substring(0, reading_F.length - 1);
	reading_C  = reading_C.substring(0, reading_C.length - 1);
	
	//return
	callback(reading_F);
}; 

// export constructor
module.exports = tempSensor;
