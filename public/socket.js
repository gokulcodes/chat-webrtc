const socket = io('/')
const videoGrid = document.querySelector('.videoGrid')
const mypeer = new Peer(undefined, {
    host: '/',
    port: 3001
})
const peers = []
mypeer.on('open', id => {
    socket.emit('join-room', roomID, id)
})

socket.on('user-connected', (userId) => {
    console.log("user-connected"+ userId)
})

const myVideo = document.createElement('video')
myVideo.muted = true

navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
}).then(stream => {
    createVideoSource(stream, myVideo)
    mypeer.on('call', (call) => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', (userVideoStream) => {
            createVideoSource(userVideoStream, video)
        })
    })
    socket.on('user-connected', userId => {
        connectTonewUser(stream, userId)
    })
    socket.on('user-disconnected', userId => {
        if(peers[userId]) peers[userId].close()
    })
})

function createVideoSource(stream, video){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

function connectTonewUser(stream, userId){
    const call = mypeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        createVideoSource(userVideoStream, video)
    })
    call.on('close', () => {
        video.remove()
    })
    peers[userId] = call
}