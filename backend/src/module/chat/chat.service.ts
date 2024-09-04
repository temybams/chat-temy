import httpStatus from 'http-status';
import { ChatDto } from '../../dto';
import throwError from '../../utils/error';
import Chat from '../../models/chatModel';
import User from '../../models/userModel';
import { Types } from 'mongoose';
import { RequestUser } from '../../types/request.types';



const ChatService = {
    createChat: async (userId: Types.ObjectId, otherUserId: Types.ObjectId) => {

        try {
            let chat = await Chat.findOne({
                isGroupChat: false,
                users: { $all: [userId, otherUserId] },
            }).populate('users', '-password');

            if (!chat) {
                // If not, create a new one-on-one chat
                chat = await Chat.create({
                    isGroupChat: false,
                    users: [userId, otherUserId],
                });
            }

            return chat;
        } catch (error) {
            console.error('Error creating chat:', error);
            throwError('Error creating chat', httpStatus.INTERNAL_SERVER_ERROR);
        }
    },

    fetchChats: async (userId: Types.ObjectId) => {
        try {
            // Fetch chats where the user is a participant
            const chats = await Chat.find({
                users: userId
            }).populate('users', '-password');

            if (!chats.length) {
                throwError('No chats found for this user', httpStatus.NOT_FOUND);
            }

            return chats;
        } catch (error) {
            console.error('Error fetching chats:', error);
            throwError('Error fetching chats', httpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

export default ChatService;
