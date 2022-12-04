var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
var apiconfig = require('../apiconfig');
var AVSLIB = require('../AVSLib')
const Authenticate = require('../ValidateToken')
var dbfile = apiconfig.apppath + apiconfig.sysdb

//=================================================================================
// Get details of one row from check in data
// the id consists of id and guest no separated by -
//=================================================================================
router.get('/searchbyid/:Id',  function(req, res, next)  {
	var arr = req.params.Id.split("-");
	var gId = arr[0]
	var gNo = arr[1]
	let db = new sqlite3.Database( dbfile, sqlite3.OPEN_READWRITE, function(err)  {
		if (err) {
			res.json(err.message) ; 
		} 
			db.all("SELECT * FROM GUEST_CHECKIN_DATA WHERE CHECKIN_ID = ? AND GUEST_NUM = ? ", [ gId, gNo ], function(err, rows)  {
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
// Create new check in entry in Guest book
//=====================================================================
 router.post('/register', async  function(req, res){
	//This will create new entry in following tables
	// guest_checkin       -- The Master Table
	// guest_checkin_data  -- The detailed checking data
	// guest master -- The guest basic data for future reference
	// 
	// And then will update dbf files 

	var gbID = 0 // req.body.GUEST_ID;
	var checkinDate = new Date()
	var gbDate = AVSLIB.formatDate(checkinDate);
	var gbTime = checkinDate.toLocaleTimeString();
	var gData = req.body

	var fieldList1 = ['CHECKIN_ID', 'MAIN_GUEST_NAME', 'NO_OF_GUEST']
	var fieldList2 = ['CHECKIN_ID', 'GUEST_NUM', 'DATE', 'TIME', 'NAME', 'MOBILE_NO', 'EMAIL', 'NATIONALITY', 'ADDRESS1', 'ADDRESS2', 'ADDRESS3', 'CITY', 'STATE', 'COUNTRY', 'PIN', 'PROOF1_TYPE', 'PROOF1_NUMBER' , 'PROOF2_TYPE', 'PROOF2_NUMBER', 'PROOF1_FILEPATH', 'PROOF2_FILEPATH', 'SIGN_FILEPATH']

	let db = new sqlite3.Database( dbfile, sqlite3.OPEN_READWRITE, function(err) {
		if (err) {
				res.status(500).json({"message" : err.message, "error" : "Yes"});
		} else {
			db.get('SELECT (CASE when MAX(CHECKIN_ID) IS NULL THEN 0 else MAX(CHECKIN_ID) end ) + 1 AS CHKIN_ID FROM guest_checkin', [ ] , function(err, row) {
				if (row) {
					gbID = row.CHKIN_ID;
					var sqlstmt1 =AVSLIB.getSQLSTMT("INSERT", "guest_checkin",  fieldList1 )
//					var sqlstmt1 = "INSERT INTO guest_checkin (CHECKIN_ID, MAIN_GUEST_NAME, NO_OF_GUEST) VALUES ( ?, ?, ? )" ;
					db.run(sqlstmt1, [gbID, gData.name, gData.noofguests ], function(err, row){
						if (err){
							db.close();
							res.status(202).json({"message" : "Database Error!", "error" : true});
						} else {
							var sqlstmt2 =AVSLIB.getSQLSTMT("INSERT", "guest_checkin_data",  fieldList2 )
//							var sqlstmt2 = "INSERT INTO guest_checkin_data (CHECKIN_ID, GUEST_NUM, DATE, TIME, NAME, MOBILE_NO, EMAIL, ADDRESS1, ADDRESS2, ADDRESS3, CITY, STATE, COUNTRY, PIN, PROOF1_TYPE, PROOF1_NUMBER , PROOF2_TYPE, PROOF2_NUMBER, PROOF1_FILEPATH, PROOF2_FILEPATH, SIGN_FILEPATH  ) VALUES ( ?, ?, ? )" ;
//							console.log(sqlstmt2)	
							db.serialize( async function() {
								var isError =false; 
								 for(var i=0; i < gData.guestlist.length; i++){
									try {
										const result = await db.run(sqlstmt2, [ gbID,  i, gbDate, gbTime,
											gData.guestlist[i].name,
											gData.guestlist[i].mobile,
											gData.guestlist[i].email,
											gData.guestlist[i].nationality,
											gData.guestlist[i].add1,
											gData.guestlist[i].add2,
											gData.guestlist[i].add3,
											gData.guestlist[i].city,
											gData.guestlist[i].state,
											gData.guestlist[i].country,
											gData.guestlist[i].pin,
											gData.guestlist[i].proof1type,
											gData.guestlist[i].proof1id,
											gData.guestlist[i].proof2type,
											gData.guestlist[i].proof2id,
											gData.guestlist[i].serverfile1,
											gData.guestlist[i].serverfile2,
											gData.guestlist[i].signfile  ] ) 	
									} catch(error) {
										isError = (error ? true : false );
									}
								}
								if (isError) {
									db.close();
									res.status(202).json({"message" : "Database Error!", "error" : true});
								} else {
									db.close();
									res.status(202).json({"message" : 'Guest Added successfully!', "error" : false});
								}
							});
						}
					});
				}
			});
		}	
	});
});



//=====================================================================
// update the changes in  check in entry in Guest book
//=====================================================================
router.post('/update', async  function(req, res){
	//This will create new entry in following tables
	// guest_checkin       -- The Master Table
	// guest_checkin_data  -- The detailed checking data
	// guest master -- The guest basic data for future reference
	// 
	// And then will update dbf files 


	var gData = req.body

//	console.log(gData)

	var gbID =  gData.checkin_id;
	var gbNum =  gData.Guest_num ;

	var checkinDate = new Date(gData.Date)
	var gbDate = AVSLIB.formatDate(checkinDate);
//	var gbTime = gData.Time.toLocaleTimeString();


//	var fieldList1 = ['CHECKIN_ID', 'MAIN_GUEST_NAME', 'NO_OF_GUEST']
	var fieldList2 = ['CHECKIN_ID', 'GUEST_NUM', 'DATE', 'TIME', 'NAME', 'MOBILE_NO', 'EMAIL', 'NATIONALITY_TYPE', 'NATIONALITY', 'ADDRESS1', 'ADDRESS2', 'ADDRESS3', 'CITY', 'STATE', 'COUNTRY', 'PIN', 'PROOF1_TYPE', 'PROOF1_NUMBER' , 'PROOF2_TYPE', 'PROOF2_NUMBER', 'PROOF1_FILEPATH', 'PROOF2_FILEPATH', 'SIGN_FILEPATH', 'VERIFIED']

	let db = new sqlite3.Database( dbfile, sqlite3.OPEN_READWRITE, function(err) {
		if (err) {
				res.status(500).json({"message" : err.message, "error" : "Yes"});
		} else {
			var sqlstmt1 =AVSLIB.getSQLSTMT("UPDATE", "guest_checkin_data" ,  fieldList2, " CHECKIN_ID = ? AND GUEST_NUM = ?" )
			db.run(sqlstmt1, [gbID,  gbNum, gbDate, gData.Time, gData.name, gData.mobile, gData.email, gData.nationality_type, 
				gData.nationality, gData.address1, gData.address2, gData.address3, gData.city, gData.state, gData.country, gData.pin,
				gData.proof1_type, gData.proof1_Number, gData.proof2_type, gData.proof2_Number, gData.proof1_filepath,
				gData.proof2_filepath, gData.sign_filepath, gData.verified, gbID,  gbNum ], function(err, row){
					if (err){
						db.close();
						res.status(202).json({"message" : "Database Error!", "error" : true});
					} else {
						db.close();
						res.status(202).json({"message" : 'Guest Updated successfully!', "error" : false});
					}	
			});			
		}	
	});
});



//=================================================================================
// Get details of all unVerified check-ins in guest book
//=================================================================================
router.get('/unverified',  function(req, res, next)  {
	let db = new sqlite3.Database( dbfile, sqlite3.OPEN_READWRITE, function(err)  {
		if (err) {
			res.json(err.message) ; 
		} 
			db.all("SELECT * FROM GUEST_CHECKIN_DATA WHERE VERIFIED IS NULL OR VERIFIED <> 1 ORDER BY CHECKIN_ID, GUEST_NUM", [  ], function(err, rows)  {
				if (err) {
					res.status(200).json(err.message);
				} else {
					res.status(200).json(rows);	
				}
			});
		});
	db.close();
});



//=================================================================================
// Get details of one row from check in data
// the id consists of id and guest no separated by -
//=================================================================================
router.post('/delete/:Id', function(req, res, next)  {
	var arr = req.params.Id.split("-");
	var gId = arr[0]
	var gNo = arr[1]
	
	let db = new sqlite3.Database( dbfile, sqlite3.OPEN_READWRITE, function(err)  {
		if (err) {
			db.close()
			res.status(202).json({"message" : err.message, "error" : "Yes"})
		} else { 
			var sqlstmt = "SELECT NAME FROM GUEST_CHECKIN_DATA WHERE CHECKIN_ID = ? AND GUEST_NUM = ? AND (VERIFIED IS NULL OR VERIFIED <> 1)" ;
			db.get(sqlstmt, [ gId, gNo  ] , function(err, rowdata){
				if (!rowdata) {
					db.close();
					res.status(202).json({"message" : "Cannot delete Guest" , "error" : "Yes"})
				} else {
					var guestNm = rowdata.NAME
					var sqlstmt = "DELETE FROM GUEST_CHECKIN_DATA WHERE CHECKIN_ID = ? AND GUEST_NUM = ? " 
					db.run(sqlstmt, [ gId, gNo] , function(err, row){
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



//=====================================================================
// Update the checkin Data
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



//=================================================================================
// Get details of Proof Types
//=================================================================================
router.get('/prooftypes',  function(req, res, next)  {
	let db = new sqlite3.Database( dbfile, sqlite3.OPEN_READWRITE, function(err)  {
		if (err) {
			res.json(err.message) ; 
		} 
			db.all("SELECT * FROM PROOF_TYPES", [  ], function(err, rows)  {
				if (err) {
					res.status(200).json(err.message);
				} else {
					res.status(200).json(rows);	
				}
			});
		});
	db.close();
});


//=================================================================================
// Get details of Countries
//=================================================================================
router.get('/countries',  function(req, res, next)  {
	let db = new sqlite3.Database( dbfile, sqlite3.OPEN_READWRITE, function(err)  {
		if (err) {
			res.json(err.message) ; 
		} 
			db.all("SELECT name, COUNTRY AS abbr,  NATIONALITY FROM COUNTRIES", [  ], function(err, rows)  {
				if (err) {
					res.status(200).json(err.message);
				} else {
					res.status(200).json(rows);	
				}
			});
		});
	db.close();
});

router.get('/nationalities',  function(req, res, next)  {
	let db = new sqlite3.Database( dbfile, sqlite3.OPEN_READWRITE, function(err)  {
		if (err) {
			res.json(err.message) ; 
		} 
			db.all("SELECT NATIONALITY as name, COUNTRY AS abbr FROM COUNTRIES", [  ], function(err, rows)  {
				if (err) {
					res.status(200).json(err.message);
				} else {
					res.status(200).json(rows);	
				}
			});
		});
	db.close();
});




module.exports = router;


