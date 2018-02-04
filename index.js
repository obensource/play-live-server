'use strict'

const hapi = require('hapi')
const joi = require('joi')
const wss = require('./wss.js')

const parameterSchema = joi.object().keys({
  appPath: joi.string().required(),
  type: joi.string().alphanum().required()
})

const errCatch = (err) => {
  console.log(err)
  process.exit(1)
}

const PlayLiveServer = async ({appPath, type}) => {
  const validation = joi.validate({ appPath: appPath, type: type }, parameterSchema)

  if (validation.error) {
    errCatch(validation.error)
  }

  const server = new hapi.Server({
    port: Number(process.env.PORT) || 9090
  })

  try {
    await server.register(require('inert'))
  } catch (err) {
    errCatch(err)
  }

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: appPath,
        redirectToSlash: true,
        index: true
      }
    }
  })

  try {
    await server.start()
  } catch (err) {
    errCatch(err)
  }

  console.log('Server running at:', server.info.uri)

  switch (type) {
    case 'broadcast':
      wss(server)
      break
    case 'p2p':
      console.log('\nplay-live-server: P2P server coming soon\n')
      process.exit(0)
    default:
      console.log('\nError: play-live-server supported server types: \'broadcast\', \'p2p\'\n')
      process.exit(1)
  }
}

module.exports = PlayLiveServer