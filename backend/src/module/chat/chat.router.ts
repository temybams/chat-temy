import express from 'express'
import { validationMiddleware, authMiddleware } from '../../middlewares'
import ChatController from '../chat/chat.controller'
import { CreateChatSchema } from '../../validation/chatValidation'



const ChatRouter = express.Router()

ChatRouter.post('/', authMiddleware, validationMiddleware(CreateChatSchema), ChatController.createChatController);
ChatRouter.get('/', authMiddleware, ChatController.fetchChatsController);
// ChatRouter.post('/group', authMiddleware, ChatController.createGroupChat);
// ChatRouter.put('/rename', authMiddleware, renameGroup);
// ChatRouter.put('/groupremove', authMiddleware, removeFromGroup);
// ChatRouter.get('/groupadd', authMiddleware, addToGroup)

export default ChatRouter