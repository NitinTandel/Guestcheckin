
var path = require('path');

//var apiPath = path.join(__dirname );

module.exports = {
//   'database': '/api/db/fees.db',
   'sysdb' : './sys.db',
   'apppath' : __dirname,

   ServerConfig : {
      'baseurl' :'http://localhost',
      'serverport':3001,
      'tokenexp': 3600,
      'secret': 'omshreeganesh',
   },

};


