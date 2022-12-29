const mongoose = require('mongoose')
const { Schema } = mongoose

const boardSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    description: {
        type: String,
        required: false
    },
    Background: {
        color: {
            type: String,
            required: true
        }
    },
    members: {
        type: Array,
        default: []
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('board', boardSchema)
