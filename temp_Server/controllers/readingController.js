var pg = require('pg'); //postgres libary
var dbInfo = require('../dbInfo'); //private conection strings

var readingController = function() {
	this.conString = dbInfo.conString;
};

// save new reading
readingController.prototype.newReading = function(verifiedReading, callback) {
	
	var Temperature = verifiedReading.Temperature;
	var SourceId = verifiedReading.SourceId;
	var ReadingDateTime = verifiedReading.ReadingDateTime;

	var insertQuery = 'INSERT INTO Reading (Temperature, SourceId, ReadingDateTime) VALUES ('+Temperature+','+SourceId+',TIMESTAMP \''+ReadingDateTime+'\')';

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
				else {
					console.log(verifiedReading.Name + ' ' + verifiedReading.Temperature + 'F');
				}
			});
		}
	});	
};


// authenticate reader
readingController.prototype.authenticateReader = function(reading,callback) {

	//console.log('authenticating.. [Name: ' + reading.Name + ' -- Key: ' + reading.Key + ']');
    
    var sourceAuthQuery = 'SELECT S.Id, S.Name, S.ApiKey FROM Source AS S WHERE S.Name = \'' + reading.Name + '\';';

    //debug
    //console.log(sourceAuthQuery);

    //connect
    pg.connect(this.conString, function(err, client, done) {
            
        //check for error
        if(err) {
                //return callback(err);
                console.error('error fetching client from pool', err);
        }else{
			
			client.query(sourceAuthQuery, function(err, result) {
				//call `done()` to release the client back to the pool
				done();

				//error catch
				if(err){ console.log('error running query: ' + err); 
				}else{

					//console.log('Result for ' + result.rows[0].name + ' ['+ result.rows[0].id + ']');

                   	var sourceid = result.rows[0].id;			
                   	if(sourceid) {                   		

                   		//console.log('authenticated!');

                   		var verifiedReading = reading;
                   		verifiedReading.SourceId = sourceid;

                   		//console.log(verifiedReading);

                   		return callback(verifiedReading);
                   	}
                }
			});
            //console.log(result.rows[0].number);         
        }
    });
};


// get readings
readingController.prototype.getAllReadings = function(callback) {


        var selectQuery = 'SELECT ST.Type, S.Name, R.Temperature, R.ReadingDateTime, R.InsertDateTime FROM Reading AS R JOIN Source AS S ON S.Id = R.SourceId JOIN SourceType AS ST ON ST.Id = S.SourceTypeId ORDER BY R.ReadingDateTime DESC';

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
				//console.log(row);
				readings.push(row);
			});
			query.on('end', function() { 
				client.end();
				return callback(readings);
			});

                }
        });
};

// get current readings
readingController.prototype.getCurrentReadings = function(callback) {
	
	var selectCurrentQuery = 'SELECT DISTINCT ON (S.Id) S.Name,ST.Type,R.Temperature,R.ReadingDateTime FROM Reading AS R JOIN Source AS S ON S.Id = R.SourceId JOIN SourceType AS ST ON ST.Id = S.SourceTypeId ORDER BY S.Id, R.ReadingDateTime DESC;';

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
                        var query = client.query(selectCurrentQuery);
                        query.on('row', function(row) {
                                //console.log(row);
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
