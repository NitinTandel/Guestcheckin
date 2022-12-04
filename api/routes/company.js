var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
var apiconfig = require('../apiconfig');
const Authenticate = require('../ValidateToken')
var AVSLIB = require('../AVSLib')


//=================================================================================
// Get list of all companies
//=================================================================================
router.get('/listall', function(req, res, next)  {
	var db = new sqlite3.Database( apiconfig.sysdb, sqlite3.OPEN_READWRITE, function(err)  {
	if (err) {
    	res.json(err.message) ; 
  	} 
   		db.all("SELECT CO_ID , CO_NAME, A.COUNTRY, B.NATIONALITY FROM COMPANY A, countries B WHERE A.country = B.Name", [], function(err, rows)  {
        	if (err) {
        		res.json(err.message);
        	} else {
        		res.json(rows[0]);	
        	}
    	});
	});
    db.close();
});


router.get('/config', Authenticate, function(req, res, next)  {
	var db = new sqlite3.Database( apiconfig.sysdb, sqlite3.OPEN_READWRITE, function(err)  {
	if (err) {
    	res.json(err.message) ; 
  	} 
   		db.all("SELECT * FROM COMPANY ", [], function(err, rows)  {
        	if (err) {
        		res.json(err.message);
        	} else {
        		res.json(rows[0]);	
        	}
    	});
	});
    db.close();
});


router.post('/updatecfg', Authenticate, function(req, res, next)  {
	var reqdata = req.body

//	console.log(reqdata)
	var fieldList = ['co_id', 'co_name', 'country', 'gcInt', 'uploadfolder', 'gcdbffolder', 'menuInt', 'menuImgFolder', 'menuDBFFoler' ]

	var db = new sqlite3.Database( apiconfig.sysdb, sqlite3.OPEN_READWRITE, function(err)  {
	if (err) {
		db.close();
    	res.json({"message" : err.message, "error" : true} ) ; 
  	} 
	  var sqlstmt1 =AVSLIB.getSQLSTMT("UPDATE", "COMPANY",  fieldList )
		db.run(sqlstmt1, [reqdata.co_id , reqdata.co_name, reqdata.country, reqdata.gcInt, reqdata.uploadfolder, 
			reqdata.gcdbffolder, reqdata.menuInt, reqdata.menuImgFolder, reqdata.menuDBFFoler ], function(err, row){
			if (err){
				db.close();
				res.status(202).json({"message" : "Database Error!", "error" : true});
			} else {
				db.close();
				res.status(202).json({"message" : 'Config updated successfully!', "error" : false});
			}
    	});
	});
    
});


module.exports = router;


