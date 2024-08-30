import { Response } from 'express'
import { catchAsync } from '../../middlewares'
import { RequestWithUser } from '../../types/request.types'
import { ChatDto } from '../../dto';
import ChatService from './chat.service';

const ChatController = {

    accessChat: catchAsync(async (req: RequestWithUser, res: Response) => {
        if (!req.user) {
            return res.status(404).send({ message: 'User not authenticated' });
        }

        const chat = await ChatService.accessChat(req.body, req.user);

        res.status(200).json(chat);
    }),

    fetchChats: catchAsync(async (req: RequestWithUser, res: Response) => {
        if (!req.user) {
            return res.status(404).send({ message: 'User not authenticated' });
        }

        const chats = await ChatService.fetchChats(req.user);

        res.status(200).json(chats);
    }),

    createGroupChat: catchAsync(async (req: RequestWithUser, res: Response) => {
        
            // Ensure the user is authenticated
            if (!req.user) {
                return res.status(404).json({ message: "Unauthorized access" });
            }

            const groupChat = await ChatService.createGroupChat(req.body, req.user);

            res.status(200).json(groupChat);
        
    })

}

export default ChatController