var express = require('express');
var router = express.Router();
//const sqlite3 = require('sqlite3').verbose();
var apiconfig = require('../apiconfig');
const fs = require('fs')

var dbffile = require('dbffile')

//https://github.com/yortus/DBFFile

router.post('/ghistory', async function(req, res, next)  {
	var nametoSearch = req.body.name
	var mobiletoSearch = req.body.mobile
	var dbfileNm = req.body.dbfile
	var invalidParam = false
	var foundData = false
	var rtnData = {"Error": true, "info":"data not found"} ;

	
	if(!dbfileNm) {
		invalidParam = true
	}else {
		if(dbfileNm == ""  ) {
			invalidParam = true
		}else {
			if (fs.existsSync(dbfileNm)) {
//				console.log('Found file');
			}else {
				invalidParam = true
			}
		}  	
	} 

	if(!invalidParam) {
		if(mobiletoSearch.length >10) {
			mobiletoSearch = mobiletoSearch.substr(1)
		}
	
		let {DBFFile} = dbffile;
	
	//	var dbfileNm = apiconfig.apppath + '/dbf/GHIS2021.DBF'
	
		let dbf = await DBFFile.open(dbfileNm)
		
		let records = await dbf.readRecords(dbf.recordCount);
		for (let record of records) {
			if (record.GH_TEL.toLowerCase().indexOf(mobiletoSearch) != -1){
				var namefromData = record.GH_FNAME + record.GH_SNAME + record.GH_TNAME
				if (namefromData.toLowerCase().indexOf(nametoSearch.toLowerCase()) != -1){
					foundData = true
					rtnData = {"GH_CO" : record.GH_CO,
					"NAME" : record.GH_FNAME + " " + record.GH_SNAME + " " + record.GH_TNAME,
					"ADD1" : record.GH_ADD1,
					"ADD2" : record.GH_ADD2,
					"CITY" : record.GH_CITY,
					"PIN" : record.GH_PIN,
					"COUNTRY" : record.GH_COUNTRY,
					"RES_TYPE" : record.GH_TYPE,
					"NATIONALITY" : record.GH_NATION
					}
					break	
				}	
			}		
		}	
		if(foundData) {
			res.json({"Error": false, "data" : rtnData})
		} else {
			res.json(rtnData)
		}
	}else {
		res.json({"Error": true, "Info" :"Invalid or no file name provided"})
	} 
});


router.post('/searchbooking', async function(req, res, next)  {
	var nametoSearch = req.body.name
	var mobiletoSearch = req.body.mobile
	var HotByteRef = req.body.bookingRefHotByte
	var ThirdPartyRef = req.body.bookingRefThirdParty
	var dbfileNm = req.body.dbfile

	var invalidParam = false
	var foundData = false
	var rtnData = {"Error": true, "info":"data not found", GuestList : []} ;

	if(!dbfileNm) {
		invalidParam = true
	}else {
		if(dbfileNm == ""  ) {
			invalidParam = true
		}else {
			if (fs.existsSync(dbfileNm)) {
			}else {
				invalidParam = true
			}
		}  	
	} 

	if(!invalidParam) {
		if(mobiletoSearch.length >10) {
			mobiletoSearch = mobiletoSearch.substr(1)
		}
	
		let {DBFFile} = dbffile;
		let dbf = await DBFFile.open(dbfileNm)
		
	//    console.log(`DBF file contains ${dbf.recordCount} records.`);
	//    console.log(`Field names: ${dbf.fields.map(f => f.name).join(', ')}`);
		let records = await dbf.readRecords(dbf.recordCount);
		for (let record of records) {
			if(record.BK_FOLIO == HotByteRef ) {
				foundData = true
				var gData = {
					hotbyteFolio : record.BK_FOLIO,
					bookingDate : record.BK_BOOK_DT,
					gTitle : record.BK_MR,
					gFName : record.BK_FNAME,
					gSName : record.BK_SNAME,
					gTName : record.BK_TNAME,
					gmobile : '',
					Add1 : record.BK_ADD1,
					Add2 : record.BK_ADD2,
					City : record.BK_CITY,
					Pin : record.BK_PIN,
					remark : record.BK_REMARKS,
					RoomNo : record.BK_NO_ROOM
				}
				rtnData.GuestList.push(gData)
			}
		}	


		if(foundData) {
			res.json({"Error": false, "data" : rtnData})
		} else {
			res.json(rtnData)
		}
	}else {
		res.json({"Error": true, "Info" :"Invalid or no file name provided"})
	} 
	
});


router.post('/updateCheckin', async function(req, res, next)  {
	//var dbfileNm = req.body.dbfile
	var currentUser = req.body.user
	var checkinData = req.body.data
	var invalidParam = false
//	var foundData = false
//	var rtnData = {"Error": true, "info":"data not found"} ;
	var errorInfo = ""
	var dbfileNm = 'C:/guestcheckin/api/dbf/CLGUEST.DBF'

	let fieldDescriptors = [
		{ name: 'GS_CHKID', type: 'N', size: 5, decimalPlaces:0 },
		{ name: 'GS_GNUM', type: 'N', size: 5, decimalPlaces:0 },
		{ name: 'GS_FOLIO', type: 'N', size: 5, decimalPlaces:0 },
		{ name: 'GS_ROOM', type: 'N', size: 4, decimalPlaces:0 },
		{ name: 'GS_ROOM_CT', type: 'C', size: 4 },
		{ name: 'GS_REGSCAT', type: 'C', size: 4 },
		{ name: 'GS_TYPE', type: 'C', size: 1 },
		{ name: 'GS_MR', type: 'C', size: 4 },
		{ name: 'GS_FNAME', type: 'C', size: 20 },
		{ name: 'GS_SNAME', type: 'C', size: 20 },
		{ name: 'GS_TNAME', type: 'C', size: 20 },
		{ name: 'GS_TITLE', type: 'C', size: 10 },
		{ name: 'GS_AR_DT', type: 'D', size: 8 },
		{ name: 'GS_BLL_DT', type: 'D', size: 8 },
		{ name: 'GS_AR_HR', type: 'N', size: 2, decimalPlaces:0 },
		{ name: 'GS_AR_MN', type: 'N', size: 2, decimalPlaces:0 },
		{ name: 'GS_DAYS', type: 'N', size: 3, decimalPlaces:0 },
		{ name: 'GS_PAX_AD', type: 'N', size: 2, decimalPlaces:0 },
		{ name: 'GS_DURAT', type: 'N', size: 3, decimalPlaces:0 },
		{ name: 'GS_NATION', type: 'C', size: 15 },
		{ name: 'GS_DEP_DT', type: 'D', size: 8 },
		{ name: 'GS_TEL', type: 'C', size: 15 },
		{ name: 'GS_USER', type: 'C', size: 20 },
		{ name: 'GS_CHKOUT', type: 'C', size: 1 },
		{ name: 'GS_BRTH_DT', type: 'D', size: 8 },
		{ name: 'GS_MOB', type: 'C', size: 15 },
		{ name: 'GS_EMAIL', type: 'C', size: 50 },
		{ name: 'GS_ADD1', type: 'C', size: 30 },
		{ name: 'GS_ADD2', type: 'C', size: 30 },
		{ name: 'GS_CITY', type: 'C', size: 30 },
		{ name: 'GS_COUNTRY', type: 'C', size: 20 },
		{ name: 'GS_PIN', type: 'C', size: 10 },
		{ name: 'GS_PRF1', type: 'C', size: 30 },
		{ name: 'GS_PRF2', type: 'C', size: 30 },
		{ name: 'GS_ID1', type: 'C', size: 30 },
		{ name: 'GS_ID2', type: 'C', size: 30 },
		{ name: 'GS_FILE1', type: 'C', size: 50 },
		{ name: 'GS_FILE2', type: 'C', size: 50 },
		{ name: 'GS_SFILE', type: 'C', size: 50 },
		{ name: 'GS_READ', type: 'N', size: 1, decimalPlaces:0 }
	];

	let {DBFFile} = dbffile;	
	let dbf ;

	if(!dbfileNm) {
		invalidParam = true
	}else {
		if(dbfileNm == ""  ) {
			invalidParam = true
			errorInfo = "Invalid or no file name provided"
		}else {
			invalidParam = false
			if (fs.existsSync(dbfileNm)) {
				try{
					dbf = await DBFFile.open(dbfileNm)
				}
				catch(err){
					invalidParam = true
					errorInfo = err
				}
			}else {
				dbf = await DBFFile.create(dbfileNm, fieldDescriptors);
			}
		}  	
	} 

	if(!invalidParam) {
		let records = [];
		let grecord = {};

		var namearry = checkinData.name.split(" ");

//		var tName = namearry.length > 0

		 grecord =
			{ GS_CHKID : checkinData.checkin_id,
			GS_GNUM : checkinData.Guest_num,
			GS_FOLIO: 0, 
			GS_ROOM: 0,
			GS_ROOM_CT: 'RSTD',
			GS_REGSCAT: 'WALK',
			GS_TYPE: 'L',
			GS_MR: 'MR',
			GS_FNAME: namearry[0],
			GS_SNAME: namearry[1],
			GS_TNAME: namearry[2],
			GS_TITLE: 'XXX',
			GS_AR_DT: new Date(checkinData.Date),
			GS_BLL_DT: new Date(checkinData.Date),
			GS_AR_HR: 1,
			GS_AR_MN: 20,
			GS_DAYS: 0,
			GS_PAX_AD: 1,
			GS_DURAT: 0,
			GS_NATION: checkinData.NATIONALITY,
			GS_DEP_DT: new Date(checkinData.Date),
			GS_TEL: checkinData.mobile_no,
			GS_USER: currentUser,
			GS_CHKOUT: 'C',
			GS_BRTH_DT: new Date('2020-04-01'),
			GS_MOB: checkinData.mobile_no,
			GS_EMAIL: checkinData.email,
			GS_ADD1: checkinData.address1,
			GS_ADD2: checkinData.address2 + checkinData.address3 ,
			GS_CITY	: checkinData.city,
			GS_COUNTRY : checkinData.country,
			GS_PIN : checkinData.pin ,
			GS_PRF1 : checkinData.proof1_type ,
			GS_PRF2 : checkinData.proof2_type,
			GS_ID1 : checkinData.proof1_Number ,
			GS_ID2 : checkinData.proof2_Number,
			GS_FILE1 : " ",
			GS_FILE2 : " ",
			GS_SFILE : " ",
			GS_READ: 0 }
			
			records.push(grecord)
			var info = "Data updated in file"
			var error1 = false
			try{
				await dbf.appendRecords(records);
			}
			catch(Error){
				info = (Error.code == 'EBUSY' ? 'DBF file busy or locked' : 'Error while writting to DBF' )
				error1 = true
			} 
			console.log(error1)
			res.json({"Error": error1, "message" :info})
//    		console.log(`${records.length} records added.`);				
	}else {
		res.json({"Error": true, "message" :errorInfo})
	} 	
});

//========================================================================================
// Hotel Menu items
//=======================================================================================
router.get('/menucat', async function(req, res, next)  {
	var dbfileNm = "C:/guestcheckin/api/dbf/CATEGORY.DBF"
	var invalidParam = false

	
	if(!dbfileNm) {
		invalidParam = true
	}else {
		if(dbfileNm == ""  ) {
			invalidParam = true
		}else {
			if (fs.existsSync(dbfileNm)) {
			}else {
				invalidParam = true
			}
		}  	
	} 

	if(!invalidParam) {
	
		let {DBFFile} = dbffile;
		let dbf = await DBFFile.open(dbfileNm)		
		let records = await dbf.readRecords(dbf.recordCount);

		var categoryList =[]

		for (let record of records) {
			var rec = {
				LOCATIONCODE: 'ALL',
				CATEGORYCODE: record.CATEG_CD, 
				CATEGORYNAME: record.CATEG_NM
			}
			categoryList.push(rec)
		}	
		res.json({"Error": false, "data" : categoryList})
	}else {
		res.json({"Error": true, "Info" :"Invalid or no file name provided"})
	} 
});



router.get('/menulist', async function(req, res, next)  {
	var dbfileNm = "C:/guestcheckin/api/dbf/MENUMAST.DBF"
	var catdbfileNm = "C:/guestcheckin/api/dbf/CATEGORY.DBF"

	var invalidParam = false

	if(!dbfileNm) {
		invalidParam = true
	}else {
		if(dbfileNm == ""  ) {
			invalidParam = true
		}else {
			if (fs.existsSync(dbfileNm)) {
			}else {
				invalidParam = true
			}
		}  	
	} 

	if(!invalidParam) {		
		let {DBFFile} = dbffile;
		let dbf2 = await DBFFile.open(catdbfileNm)		
		let catData = await dbf2.readRecords(dbf2.recordCount);
		
//		let {DBFFile} = dbffile;
		let dbf = await DBFFile.open(dbfileNm)		
		let records = await dbf.readRecords(dbf.recordCount);

		var menuList =[]

		for (let record of records) {
			let srchCat = catData.find(o => o.CATEG_CD === record.MENU_ITEM);

			var rec = {
				MENUID : record.MENU_CODE ,
				MENUITEMNAME : record.MENU_DESC ,
				RATE : record.RATE ,
				VEGITEM : true,
				categoryID : record.MENU_ITEM,
				CATEGORYNAME : srchCat.CATEG_NM,
				QTY : 0,
				img : '/food/idli/idliSambhar_1.jpg' ,
				selected : false
			}
			menuList.push(rec)
		}	
		res.json({"Error": false, "data" : menuList})
	}else {
		res.json({"Error": true, "Info" :"Invalid or no file name provided"})
	} 
});





/*
const Accessor = require('dbf-js');
//https://www.npmjs.com/package/dbf-js

router.post('/ghistory', async function(req, res, next)  {
	console.log(req.body)
	var nametoSearch = req.body.name
	var mobiletoSearch = req.body.mobile

	var dbfileNm = apiconfig.apppath + '/dbf/GHIS2021.DBF'

	let {header, data} = Accessor.read(dbfileNm);
	var rtnData = {"Error": true, "info":"data not found"} ;

	var tempData = JSON.stringify(data)
	
tempData = tempData.replace(/\0/g, "");

//	 tempData = tempData.replace(/\u0000E/g, "");
//	 tempData = tempData.replace(/\u0000DT/g, "");

//	tempData = tempData.replace(/\u0001/g, '');
//	 tempData = tempData.replace(/\u0002/g, '');
//	 tempData = tempData.replace(/\u0003/g, '');
//	 tempData = tempData.replace(/\u0000/g, "");


console.log(tempData)

	var tmpJson = JSON.parse(tempData) 
	console.log(tmpJson)

	for (let k = 0; k < data.length; k++) { 
		console.log(data[k].GH_TEL)
		if (data[k].GH_TEL == mobiletoSearch) {
			
			rtnData = data[k]
			break
		} 
	}

	res.json({"data" : tempData})

});

*/



module.exports = router;


