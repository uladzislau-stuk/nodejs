const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io');

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let count = 0

io.on('connection', (socket) => {
  // socket contains information about new connection
  socket.emit('countUpdated', count)
  
  socket.on('increment', () => {
    count++
    // emit event to current connection
    // socket.emit('countUpdated', count)
    // emit event to every single connection available
    io.emit('countUpdated', count)
  })
})

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`)
})
