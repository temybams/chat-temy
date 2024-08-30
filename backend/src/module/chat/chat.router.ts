import express from 'express'
import { validationMiddleware, authMiddleware } from '../../middlewares'
import ChatController from '../chat/chat.controller'



const ChatRouter = express.Router()

ChatRouter.post('/', authMiddleware, ChatController.accessChat);
ChatRouter.get('/', authMiddleware, ChatController.fetchChats);
ChatRouter.post('/group', authMiddleware, ChatController.createGroupChat);
// ChatRouter.put('/rename', authMiddleware, renameGroup);
// ChatRouter.put('/groupremove', authMiddleware, removeFromGroup);
// ChatRouter.get('/groupadd', authMiddleware, addToGroup)

export default ChatRouter