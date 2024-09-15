import { Response } from 'express'
import { catchAsync } from '../../middlewares'
import { RequestWithUser } from '../../types/request.types'
import { ChatDto, RenameGroupSchemaDto, GroupChatDto, UpdateChatSchemaDto, AddToGroupDto, RemoveFromGroupDto } from '../../dto/chat.dto';
import ChatService from './chat.service';
import { Types } from 'mongoose';
import { ZodCatch } from 'zod';


const ChatController = {
    createChatController: catchAsync(async (req: RequestWithUser, res: Response) => {

        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        const chat = await ChatService.createChat(req.user!._id, userId);
        res.status(201).json({
            success: true,
            message: 'Chat created successfully',
            data: chat,
        });
    }),

    fetchChatsController: catchAsync(async (req: RequestWithUser, res: Response) => {

        const userId = req.user!._id;

        const chats = await ChatService.fetchChats(userId);

        res.status(200).json({
            success: true,
            message: 'Chats fetched successfully',
            data: chats,
        });
    }),

    createGroupChatController: catchAsync(async (req: RequestWithUser, res: Response) => {
        const creatorId = req.user?._id!;

        const groupChat = await ChatService.createGroupChat(
            req.body as GroupChatDto,
            creatorId
        );

        res.status(201).json({
            success: true,
            message: 'Group chat created successfully',
            data: {
                groupChat,
            }
        });
    }),

    renameGroupController: catchAsync(async (req: RequestWithUser, res: Response) => {


        const userId = req.user!._id
        // console.log('Authenticated user:',userId);

        const updatedChat = await ChatService.renameGroup(
            req.body as RenameGroupSchemaDto,
            userId
        );

        res.status(200).json({
            success: true,
            message: 'Group chat renamed successfully',
            data: updatedChat,
        });
    }),

    updateChatController: catchAsync(async (req: RequestWithUser, res: Response) => {

        const updatedChat = await ChatService.updateChat(
            req.body as UpdateChatSchemaDto
        );

        res.status(200).json({
            success: true,
            message: 'Chat updated successfully',
            data: updatedChat,
        });
    }),

    addToGroupController: catchAsync(async (req: RequestWithUser, res: Response) => {
        const addChat = await ChatService.addToGroup(
            req.body as AddToGroupDto
        );

        res.status(200).json({
            success: true,
            message: "User added to the group successfully",
            data: addChat,
        });

    }),

    removeFromGroupController: catchAsync(async (req: RequestWithUser, res: Response) => {
        const removeChat = await ChatService.removeFromGroup(
            req.body as RemoveFromGroupDto 
        )
    })
}

export default ChatController