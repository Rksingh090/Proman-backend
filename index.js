const app = require('./app')
const socket = require('socket.io')
const PORT = process.env.PORT || 5000

var server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

const io = socket(server)

const curr_users = []
io.on("connection", (socket) => {
    console.log("Connected")
    socket.on('JoinBoard', ({ UserID, UserName, boardID }) => {
        JoinUsertoRoom(UserID, UserName, boardID )
        socket.join(boardID)
        socket.broadcast.to(boardID).emit("UserJoined", { UserID, UserName, boardID});
        console.log(`${UserName} has Joined board ${boardID}`)
    })

    socket.on("sendUserMessage",({UserID, UserName, text, boardID}) => {
        socket.broadcast.to(boardID).emit("userMessage", { UserID, UserName, text })
    })

    socket.on("getBoardMembers", (boardID) => {
        socket.emit("sendBoardMembers", getUsersbyBoardID(boardID))
        console.log(getUsersbyBoardID(boardID))
    })
})

const JoinUsertoRoom = (UserID, UserName, boardID ) => {
    const existingUsers = curr_users.find((user) => user.UserID == UserID)

    if(existingUsers){
        return null
    }else{
        curr_users.push({ UserID: UserID, UserName: UserName, boardID: boardID })
    }
    console.log(curr_users)
}

const getUsersbyBoardID = (boardID) => {
    return curr_users.filter((user) => user.boardID == boardID)
} 