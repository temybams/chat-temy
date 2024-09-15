import throwError from '../../utils/error';
import httpStatus from 'http-status';
import { RequestUser } from '../../types/request.types';
import { MessageDto, AllMessageDto } from '../../dto';
import Message from '../../models/messageModel';
import Chat from '../../models/chatModel';


const MessageService = {
  createMessage: async (dto: MessageDto, user: RequestUser) => {
    const { content, chat } = dto;

    if (!chat || !content) {
      throw throwError('Invalid data passed into request', httpStatus.BAD_REQUEST);
    }

    const chatExists = await Chat.findById(chat);
    if (!chatExists) {
      throw throwError('Chat not found', httpStatus.NOT_FOUND);
    }


    const newMessage = await Message.create({
      content,
      chat,
      sender: user._id
    });

    chatExists.latestMessage = newMessage._id;
    await chatExists.save();


    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'fullname')
      .populate('chat');

    return populatedMessage;
  },

  allMessages: async (dto: AllMessageDto) => {

    const { chatId } = dto;

    const chatExists = await Chat.findById(chatId);
    if (!chatExists) {
      throw throwError('Chat not found', httpStatus.NOT_FOUND);
    }

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'fullname')
      .populate('chat');

    return messages;
  }
}


export default MessageService