const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('express-jwt')
const jsonwebtoken = require('jsonwebtoken')

const apiconfig = require('../apiconfig')

const MY_SECRET_KEY = apiconfig.ServerConfig.secret ;



/*
const bcrypt  =  require('bcryptjs'); 
const sqlite3 = require('sqlite3').verbose();
var dbfile = apiconfig.apppath + apiconfig.database ;
*/

// Create app
const app = express()

// Install middleware
app.use(cookieParser())
app.use(bodyParser.json())

// JWT middleware
app.use(
  jwt({
    secret: MY_SECRET_KEY
  }).unless({
    path: '/api/auth/login'
  })
)

// -- Routes --

// [POST] /login
app.post('/login', (req, res, next) => {
//  const { username, password } = req.body
//  const valid = username.length && password === '123'

	const userid = req.body.userid;
//  const pwd  =  req.body.userPwd;
//  const expiresIn  =  24  *  60  *  60;


//  if (!valid) {
//    throw new Error('Invalid username or password')
//  }

  const accessToken = jsonwebtoken.sign(
    {
      userid,
      picture: 'https://github.com/nuxt.png',
      name: 'User ' + userid,
      scope: ['test', 'user']
    },
    MY_SECRET_KEY
  )

  res.json({
    token: {
      accessToken
    }
  })
})

// [GET] /user
app.get('/user', (req, res, next) => {
  res.json({ user: req.user })
})

// [POST] /logout
app.post('/logout', (req, res, next) => {
  res.json({ status: 'OK' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err) // eslint-disable-line no-console
  res.status(401).send(err + '')
})

// -- export app --
module.exports = {
  path: '/api/auth',
  handler: app
}
