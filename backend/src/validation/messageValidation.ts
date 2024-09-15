import { z } from 'zod';
import { Types } from 'mongoose';

const MessageSchema = z.object({
  content: z.string().trim().min(1, "Message content cannot be empty"),
  chat: z.string().refine((id) => Types.ObjectId.isValid(id), {
    message: 'Invalid chat ID',
  }),
});

const AllMessageSchema = z.object({
  chatId: z.string().refine((id) => Types.ObjectId.isValid(id), {
    message: 'Invalid chat ID',
  }),
})


export { MessageSchema, AllMessageSchema }