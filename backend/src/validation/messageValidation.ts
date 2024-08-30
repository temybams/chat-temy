import { z } from 'zod';

const MessageSchema = z.object({
  sender: z.string().uuid(),
  content: z.string().trim().min(1, "Message content cannot be empty"),
  chat: z.string().uuid(),
  readBy: z.array(z.string().uuid()).optional(),
});

export {MessageSchema}