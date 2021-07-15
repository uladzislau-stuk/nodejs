const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} = require('./utils/users')


const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
  console.log('New WebSocket connection')
  // broadcast - sends everyone except current connection
  // socket.broadcast.emit('message', generateMessage('A new user has joined!'))
  
  socket.on('join', ({username, room}, callback) => {
    const {error, user} = addUser({
      id: socket.id,
      username,
      room
    })
    
    if (error) {
      return callback(error)
    }
    
    socket.join(user.room)
  
    // socket contains information about new connection
    socket.emit('message', generateMessage('Welcome'))
    
    socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`))
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    })
    
    callback()
  })
  
  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter()
    
    if (filter.isProfane(message)) {
      return callback('Profane words are prohibited!')
    }
    
    const {room, username} = getUser(socket.id)
    
    io.to(room).emit('message', generateMessage(username, message))
  })
  
  socket.on('sendLocation', (coords, callback) => {
    const {username, room} = getUser(socket.id)
    
    io.to(room).emit('locationMessage', generateLocationMessage(username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
    callback('Location shared!')
  })
  
  // runs when peer disconnected
  socket.on('disconnect', () => {
    const user = removeUser(socket.id)
    
    if (user) {
      io.to(user.room).emit('message', generateMessage(`${user.username} has left!`))
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      })
    }
  })
})

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`)
})
