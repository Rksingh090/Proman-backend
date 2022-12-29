const express = require('express')
const morgan = require('morgan')
const dotenv = require('dotenv')
const helmet = require('helmet')
const mongoose = require('mongoose')
const path = require('path')
const { notFoundHandler, errorHandler } = require('./middleware')
const cors = require('cors')

// routes (apis)
const boardHandler = require('./api/boardHandler')
const listHandler = require('./api/listHandler')
const cardHandler = require('./api/cardHandler')
const userHandler = require('./api/userHandler')
const activityHandler = require('./api/activityHandler')
const notificationHandler = require('./api/notificationHandler')
const chatHandler = require('./api/chatHandler')

dotenv.config()
const app = express()

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

app.use(morgan('tiny'))
app.use(helmet())

const allowedOrigin = [];
app.use(cors({
    origin: allowedOrigin,
    credentials: true
}))


app.use(express.json())
app.use('/api/user/', userHandler)
app.use('/api/boards/', boardHandler)
app.use('/api/lists/', listHandler)
app.use('/api/cards/', cardHandler)
app.use('/api/activities/', activityHandler)
app.use('/api/notification/', notificationHandler)
app.use('/api/chat/', chatHandler)


app.use(errorHandler)
const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));

app.use(notFoundHandler)

module.exports = app
