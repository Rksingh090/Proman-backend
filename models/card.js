const mongoose = require('mongoose')
const { Schema } = mongoose

const cardSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    listId: {
        type: Schema.Types.ObjectId,
        ref: 'list',
        required: true
    },
    boardId: {
        type: Schema.Types.ObjectId,
        ref: 'board',
        required: true
    },
    description: {
        type: String,
    },
    topBorderColor: {
        type: String,
    },
    order: {
        type: String,
        required: true
    },
    deadLineDate: {
        type: String,
    },
    isNFSend: {
        type: Boolean,
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('card', cardSchema)
