//=====================================================================
//Some of the common functions
//=====================================================================

var mylib =  {};

//=====================================================================
//Private functions
//=====================================================================
function pad (num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}


//=====================================================================
//Public functions
//=====================================================================

mylib.formatDate = function formatDate(mdate) {
  var monthIndex = mdate.getMonth();
  var year = mdate.getFullYear();
  var day = mdate.getDate();
  return year + '-' + pad(monthIndex + 1, 2) + '-' + pad(day, 2);
}


mylib.getFinYear = function getFinYear(mdate) {
  var monthIndex = mdate.getMonth() + 1;
  var year = mdate.getFullYear();

  if(monthIndex <= 3) {
     var year1 = (year - 1)
     var year2 = year
  } else {
     var year1 = year 
     var year2 = year + 1
  }
   var strYear1 = year1.toString();
   var strYear2 = year2.toString();
   return strYear1 + '-' + strYear2.substring(2);
}



mylib.isValidDate = function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

mylib.getSQLSTMT = function getFinYear( stmtType, tblname, fieldList, whereClause ="") {
  var rtnVal = ""

  if(stmtType === "INSERT") {
    rtnVal = "INSERT INTO " + tblname + " ("
    var i;
    for (i = 0; i < fieldList.length; i++) {
      rtnVal += fieldList[i] + ((i === fieldList.length-1) ? ") VALUES (" : ",");
    }
    for (i = 0; i < fieldList.length; i++) {
      rtnVal += " ? " + ((i === fieldList.length-1) ? ")" : ",");
    }
  } 

  if(stmtType === "UPDATE") {
    rtnVal = "UPDATE " + tblname + " SET "
    var i;
    for (i = 0; i < fieldList.length; i++) {
      rtnVal += fieldList[i] + ((i === fieldList.length-1) ? " = ? " : " = ? , ");
    }
    if( whereClause != "") {
      rtnVal += " WHERE " 
      rtnVal +=  whereClause
    }
  } 


  
  if(stmtType === "SELECT") {
    rtnVal = "SELECT "
    var i;
    for (i = 0; i < fieldList.length; i++) {
      rtnVal += fieldList[i] + ((i === fieldList.length-1) ? " FROM " : ",");
    }
    rtnVal += tblname 
    if( whereClause != "") {
      rtnVal += " WHERE " 
      rtnVal +=  whereClause
    }
    //group by ?
    // if field list contains MAX, AVG, SUM etc then automatically add group by
  } 

  return rtnVal
}

// if JSON keys are consists of actual field names in db then use this function to insert data
mylib.insertFromJSON = function getFinYear( tblname, JSONData ) {

}


module.exports = mylib;

