const WSS = require('ws').Server

const WebSocketServer = (server) => {
  let wss = new WSS({server: server.listener})

  wss.broadcast = (data) => {
    wss.clients.forEach((client) => {
      client.send(data)
    })
  }

  console.log('websocket server created')

  wss.on('connection', (ws) => {
    ws.broadcast = (data) => {
      wss.clients.forEach((client) => {
        if (client === ws) {
          return
        }
        client.send(data)
      })
    }

    ws.on('message', (data, flags) => {
      console.log('Performance Message:', data)
      wss.broadcast(data)
    })

    console.log('websocket connection open')

    ws.on('close', () => {
      console.log('websocket connection closed')
    })
  })
}

module.exports = WebSocketServer
