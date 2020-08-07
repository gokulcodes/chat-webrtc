const express = require('express')
const ejs = require('ejs')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const {v4: uuidV4} = require('uuid')

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect(`${uuidV4()}`)
})
app.get('/:room', (req, res) => {
    res.render('room', {roomID: req.params.room})
})
io.on('connection', (socket) => {
  socket.on('join-room', (roomID, userId) => {
    socket.join(roomID)
    socket.to(roomID).broadcast.emit('user-connected', userId)
    socket.on('disconnect', () => {
      socket.to(roomID).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(3000, () => {
    console.log('connected to 3000')
})