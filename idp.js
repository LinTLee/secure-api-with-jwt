'use strict'
const request = require('request')

const login = async (username, password, config) => {
  return new Promise(async function makePromise (resolve, reject) {
    const options = {
      method: 'POST',
      url: `${config.host}/oauth/token`,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      form: { 
        grant_type: 'password',
        username: username,
        password: password,
        scope: 'openid email profile',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        audience: config.audience
      }
    }
    request(options, function (err, response, body) {
      if (err) return reject(err)
      const data = JSON.parse(body) 
      if (data.error != null) return reject(new Error(data.error + ': ' + data.error_description))
      if (data.access_token == null) return reject(new Error('Fails to generate access token'))
      resolve(data.access_token)
    })
  })
}

module.exports.login = login