'use strict'
const extractJwt = require('passport-jwt').ExtractJwt
const jwksRsa = require('jwks-rsa')
const jwtStrategy = require('passport-jwt').Strategy

module.exports = (options) => {
  const strategyOptions = {
    jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKeyProvider: jwksRsa.passportJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${options.host}/.well-known/jwks.json`
    }),
    audience: options.audience,
    issuer: `${options.host}/`,
    algorithms: [ 'RS256' ]
  }

  return new jwtStrategy(strategyOptions, (jwt_payload, done) => {
    const profile = jwt_payload
    return done(null, {
      sub: profile.sub, 
      iat: profile.iat, 
      exp: profile.exp
    })
  })
}