const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const {v4: uuidV4} = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    console.log('called')
    res.redirect(`/${uuidV4}`)
})
app.get('/:room', (req, res) => {
    console.log(req.params.room)
    res.render('room', {roomID: req.params.room})
})
// io.on('connection', (socket) => {
//     console.log('user-connected')
// })

server.listen(3000, () => {
    console.log('connected to 3000')
})