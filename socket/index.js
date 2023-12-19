const { Server } = require("socket.io")

const io = new Server({
  // cors: "http://192.168.0.5:5000/api/",
})

let onlineUsers = []

io.on("connection", (socket) => {
  console.log("new connection", socket.id)

  // listen to a connection

  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      })

    console.log("onlineUsers", onlineUsers)

    // send online users to front
    io.emit("getOnlineUsers", onlineUsers)
  })
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)
    io.emit("getOnlineUsers", onlineUsers)
  })
})

io.listen(3000)
