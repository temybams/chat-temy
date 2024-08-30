import { z } from 'zod'
import { ChatSchema } from '../validation/chatValidation'

type ChatDto = z.infer<typeof ChatSchema>;

export { ChatDto }