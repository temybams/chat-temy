import express from 'express'
import { validationMiddleware, authMiddleware } from '../../middlewares'
import ChatController from '../chat/chat.controller'
import { AddToGroupSchema, ChatSchema, CreateChatSchema, GroupChatSchema, RenameGroupSchema, UpdateChatSchema, RemoveFromGroupSchema } from '../../validation/chatValidation'



const ChatRouter = express.Router()

ChatRouter.post('/', authMiddleware, validationMiddleware(CreateChatSchema), ChatController.createChatController);
ChatRouter.get('/', authMiddleware, ChatController.fetchChatsController);
ChatRouter.post('/group', authMiddleware, validationMiddleware(GroupChatSchema), ChatController.createGroupChatController);
ChatRouter.put('/rename', authMiddleware, validationMiddleware(RenameGroupSchema), ChatController.renameGroupController);
ChatRouter.put('/update', authMiddleware, validationMiddleware(UpdateChatSchema), ChatController.updateChatController);
ChatRouter.put('/groupremove', authMiddleware, validationMiddleware(RemoveFromGroupSchema), ChatController.removeFromGroupController);
ChatRouter.put('/groupadd', authMiddleware, validationMiddleware(AddToGroupSchema), ChatController.addToGroupController)

export default ChatRouter