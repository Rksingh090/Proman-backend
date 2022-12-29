const mongoose = require('mongoose')
const { Schema } = mongoose

const chat = new Schema({
    UserID: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    UserName: {
        type: String,
        required: true
    },
    boardID: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    text: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model("Chat", chat);