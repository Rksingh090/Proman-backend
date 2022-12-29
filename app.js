const express = require('express')
const morgan = require('morgan')
const dotenv = require('dotenv')
const helmet = require('helmet')
const mongoose = require('mongoose')
const cors = require('cors')

// middlewares 
const { notFoundHandler, errorHandler } = require('./middleware')
const path = require('path')

// require routes
const boardHandler = require('./api/boardHandler')
const listHandler = require('./api/listHandler')
const cardHandler = require('./api/cardHandler')
const userHandler = require('./api/userHandler')
const activityHandler = require('./api/activityHandler')
const notificationHandler = require('./api/notificationHandler')
const chatHandler = require('./api/chatHandler')

// env config 
dotenv.config();

// express app
const app = express()

// mongo db connection
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

// middlewares
app.use(morgan('tiny'))
app.use(helmet())
app.use(express.json())


console.log("Allowed origin");

//corsorrigin
const allowedOrigin = ["https://proman-khaki.vercel.app"];
app.use(cors({
    origin: allowedOrigin,
    credentials: true
}))

// routes and api 
app.use('/api/user/', userHandler)
app.use('/api/boards/', boardHandler)
app.use('/api/lists/', listHandler)
app.use('/api/cards/', cardHandler)
app.use('/api/activities/', activityHandler)
app.use('/api/notification/', notificationHandler)
app.use('/api/chat/', chatHandler)

//  error handling
app.use(errorHandler);

// static paths 
const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));

// not found handler 
app.use(notFoundHandler)

// export app 
module.exports = app
