import { Request, Response } from 'express'
import { catchAsync } from '../../middlewares'
import { RequestWithUser } from '../../types/request.types'
import { ChatDto } from '../../dto';
import ChatService from './chat.service';
import { Types } from 'mongoose';


const ChatController = {
    createChatController: catchAsync(async (req: RequestWithUser, res: Response) => {

        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        const chat = await ChatService.createChat(req.user!._id, userId);
        res.status(201).json({ success: true, message: "Chat created successfully", data: chat });
    }),

    fetchChatsController: catchAsync(async (req: RequestWithUser, res: Response) => {

        const userId = req.user!._id;

        const chats = await ChatService.fetchChats(userId);

        res.status(200).json({ success: true, message: "Chat fetched successfully", data: chats });
    })
}

export default ChatController