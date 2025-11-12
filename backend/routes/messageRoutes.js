import express from 'express'
import { fetchMessage, sendMessage } from '../controllers/message.js'
import upload from '../middleware/upload.js'


const messageRouter = express.Router()

messageRouter.post("/send",upload.single("image"),sendMessage)
messageRouter.get("/:userId/:receiverId",fetchMessage)

export default messageRouter