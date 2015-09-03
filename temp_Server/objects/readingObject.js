// Constructor
function Reading(Id, Temperature, SourceId, ReadingDateTime, InsertDateTime){
	this.Id = Id;
	this.Temperature = Temperature;
	this.SourceId = SourceId;
	this.ReadingDateTime  = ReadingDateTime;
	this.InsertDateTime = InsertDateTime;
};

// 
Reading.prototype.set = function() {

};

//
Reading.prototype.get = function() {

};

// export
module.exports = Reading;




