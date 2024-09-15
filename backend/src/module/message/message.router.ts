import express from 'express'
import { validationMiddleware, authMiddleware } from '../../middlewares'
import { MessageSchema, AllMessageSchema } from '../../validation/messageValidation'
import MessageController from './message.controller'

const MessageRouter = express.Router()

MessageRouter.post('/', authMiddleware, validationMiddleware(MessageSchema), MessageController.createMessageController)
MessageRouter.get('/:chatId', authMiddleware, MessageController.getMessageController);


export default MessageRouter