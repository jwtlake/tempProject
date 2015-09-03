var pg = require('pg'); //postgres libary
var dbInfo = require('../dbInfo'); //private conection strings

var readingController = function() {
	this.conString = dbInfo.conString;
};

//save new reading
readingController.prototype.newReading = function(reading, callback) {
	
	var Temperature = reading.Temperature;
	var SourceId = reading.SourceId;
	var ReadingDateTime = reading.ReadingDateTime;

	var insertQuery = 'INSERT INTO Reading (Temperature,SourceId,ReadingDateTime) VALUES ('+Temperature+','+SourceId+',TIMESTAMP \''+ReadingDateTime+'\')';

	//debug
	//console.log(insertQuery);
	
	//connect
	pg.connect(this.conString, function(err, client, done) {
        	//check for error
		if(err) {
                	return callback(false,err);
			//console.error('error fetching client from pool', err);
        	} else {
			//insert
			client.query(insertQuery , function(err, result) {
				//call `done()` to release the client back to the pool
                        	done();
			
				//error catch
				if(err) {console.log('error running query: ' + err);}
				else {console.log('success');}
			});
		}
	});	
};

//get readings
readingController.prototype.getAllReadings = function(callback) {


        var selectQuery = 'SELECT ST.Type, S.Name, R.Temperature, R.ReadingDateTime, R.InsertDateTime FROM Reading AS R JOIN Source AS S ON S.Id = R.SourceId JOIN SourceType AS ST ON ST.Id = S.SourceTypeId ';

        //debug
        //console.log(selectQuery);

        //connect
        pg.connect(this.conString, function(err, client, done) {
                //check for error
                if(err) {
                        return callback(err);
                        //console.error('error fetching client from pool', err);
                } else {
                        //select
			var readings = [];
                        var query = client.query(selectQuery);
			query.on('row', function(row) {
				console.log(row);
				readings.push(row);
			});
			query.on('end', function() { 
				client.end();
				return callback(readings);
			});

                }
        });
};



// export
module.exports = readingController;
