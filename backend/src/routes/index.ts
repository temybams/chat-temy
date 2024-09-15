import express from 'express'
import AuthRouter from '../module/Auth/auth.router'
import ChatRouter from '../module/chat/chat.router'
import MessageRouter from '../module/message/message.router'

const router = express.Router()

router.use('/auth', AuthRouter)
router.use('/chat', ChatRouter)
router.use('/message', MessageRouter)

export default router