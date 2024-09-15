import { z } from 'zod';
import { Types } from 'mongoose';
// import User from '../models/userModel';

const ChatSchema = z.object({
    chatName: z.string().trim().min(1, 'Chat name is required'),
    isGroupChat: z.boolean().default(true),
    users: z.array(z.string().refine((id) => Types.ObjectId.isValid(id), {
        message: "User must have a valid ObjectId",
    })).transform((ids) => ids.map((id) => new Types.ObjectId(id))),
    groupAdmin: z.string().refine((id) => Types.ObjectId.isValid(id), {
        message: "Group Admin must have a valid ObjectId",
    }).optional().transform((id) => new Types.ObjectId(id)).optional(),
});

const CreateChatSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
});
const GroupChatSchema = z.object({
    chatName: z.string().trim().min(1, 'Chat name is required'),
    users: z.array(z.string().refine((id) => Types.ObjectId.isValid(id), {
        message: "User must have a valid ObjectId",
    })).min(2, 'At least 2 users are required for a group chat').transform((ids) => ids.map((id) => new Types.ObjectId(id))),
    groupAdmin: z.string().refine((id) => Types.ObjectId.isValid(id), {
        message: "Group Admin must have a valid ObjectId",
    }).optional().transform((id) => new Types.ObjectId(id)).optional(),
});

const RenameGroupSchema = z.object({
    chatId: z.string().min(1, 'Chat ID is required').refine((id) => Types.ObjectId.isValid(id), {
        message: "Invalid Chat ID",
    }),
    chatName: z.string().trim().min(1, 'New chat name is required'),
});

const UpdateChatSchema = z.object({
    chatId: z.string().min(1, 'Chat ID is required').refine((id) => Types.ObjectId.isValid(id), {
        message: "Invalid Chat ID",
    }),
    latestMessage: z.string().refine((id) => Types.ObjectId.isValid(id), {
        message: 'Invalid message ID',
    }).optional(),
});

const AddToGroupSchema = z.object({
    chatId: z.string().min(1, 'Chat ID is required').refine((id) => Types.ObjectId.isValid(id), {
        message: "Invalid Chat ID",
    }),
    userId: z.string().refine((id) => Types.ObjectId.isValid(id), {
        message: "Invalid user ID",
    }),
});

const RemoveFromGroupSchema = z.object({
    chatId: z.string().refine((id) => Types.ObjectId.isValid(id), {
        message: "Invalid chat ID",
    }),
    userId: z.string().refine((id) => Types.ObjectId.isValid(id), {
        message: "Invalid user ID",
    }),
});

export { ChatSchema, CreateChatSchema, GroupChatSchema, RenameGroupSchema, UpdateChatSchema, AddToGroupSchema, RemoveFromGroupSchema } 