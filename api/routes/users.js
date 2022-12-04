var express = require('express');
var router = express.Router();
const jwt  =  require('jsonwebtoken');
const bcrypt  =  require('bcryptjs'); 

var apiconfig = require('../apiconfig')
const sqlite3 = require('sqlite3').verbose();
var dbfile = apiconfig.apppath + apiconfig.sysdb ;

const Authenticate = require('../ValidateToken')

const fs = require('fs')

var dbffile = require('dbffile')


router.post('/login', async (req, res) => {
	const userid = req.body.userid;
    const pwd  =  req.body.userPwd;
    //const source  =  req.body.source;

    const MY_SECRET_KEY = apiconfig.ServerConfig.secret ;
    const expiresIn  =  24  *  60  *  60;

    var source = 'dbf'

    if(userid == 'Admin') {
        source = 'SQL'
    }

    var dbfileNm = apiconfig.apppath + "/dbf/PASSWORD.DBF"

    let isValidInput = false ;
        if (!userid) {
            res.status(400).send({type: 'error', message: 'No userid provided'})
        } else {
            if(!pwd) {
                res.status(400).send({type: 'error', message: 'No password provided'})
            } else {
                isValidInput = true ;
            }
        }    
    
    if(isValidInput) {
        if(source == 'dbf') {			
            let dbpath = await getDBFilePath()
            dbfileNm = dbpath +  "/PASSWORD.DBF"
            if (fs.existsSync(dbfileNm)) {
            //				console.log('Found file');
                let {DBFFile} = dbffile;
                let dbf = await DBFFile.open(dbfileNm)
                let records = await dbf.readRecords(dbf.recordCount);
                var foundUser = false
                for (let record of records) {
                    if(record.USERNAME == userid ) {
                        if(record.PASS1 == pwd){
                            foundUser = true
                        } else {
                            if(record.PASS2 == pwd){
                                foundUser = true
                            } else {
                                if(record.PASS3 == pwd){
                                    foundUser = true
                                }    
                            }
                        }
                        break
                    }
                }
                if(foundUser) {
                    //var userDetail = { "userid":  userid , "username" : row.USER_NAME, "email" : row.USER_EMAIL, "role" : row.ROLE , "defaultco" : row.DEFAULT_CO , "defaultyr" : row.DEFAULT_YEAR  } ;
                    const  accessToken  =  jwt.sign( {"userid":  userid}, MY_SECRET_KEY, {
                        expiresIn:  expiresIn
                    });
                    res.status(200).send({type: 'success', message: 'Logged in Successfully !',  "token":  accessToken });
                } else {
                    res.status(204).send({type: 'error', message: 'Invalid user Id or Password !'})
                }
            }else {
                res.status(204).send({type: 'error', message: 'Database Error!'})
            }
              	
        } else {
            let db = new sqlite3.Database( dbfile, sqlite3.OPEN_READWRITE, function(err)  {
                if (err) {
                    res.status(400).send({ type: 'error', message: err.message}); 
                } else {
                    db.get("SELECT USERID, SALT FROM USERS WHERE USERID = ? ", [userid],  function(err1, row) {
                        if(err1 || !row) {
                            res.status(204).send({'Error': true, 'message' : 'Invalid user Id or Password !' });                        
                        } else {
                            var hash = bcrypt.hashSync(pwd, row.SALT);
                            db.get('SELECT USERID, USER_NAME, USER_EMAIL, ROLE, DEFAULT_CO, DEFAULT_YEAR FROM USERS WHERE USERID = ? AND PASS = ?', [userid, hash ], function(err, row) {
                                if (!row) {
                                    res.status(204).send({type: 'error', message: 'Invalid user Id or Password !'})
                                } else {
                                    var userDetail = { "userid":  row.USERID , "username" : row.USER_NAME, "email" : row.USER_EMAIL, "role" : row.ROLE , "defaultco" : row.DEFAULT_CO , "defaultyr" : row.DEFAULT_YEAR  } ;
                                    const  accessToken  =  jwt.sign( {"userid":  row.USERID}, MY_SECRET_KEY, {
                                        expiresIn:  expiresIn
                                    });
        //                                res.status(200).send({type: 'success', message: 'Logged in Successfully !', userData: userDetail, "token":  accessToken  });
                                    res.status(200).send({type: 'success', message: 'Logged in Successfully !',  "token":  accessToken  });
                                }
                            }); 
                        }                
                    });                    
                }
            });
            db.close();             
        }
    }
});


router.get('/user', Authenticate, (req, res) => {
    var myid = req.userData.userid
    if(myid=='Admin') {
        let db = new sqlite3.Database( dbfile, sqlite3.OPEN_READWRITE, function(err)  {
            if (err) {
                res.status(400).send({ type: 'error', message: err.message}); 
            } else {
                db.get('SELECT USERID, USER_NAME, USER_EMAIL, ROLE, DEFAULT_CO, DEFAULT_YEAR FROM USERS WHERE USERID = ? ', [myid ], function(err, row) {
                    if (!row) {
                        res.status(204).send({type: 'error', message: 'Invalid user Id or Password !'})
                    } else {
                        var userDetail = { "userid":  row.USERID , "username" : row.USER_NAME, "email" : row.USER_EMAIL, "role" : row.ROLE   } ;
                        res.status(200).send({type: 'success', message: 'User with valid token !', userInfo: userDetail  });
                    }
                });                             
            }
        });
    } else {
        var userDetail = { "userid":  myid , "username" : myid, "email" : 'Hotsys User', "role" : 'Hotsys Role'   } ;
        res.status(200).send({type: 'success', message: 'User with valid token !', userInfo: userDetail  });
    }
});

// logout
router.post('/logout', (req, res, next) => {
    res.json({ status: 'OK' })
});



async function getDBFilePath(){
    return new Promise((resolve, reject) => {
        let db = new sqlite3.Database( dbfile, sqlite3.OPEN_READWRITE, function(err)  {
            if (err) {
                db.close()
                resolve("")
            } else {
                db.get("SELECT gcdbffolder FROM COMPANY  ", [],  function(err1, row) {
                    if (!row) {
                        db.close()
                        resolve("")
                    } else {
                        db.close()
                        resolve(row.gcdbffolder)
                    }    
                });
            }        
        });
    });    
}

/*
router.get('/user',  (req, res) => {
    var token =  req.headers.authorization.replace('Bearer ','');
    var token =  req.headers.authorization.replace('bearer ','');
    var myid = "";

    console.log(token);
    if (!token) {
        res.status(400).json({type: 'error', message: 'invalid access-token'})
    } else {
        jwt.verify( token ,apiconfig.ServerConfig.secret, function(err, result){
            if(err) {
                res.status(403).json({type: 'error', message: 'Provided token is invalid.', err})
            } else {
                myid = result.userid
                console.log("jwt result")
                console.log(result)
                let db = new sqlite3.Database( dbfile, sqlite3.OPEN_READWRITE, function(err)  {
                    if (err) {
                        res.status(400).send({ type: 'error', message: err.message}); 
                    } else {
                        db.get('SELECT USERID, USER_NAME, USER_EMAIL, ROLE, DEFAULT_CO, DEFAULT_YEAR FROM USERS WHERE USERID = ? ', [myid ], function(err, row) {
                            if (!row) {
                                res.status(204).send({type: 'error', message: 'Invalid user Id or Password !'})
                            } else {
                                var userDetail = { "userid":  row.USERID , "username" : row.USER_NAME, "email" : row.USER_EMAIL, "role" : row.ROLE , "defaultco" : row.DEFAULT_CO , "defaultyr" : row.DEFAULT_YEAR  } ;
                                res.status(200).send({type: 'success', message: 'User with valid token !', userInfo: userDetail  });
                            }
                        });                             
                    }
                });
            } 
	    }) ;
    }
});



router.get('/me', (req, res) => {
    var token =  req.headers.authorization.replace('Bearer ','');
    if (!token) {
        res.status(400).json({type: 'error', message: 'invalid access-token'})
    } else {
        jwt.verify( token ,apiconfig.ServerConfig.secret, function(err, result){
            if(err) {
                res.status(403).json({type: 'error', message: 'Provided token is invalid.', error})
            } else {
                res.json({
                    type: 'success',
                    message: 'Provided token is valid.',
                    result
                  });
            } 
	    }) ;
    }
});


router.get('/mydata', (req, res) => {
    var token =  req.headers.authorization.replace('Bearer ','');
    var myid = "";

    if (!token) {
        res.status(400).json({type: 'error', message: 'invalid access-token'})
    } else {
        jwt.verify( token ,apiconfig.ServerConfig.secret, function(err, result){
            if(err) {
                res.status(403).json({type: 'error', message: 'Provided token is invalid.', error})
            } else {
                myid = result.userid
                let db = new sqlite3.Database( dbfile, sqlite3.OPEN_READWRITE, function(err)  {
                    if (err) {
                        res.status(400).send({ type: 'error', message: err.message}); 
                    } else {
                        db.get('SELECT USERID, USER_NAME, USER_EMAIL, ROLE, DEFAULT_CO, DEFAULT_YEAR FROM USERS WHERE USERID = ? ', [myid ], function(err, row) {
                            if (!row) {
                                res.status(204).send({type: 'error', message: 'Invalid user Id or Password !'})
                            } else {
                                var userDetail = { "userid":  row.USERID , "username" : row.USER_NAME, "email" : row.USER_EMAIL, "role" : row.ROLE , "defaultco" : row.DEFAULT_CO , "defaultyr" : row.DEFAULT_YEAR  } ;
                                res.status(200).send({type: 'success', message: 'User with valid token !', userData: userDetail  });
                            }
                        });                             
                    }
                });
            } 
	    }) ;
    }
});


router.post('/datafromAuthT', (req, res) => {
    const token = req.body.Token;
    var myid = "";

    if (!token) {
        res.status(400).json({type: 'error', message: 'invalid access-token'})
    } else {
        jwt.verify( token ,apiconfig.ServerConfig.secret, function(err, result){
            if(err) {
                res.status(403).json({type: 'error', message: 'Provided token is invalid.', error})
            } else {
                myid = result.userid
                let db = new sqlite3.Database( dbfile, sqlite3.OPEN_READWRITE, function(err)  {
                    if (err) {
                        res.status(400).send({ type: 'error', message: err.message}); 
                    } else {
                        db.get('SELECT USERID, USER_NAME, USER_EMAIL, ROLE, DEFAULT_CO, DEFAULT_YEAR FROM USERS WHERE USERID = ? ', [myid ], function(err, row) {
                            if (!row) {
                                res.status(204).send({type: 'error', message: 'Invalid user Id or Password !'})
                            } else {
                                var userDetail = { "userid":  row.USERID , "username" : row.USER_NAME, "email" : row.USER_EMAIL, "role" : row.ROLE , "defaultco" : row.DEFAULT_CO , "defaultyr" : row.DEFAULT_YEAR  } ;
                                res.status(200).send({type: 'success', message: 'User with valid token !', userData: userDetail  });
                            }
                        });                             
                    }
                });
            } 
	    }) ;
    }
});




router.get('/user/:id', function(req, res, next)  {
    var token =  req.headers.authorization.replace('Bearer ','');
    var userid = req.params.id ;

	jwt.verify( token ,apiconfig.ServerConfig.secret, function(err, decoded){
		if(err) {
			res.json(err.message) ;
		} else {
			let db = new sqlite3.Database( dbfile, sqlite3.OPEN_READWRITE, function(err)  {
				if (err) {
					res.json(err.message) ; 
				  } 
                    db.get('SELECT USERID, USER_NAME, USER_EMAIL, ROLE, DEFAULT_CO, DEFAULT_YEAR FROM USERS WHERE USERID = ? ', [userid ], function(err, row) {
                    if (err) {
							res.json(err.message);
						} else {
                            var userDetail = { "userid":  row.USERID , "username" : row.USER_NAME, "email" : row.USER_EMAIL, "role" : row.ROLE , "defaultco" : row.DEFAULT_CO , "defaultyr" : row.DEFAULT_YEAR   } ;
                            res.status(200).send({"Error" : false, "user": userDetail });
//                            res.json(row);	
						}
					});
				});
			db.close();
		}
	}) ;
});

*/



  
/*
router.post('/register', async function(req, res){
    const reqType  = req.headers["content-type"] ; 
	var userid = req.body.userid;
	var username = req.body.username;
	var email = req.body.email;
	var role = req.body.role;
	var pwd = req.body.pwd;
//	var password2 = req.body.password2;
	var defaultCoID = req.body.defaultCoID;
	var defaultYear = req.body.defaultYear;

    const  MY_SECRET_KEY = apiconfig.ServerConfig.secret ;
    const  expiresIn  =  24  *  60  *  60;

    let isValidInput = false ;

    if (reqType != 'application/json;charset=UTF-8' ) {
        res.status(400).send({'Error': true, 'message' : 'Invalid Request !' })
    } else {
        if (!username) {
            res.status(400).send({'Error': true, 'message' : 'No user Name Provided !' })
        } else {
            if(!email) {
                res.status(400).send({'Error': true, 'message' : 'No email specified !' })
            } else {
                if(!pwd) {
                    res.status(400).send({'Error': true, 'message' : 'No Password provided !' })
                } else {
                    isValidInput = true ;
                }
            }
        }    
    }

    if(isValidInput) {
        //check if for duplicate user
        let db = new sqlite3.Database( dbfile, sqlite3.OPEN_READWRITE, function(err)  {
            if (err) {
                res.status(500).json({'Error': true, message : 'Database Error !' });
            } else {
                db.get('SELECT * FROM users WHERE userid = ?',  userid, function(err, row) {
                    if (!row) {
                        var hash = bcrypt.hashSync( pwd, salt);
                        var sqlstmt = "INSERT INTO USERS (USERID, USER_NAME, PASS, SALT, USER_EMAIL, ROLE, DEFAULT_CO, DEFAULT_YEAR) VALUES ( ?, ?, ?, ?, ?, ?, ?, ? )" ;
                        db.run(sqlstmt, [userid, username, hash, salt, email, role, defaultCoID, defaultYear], function(err, row){
                            if (err){
                                res.status(400).send({'Error': true, message : 'Database Error !' })
                            } else {
                                res.status(202).json({'Error': true, 'message' : 'User Added successfully!' } );
                            }
                            res.end();
                        });
                    } else {
                        res.status(400).send({'Error': true, 'message' : 'User already Exist !' })
                    }
                });
                }
            });
    } 
});

*/

module.exports = router;
