const config = require('./apiconfig')
let jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' })

  token =  token.replace('Bearer ','');
  token =  token.replace('bearer ','');

  const  MY_SECRET_KEY = config.ServerConfig.secret ;

  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  
  jwt.verify( token , MY_SECRET_KEY, function(err, result){
    if(err) {
        res.status(204).json({success: false, type: 'error', message: 'Provided token is invalid.'})
    } else {
      req.userData = result;
      next();
    } 
  }) ;

/*
  try {
    var decoded = await jwt.verify(token, MY_SECRET_KEY);
    req.userData = decoded;
    next();
  } catch(err) {
    return res.json({
      success: false,
      message: 'Invalid Auth token'
    });
  }    
*/

};


/*
module.exports = {
  validateToken: validateToken
}
*/

/*
let validToken = async  (headerData) => {
  // Return values 0 - Token not provide, 1 - Invalid Token , 2 - Valid Token
  let token = headerData['x-access-token'] || headerData['authorization']; // Express headers are auto converted to lowercase
  const  MY_SECRET_KEY = config.ServerConfig.secret ;

  if (!token) {
    return {
      success : false,
      message: 'Auth token is not supplied'
    } ;
  } else {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    try {
      var decoded = await jwt.verify(token, MY_SECRET_KEY);
      return {
        success : true,
        message: 'Athorized Token'
      } ;
  
    } catch(err) {
      return {
        success : false,
        message: 'Invalid Auth token'
      } ;
    }    
  }  
};

*/


