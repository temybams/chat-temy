import { z } from 'zod'
import { MessageSchema, AllMessageSchema } from '../validation/messageValidation';

type MessageDto = z.infer<typeof MessageSchema>;
type AllMessageDto = z.infer<typeof AllMessageSchema>;

export { MessageDto, AllMessageDto };