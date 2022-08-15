const socket = io("/")

const peer = new Peer(undefined, {
    path: "/peerjs",
    host: "/",
    port: "8000"
})


const myVideo = document.createElement("video")
myVideo.muted = true;

const videoGrid = document.getElementById("video-grid")


let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
}).then(stream => {
    myVideoStream = stream
    addVideoStream(myVideo, stream);
    
    socket.on("user-connected", (userId) => {
        connectToNewUser(userId, stream)
    })
    
    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement("video")
        call.on("stream",userVideoStream=>{
            addVideoStream(video,userVideoStream)
        })
    });


})


peer.on("open", id => {
    // console.log(id)
    socket.emit("join-room", ROOM_ID, id);
})



const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement("video")
    call.on("stream", userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}


const addVideoStream = (video, stream) => {
    console.log("cnt")
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
    })

    videoGrid.append(video)

}