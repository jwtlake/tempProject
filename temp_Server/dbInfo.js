//Postgres DB Object
(function(dbInfo) {
	dbInfo.username = 'sa_user';
	dbInfo.password = 'da87bzZd';
	dbInfo.ip = 'localhost';
	dbInfo.db = 'temp_Project';
	
	//computed
	dbInfo.conString = 'postgres://'+dbInfo.username+':'+dbInfo.password+'@'+dbInfo.ip+'/'+dbInfo.db;
})(module.exports);
