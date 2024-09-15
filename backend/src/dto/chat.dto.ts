import { z } from 'zod'
import { ChatSchema,GroupChatSchema,  RenameGroupSchema, UpdateChatSchema, AddToGroupSchema, RemoveFromGroupSchema} from '../validation/chatValidation'

type ChatDto = z.infer<typeof ChatSchema>;
type GroupChatDto = z.infer<typeof GroupChatSchema>;
type RenameGroupSchemaDto = z.infer<typeof RenameGroupSchema>
type UpdateChatSchemaDto = z.infer<typeof UpdateChatSchema>
type AddToGroupDto = z.infer<typeof AddToGroupSchema>;
type RemoveFromGroupDto = z.infer<typeof RemoveFromGroupSchema>;


export { ChatDto, GroupChatDto, RenameGroupSchemaDto, UpdateChatSchemaDto, AddToGroupDto ,  RemoveFromGroupDto}