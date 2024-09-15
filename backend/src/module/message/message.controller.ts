import { Response } from 'express'
import { catchAsync } from '../../middlewares'
import { RequestWithUser } from '../../types/request.types'
import MessageService from './message.service'
import { MessageDto, AllMessageDto } from '../../dto'

const MessageController = {
    createMessageController: catchAsync(async (req: RequestWithUser, res: Response) => {

        const senderId = req.user!;

        // console.log('Authenticated user:', senderId);

        const message = await MessageService.createMessage(
            req.body as MessageDto,
            senderId

        );

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: message
        });

    }),

    getMessageController: catchAsync(async (req: RequestWithUser, res: Response) => {
        // console.log('Request params:', req.params); 
        const { chatId } = req.params;
        

        const messages = await MessageService.allMessages(
            { chatId } as AllMessageDto
        );

        res.status(200).json({
            success: true,
            message: 'Messages retrieved successfully',
            data: messages,
        });
    })
}

export default MessageController