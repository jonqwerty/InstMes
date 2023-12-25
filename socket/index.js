const { Server } = require("socket.io")

const io = new Server({
  // cors: "http://192.168.0.5:5000/api/",
})

let onlineUsers = []

io.on("connection", (socket) => {
  // listen to a connection
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      })

    console.log("onlineUsers -->>", onlineUsers)

    // send online users to front
    io.emit("getOnlineUsers", onlineUsers)
  })

  // add message
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((user) => user.userId === message.recipientId)

  
    if (user) {
      io.to(user.socketId).emit("getMessage", message)
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      })
     
    }
  })

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)
    io.emit("getOnlineUsers", onlineUsers)
  })
})

io.listen(3000)
