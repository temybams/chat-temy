import { z } from 'zod';
import { Types } from 'mongoose';

const ChatSchema = z.object({
    chatName: z.string().trim().optional(),
    isGroupChat: z.boolean().default(false),
    users: z.array(z.instanceof(Types.ObjectId)),
    latestMessage: z.string().uuid().optional(),
    groupAdmin: z.string().uuid().optional(),
});

const CreateChatSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
});
export { ChatSchema, CreateChatSchema} 