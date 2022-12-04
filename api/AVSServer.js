//========================================================================================
// || om Shree Ganeshay Namha ||
//========================================================================================
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const apiconfig = require('./apiconfig');
const port = process.env.PORT || apiconfig.ServerConfig.serverport ;
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors')

//var fupload = require('express-fileupload');

var os = require('os');
var ifaces = os.networkInterfaces();

// Check the database connection 
var db = new sqlite3.Database(apiconfig.sysdb, sqlite3.OPEN_READWRITE, function(err)  {
  if (err) {
      console.error(err.message);
  } else {
    console.log('Connected to the database.');
  }
  db.close();
});


//let middleware = require('./validateToken');

var company = require('./routes/company');
var guestmaster = require('./routes/guestmaster');
var checkin = require('./routes/checkin');
var guestbook = require('./routes/guestbook');
var fileupload = require('./routes/fileupload');
var users = require('./routes/users');
var dbfapi = require('./routes/dbfapi');


var publicpath = path.join(apiconfig.apppath, 'public');

// Init App
let app = express();


// BodyParser Middleware
app.use(bodyParser.json({limit: '16mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '16mb' }));
//app.use(cookieParser());

// Set Static Folder
app.use(express.static(publicpath));
app.use(cors());
//app.use(fupload())


//app.use('/', routes);
app.use('/api/company', company);
app.use('/api/guestmaster', guestmaster);
app.use('/api/checkin', checkin);
app.use('/api/guestbook', guestbook);
app.use('/api/fileupload', fileupload);
app.use('/api/users', users);
app.use('/api/dbfapi', dbfapi);


// Set Port
app.set('port', port);

app.listen(app.get('port'), function(){
  console.log('Server started on port '+ app.get('port'));
});

