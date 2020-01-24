'use strict'
const bodyParser = require('body-parser')
const express = require('express')
const http = require('http')
const idp = require('./idp')
const localJwtStrategy = require('./local-jwt-strategy')
const passport = require('passport')
const validator = require('validator')

const PORT = 8080
const IDP_CONFIG = {
  host: 'https://your-tenant.auth0.com',
  clientId: 'APPLICATION_CLIENT_ID',
  clientSecret: 'APPLICATION_CLIENT_SECRET',
  audience: 'AUDIENCE_IDENTIFIER'
}
let app = express()

// attach a local strategy to the passport
passport.use('local', localJwtStrategy(IDP_CONFIG))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// public accessible endpoint
app.get('/', (req, res) => {
  res.status(200).send('hello world!')
})

// log in to generate a jwt
app.post('/login', async (req, res) => {
  if (req.body.email == null || req.body.password == null) {
    return res.status(401).send('invalid credential')
  }
  if (!validator.isEmail(req.body.email)) {
    return res.status(401).send('invalid credential')
  }
  try {
    const jwt = await idp.login(req.body.email, req.body.password, IDP_CONFIG)
    res.status(200).send(jwt)
  } catch (err) {
    console.error(err)
    res.status(500).send('internal server error')
  } 
})

// secured endpoint by jwt  
app.get('/me', passport.authenticate('local', { session: false }), (req, res) => {
  res.status(200).send(`secured resource accessed by user id ${req.user.sub}`)
})

// initiate http server
let httpServer = http.createServer(app)

// start a server listening
httpServer.listen(PORT, () => {
  console.log(`Http server listening on port ${PORT} with pid ${process.pid}`)
})

// catch error occurred with the server
httpServer.on('error', (err) => {
  console.error(err)
  httpServer.close()
})
