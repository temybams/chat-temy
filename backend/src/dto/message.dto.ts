import { z } from 'zod'
import { MessageSchema } from '../validation/messageValidation';


type MessageDto = z.infer<typeof MessageSchema>;

export {  MessageDto };