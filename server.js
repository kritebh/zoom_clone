const express = require("express")
const app = express();
const port = process.env.PORT || 8000
const {v4:uuidv4} = require("uuid")

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const {ExpressPeerServer} = require("peer")

const peerServer = ExpressPeerServer(server,{
    debug:true
})


app.set('view-engine','ejs')

app.use(express.static("public"));
app.use("/peerjs",peerServer)

server.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
})


app.get("/",(req,res)=>{
    res.redirect(`/${uuidv4()}`)
})

app.get("/:room",(req,res)=>{
    res.render("room.ejs",{roomId:req.params.room})
})

io.on("connection",socket =>{
    
    socket.on("join-room",(roomId,userId)=>{
        console.log("joined room",roomId)
        socket.join(roomId)
        io.to(roomId).emit("user-connected",userId)
    })


})