const { Router } = require('express')
const Notification = require('../models/notification')
const { auth } = require('../middleware')
const router = Router()

// get all notification
router.get('/all', async (req, res) => {
    const allNotifications = await Notification.find({})
    allNotifications && res.json(allNotifications)
})

// get all notification for a user 
router.get('/:userID',auth, async (req, res) => {
    try{
        const { userID }= req.params;
        const notifications = await Notification.find({to: userID})
        notifications && res.json(notifications)
    }catch(err){
        res.status(400).json({msg: err.message})
    }
})

// create new notification
router.post('/',auth, async (req, res) => {
    try {
        const newNotification = new Notification(req.body)
        const notification = await newNotification.save()
        res.json(notification)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
})

router.delete('/:id',auth, async (req, res) => {
    try {
        const { id } = req.params;
        const notification = Notification.findById({ _id: id })
        !notification && res.status(500).json({msg: "Notification not found"})
        const delNotification = await Notification.findByIdAndDelete({_id: id})
        delNotification && res.json(delNotification)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
})

module.exports = router;