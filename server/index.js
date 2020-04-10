const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

app.get('/api/test', (req, res) => {
  res.status(200).send('ok')
})

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  const server = app.listen(port, host)
  socketStart(server)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

let messageQueue = []
let count = 0

const socketStart = (server) => {
  const io = require('socket.io').listen(server)

  io.on('connection', (socket) => {
    console.log('id: ' + socket.id + ' is connected')
    if (messageQueue.length > 0) {
      messageQueue.forEach((message) => {
        // socket.emit('new-message', message)
      })
    }

    socket.on('send-message', (message) => {
      message.id = count
      count++
      console.log(message)
      messageQueue.push(message)
      socket.broadcast.emit('new-message', message)
      if (messageQueue.length > 10) {
        messageQueue = messageQueue.slice(-10)
      }
    })
  })
}

start()
