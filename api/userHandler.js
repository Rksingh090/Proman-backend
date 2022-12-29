const { Router } = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { auth } = require('../middleware')
const router = Router()
const dotenv = require('dotenv')

dotenv.config()
// register a new user
router.post('/register', async (req, res, next) => {
    const { name, password, passwordCheck, username } = req.body
    try {
        if (!password || !passwordCheck || !username || !name)
            return res.status(400).json({ msg: 'Don\'t be lazy 🦥, enter all fields value' })

        if (password.length < 5) {
            return res.status(400).json({ msg: 'Password is too small, try harder 🤪' })
        }
        if (password != passwordCheck)
            return res.status(400).json({ msg: 'Password don\'t match 👿' })

        const existingUser = await User.findOne({ username })
        if (existingUser)
            return res.status(400).json({ msg: 'Username exists, think of something unique 🦄' })

        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)
        const newUser = new User({ name, username, password: passwordHash })
        const response = await newUser.save()
        res.send({ username: response.username, _id: response._id })
    } catch (error) {
        if (error.name === 'ValidationError')
            return res.status(422)
        next(error)
    }
})

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    try {
        if (!username || !password)
            return res.status(400).json({ msg: 'Don\'t be lazy 🦥, enter all fields value' })

        const user = await User.findOne({ username })
        if (!user)
            return res.status(400).json({ msg: 'User doesn\'t exist 🙈' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
            return res.status(400).json({ msg: 'Invalid Credentials 🤕' })

      
        const token = jwt.sign({ id: user._id }, "sunny")
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username
            }
        })
    } catch (error) {
        next(error)
    }
})


router.post('/tokenIsValid', async (req, res, next) => {
    try {
        const token = req.header('x-auth-token')
        if (!token) return res.json(false)

        const verified = jwt.verify(token, "sunny")
        if (!verified) return res.json(false)

        const user = await User.findById(verified.id)
        if (!user) return res.json(false)

        return res.json(true)
    } catch (error) {
        next(error)
    }
})
router.post('/addfriend',auth,async (req,res) => {
    const {userTosendFR, userTosendFRUsername, userToAddFR, userToAddFRUsername} = req.body;
    const token = req.header('x-auth-token')
    try {
        if (!token) {
            res.json(false)
        }
        const user1 = await User.findById({_id: userTosendFR})
        const user2 = await User.findById({_id: userToAddFR})

        if(!user1 || !user2) return res.status(400).json({msg: "User not found"})

            const updateUser1 = await User.findByIdAndUpdate({_id: userTosendFR},{$push: {friends: {friendUsername: userToAddFRUsername, friendId: userToAddFR }}}, {new: true})
        const updateUser2 = await User.findByIdAndUpdate({_id: userToAddFR}, {$push: {friends: {friendUsername: userTosendFRUsername, friendId: userTosendFR }}})

        res.json(updateUser1)
    } catch (error) {
        res.json({error: error.message})
    }
})
router.post('/update',auth, async (req, res, next) => {
    try {
        const token = req.header('x-auth-token')
        if (!token) return res.json(false)

        const dbParam = {}
        const {id, params} = req.body;
        const {name, username, currPassword, newPassword} = params;

        const user = await User.findById({_id: id})

        if(!user) return res.json({msg: "User doesn't exists..."})

        if(name !== ''){
            dbParam.name = name;
        }
        if(username !== ''){
            dbParam.username = username
        }

        if(currPassword && currPassword !== '' && newPassword && newPassword !== ''){
            const isSamePassword = await bcrypt.compare(currPassword, user.password)
            if(!isSamePassword){
                return res.json({msg: "Password is Incorrect"})
            }else{
                const salt = await bcrypt.genSalt()
                const passwordHash = await bcrypt.hash(newPassword, salt)
                dbParam.password = passwordHash;
            }
        }

        const updatedUser = await User.findByIdAndUpdate({_id: id}, dbParam )
        const newUser = await User.findById({_id: id})
        if(updatedUser){
            res.json({id: newUser._id, name: newUser.name, username: newUser.username, msg: "Profile Update"})
        }

    } catch (error) {
        res.json({err: error.message})
    }
})


router.get('/search/:user', async (req, res) => {
    const {user} = req.params;
    try {
        const users = await User.find({username: {$regex: new RegExp(user,'g')}}, {__v: 0, password: 0})
        res.json(users)
    } catch (error) {
        res.json({err: error.message})
    }
})

router.get('/all', async (req, res, next) => {
    try {
        const user = await User.find({})
        if (!user)
            return res.status(404).send()
        res.json(user)
    } catch (error) {
        next(error)
    }
})

router.get('/', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user)
        if (!user)
            return res.status(404).send()
        res.json({
            username: user.username,
            id: user._id,
            name: user.name,
            friends: user.friends
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router