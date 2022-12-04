var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
var apiconfig = require('../apiconfig');
var AVSLIB = require('../AVSLib')
const Authenticate = require('../ValidateToken')

var dbfile = apiconfig.apppath + apiconfig.sysdb

//=================================================================================
// Get details of one row in guest book
//=================================================================================
router.get('/searchbyid/:Id',  function(req, res, next)  {
	let db = new sqlite3.Database( dbfile, sqlite3.OPEN_READWRITE, function(err)  {
		if (err) {
			res.json(err.message) ; 
		} 
			db.all("SELECT * FROM GUEST_BOOK WHERE BOOK_ID = ? ", [ req.params.Id ], function(err, rows)  {
				if (err) {
					res.status(200).json(err.message);
				} else {
					res.status(500).json(rows[0]);	
				}
			});
		});
	db.close();
});
	


//=====================================================================
// Update the Guest
//=====================================================================
router.post('/update',  function(req, res){
	var gID = req.body.GUEST_ID;
	var gName = req.body.NAME;
	var gMobile  = ((typeof req.body.MOBILENO === "undefined") ? "" : req.body.MOBILENO);
	var gAdd1 = ((typeof req.body.ADDRESS1 === "undefined") ? "" : req.body.ADDRESS1);
	var gAdd2 = ((typeof req.body.ADDRESS2 === "undefined") ? "" : req.body.ADDRESS2);
	var gAdd3 = ((typeof req.body.ADDRESS3 === "undefined") ? "" : req.body.ADDRESS3);
	var gAdd4 = ((typeof req.body.ADDRESS4 === "undefined") ? "" : req.body.ADDRESS4);

	var gCity = ((typeof req.body.CITY === "undefined") ? "" : req.body.CITY);
	var gState = ((typeof req.body.STATE === "undefined") ? "" : req.body.STATE);
	var gCountry = ((typeof req.body.COUNTRY === "undefined") ? "" : req.body.COUNTRY);
	var gPin = ((typeof req.body.PIN === "undefined") ? "" : req.body.PIN);

	var gPassport = ((typeof req.body.PASSPORTNO === "undefined") ? "" : req.body.PASSPORTNO);
	var gAadhar = ((typeof req.body.AADHARNO === "undefined") ? "" : req.body.AADHARNO);


	let db = new sqlite3.Database( dbfile, sqlite3.OPEN_READWRITE, function(err) {
		if (err) {
			res.status(500).json({"message" : err.message, "error" : "Yes"});
		} else {
			//Check if guest exists
			db.get('SELECT GUEST_ID FROM GUEST_MASTER WHERE GUEST_ID = ? ', [ gID ] , function(err, row) {
				if (!row) {
					db.close();
					res.status(500).json({"message" :"Guest does not exist!", "error" : "Yes"});
				} else {
					var sqlstmt = "UPDATE GUEST_MASTER SET NAME = ?, MOBILENO = ?, ADDRESS1 = ?, ADDRESS2 = ?, ADDRESS3 = ?, ADDRESS4 = ?, CITY = ?, STATE = ?, COUNTRY = ?, PIN =? , PASSPORTNO =?, AADHARNO =?  WHERE GUEST_ID = ?" ;
					db.run(sqlstmt, [ gName, gMobile, gAdd1, gAdd2, gAdd3, gAdd4, gCity,gState, gCountry, gPin, gPassport, gAadhar, gID ], function(err, row){
						if (err){
							db.close();
							res.status(202).json({"message" : "Database Error!", "error" : "Yes"});
						} else {
							db.close();
							res.status(202).json({"message" : 'Guest Updated successfully!', "error" : "No"});
						}
						res.end();
					});
				}
			});
		}
	});
});


//===============================================================
// Delete Guest
//================================================================
router.post('/delete/:Id', function(req, res, next)  {
	var gID = req.params.Id;
	
	let db = new sqlite3.Database( dbfile, sqlite3.OPEN_READWRITE, function(err)  {
		if (err) {
			db.close()
			res.status(202).json({"message" : err.message, "error" : "Yes"})
		} else { 
			var sqlstmt = "SELECT NAME FROM GUEST_MASTER WHERE GUEST_ID = ?" ;
			db.get(sqlstmt, [ gID ] , function(err, rowdata){
				if (!rowdata) {
					db.close();
					res.status(202).json({"message" : "Cannot delete Guest" , "error" : "Yes"})
				} else {
					var guestNm = rowdata.NAME
					var sqlstmt = "DELETE FROM GUEST_MASTER WHERE GUEST_ID = ?" ;
					db.run(sqlstmt, [ gID ] , function(err, row){
						if (err){
							db.close();
							res.status(202).json({"message" : err.message, "error" : "Yes"});
						} else {
							db.close();
							res.status(202).json({"message" : "Guest : '" + guestNm + "' deleted successfully !" , "error" : "No"});
						}
					});
				}
			});
		}
	});
});


module.exports = router;
