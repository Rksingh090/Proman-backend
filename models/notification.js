const {Schema, model} = require('mongoose')

const notification = new Schema({
    text: {
        type: String,
        required: true,
    },
    notificationType: {
        type: String,
        required: true,
    },
    to: {
        type: Schema.Types.ObjectId,
        required: true
    },
    toUsername: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    fromUsername: {
        type: String,
        required: true
    },
    boardId: {
        type: String,
        required: false
    }
},{
    timestamps: true
})

module.exports = model('Notification',notification)