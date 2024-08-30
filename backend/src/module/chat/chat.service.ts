import httpStatus from 'http-status';
import { ChatDto } from '../../dto';
import throwError from '../../utils/error';
import Chat from '../../models/chatModel';
import { Types } from 'mongoose';
import { RequestUser } from '../../types/request.types';

const ChatService = {

    accessChat: async (dto: ChatDto, user: RequestUser) => {
        const { users } = dto;
        const otherUserId = users[0];

        try {
            let chat = await Chat.findOne({
                isGroupChat: false,
                users: { $all: [user._id, otherUserId] },
            })
                .populate('users', '-password')
                .populate('latestMessage');

            if (!chat) {
                chat = await Chat.create({
                    chatName: 'sender',
                    isGroupChat: false,
                    users: [user._id, otherUserId],
                });
                chat = await Chat.findById(chat._id)
                    .populate('users', '-password')
                    .populate('latestMessage');
            }

            return chat;
        } catch (error: any) {
            throwError(error.message, httpStatus.BAD_REQUEST);
        }
    },

    fetchChats: async (user: RequestUser) => {
        try {
            const chats = await Chat.find({ users: { $elemMatch: { $eq: user._id } } })
                .populate('users', '-password')
                .populate('groupAdmin', '-password')
                .populate('latestMessage')
                .sort({ updatedAt: -1 });

            return chats;
        } catch (error: any) {
            throwError(error.message, httpStatus.BAD_REQUEST);
        }
    },

    createGroupChat: async (dto: ChatDto, user: RequestUser) => {
        const { chatName, users } = dto;

        if (!users || !chatName) {
            throwError("Please fill all the fields", httpStatus.BAD_REQUEST);
        }

        if (users.length < 2) {
            throwError("More than 2 users are required to form a group chat", httpStatus.BAD_REQUEST);
        }

        // Convert all user IDs to ObjectId type
        const objectIdUsers = users.map(id => {
            if (typeof id === 'string') {
                return new Types.ObjectId(id);
            }
            throwError("Invalid user ID format", httpStatus.BAD_REQUEST);
        });

        // Add the current user to the list
        objectIdUsers.push(user._id);

        try {
            const groupChat = await Chat.create({
                chatName,
                users: objectIdUsers,
                isGroupChat: true,
                groupAdmin: user._id,
            });

            return await Chat.findOne({ _id: groupChat._id })
                .populate('users', '-password')
                .populate('groupAdmin', '-password');
        } catch (error: any) {
            throwError(error.message, httpStatus.BAD_REQUEST);
        }
    }

};

export default ChatService;
