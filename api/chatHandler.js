const { Router } = require('express')
const { auth } = require('../middleware')
const Chat = require('../models/chatMessage')
const router = Router()

router.get('/all',auth, async (req,res) => {
    const chats = await Chat.find({});
    res.json(chats)
})

router.get('/deleteall',auth, async (req,res) => {
    const chats = await Chat.remove();
    const chat = await Chat.find({})
    res.json(chat)
})


router.get('/:boardID',auth, async (req,res) => {
    const { boardID } = req.params;
    if (!boardID || boardID === undefined){
        return res.status(502).json({msg: "Invalid Board"})
    }
    const chats = await Chat.find({boardID: boardID}).sort({$natural: -1}).limit(5)

    if (!chats)
    return res.status(400).json({msg: "No chat found"})

    res.json(chats.reverse())
})

router.post('/:boardID',async (req,res) => {
    const { UserID, UserName, text } = req.body;
    const { boardID } = req.params;

    if(!UserID && !UserName && !text && !boardID){
        return res.status(400).json({msg:  "Fill all the fiels"})
    }

    const newChat = new Chat({ UserID, UserName, boardID, text})

    const chat = await newChat.save()

    if(!chat){
        return res.status(500).json({msg: "sorry, but Something goes wrong!"})
    }
    res.json(chat)
})

router.delete('/:chatID',async (req,res) => {
    const { chatID } = req.params;

    if(!chatID){
        return res.status(400).json({msg:  "Invalid Chat ID"})
    }

    const delchat = await Chat.findById({_id: chatID})

    if(!delchat){
        return res.status(500).json({msg: "Chat not found to delete"})
    }
    
    const deletedchat = await Chat.findByIdAndDelete({_id: chatID})
    res.json(deletedchat)
})

module.exports = router