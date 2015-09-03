// Constructor
function Reading(Id, Temperature, Name, SourceId, Key, ReadingDateTime, InsertDateTime){
	this.Id = Id;
	this.Temperature = Temperature;
	this.Name = Name;
	this.SourceId = SourceId;
	this.Key = Key;
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




