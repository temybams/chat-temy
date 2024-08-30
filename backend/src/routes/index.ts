import express from 'express'
import AuthRouter from '../module/Auth/auth.router'
import ChatRouter from '../module/chat/chat.router'

const router = express.Router()

router.use('/auth', AuthRouter)
router.use('/chat', ChatRouter)

export default router