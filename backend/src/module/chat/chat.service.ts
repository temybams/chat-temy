import httpStatus from 'http-status';
import { ChatDto, RenameGroupSchemaDto, GroupChatDto, UpdateChatSchemaDto, AddToGroupDto, RemoveFromGroupDto } from '../../dto/chat.dto';
import throwError from '../../utils/error';
import Chat from '../../models/chatModel';
import User from '../../models/userModel';
import { Types } from 'mongoose';
import { RequestUser } from '../../types/request.types';



const ChatService = {
    createChat: async (userId: Types.ObjectId, otherUserId: Types.ObjectId) => {

        let chat = await Chat.findOne({
            isGroupChat: false,
            users: { $all: [userId, otherUserId] },
        }).populate('users', '-password');

        if (!chat) {
            chat = await Chat.create({
                isGroupChat: false,
                users: [userId, otherUserId],
            });
            
            chat = await Chat.findById(chat._id).populate('users', '-password');
        }

        return chat;
    },

    fetchChats: async (userId: Types.ObjectId) => {

        const chats = await Chat.find({ users: userId })
            .populate('users', '-password')
            .populate('latestMessage');

        if (!chats.length) {
            throw throwError('No chats found for this user', httpStatus.NOT_FOUND);
        }

        return chats;
    },

    createGroupChat: async (dto: GroupChatDto, creatorId: Types.ObjectId) => {
        const { users, chatName, groupAdmin } = dto;

        if (!creatorId) {
            throw throwError('User is not authenticated', httpStatus.UNAUTHORIZED);
        }

        
        if (!users.includes(creatorId)) {
            users.push(creatorId);
        }

       
        const existingGroupChat = await Chat.findOne({
            chatName,
            isGroupChat: true,
            users: { $all: users },
        });

        if (existingGroupChat) {
            throw throwError('A group chat with the same name and users already exists', httpStatus.CONFLICT);
        }

        
        const admin = groupAdmin || creatorId;

       
        const groupChat = await Chat.create({
            chatName,
            isGroupChat: true,
            users,
            groupAdmin: admin,
        });

        return groupChat;
    },

    renameGroup: async (dto: RenameGroupSchemaDto, userId: Types.ObjectId) => {
        const { chatId, chatName } = dto;


        const chat = await Chat.findById(chatId);

        if (!chat) {
            throw throwError('Group Chat not found', httpStatus.NOT_FOUND);
        }

        if (!chat.isGroupChat) {
            throw throwError('Cannot rename a one-on-one chat', httpStatus.BAD_REQUEST);
        }
        if (!chat.groupAdmin || chat.groupAdmin.toString() !== userId.toString()) {
            throw throwError('Only the group admin can rename this group chat', httpStatus.FORBIDDEN);
        }

        chat.chatName = chatName;
        await chat.save();

        return chat;

    },

    updateChat: async (dto: UpdateChatSchemaDto) => {
        const { chatId, latestMessage } = dto;

        const chat = await Chat.findOne({ _id: chatId, isGroupChat: false });

        if (!chat) {
            throw throwError('Chat not found', httpStatus.NOT_FOUND);
        }

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { $set: { latestMessage: latestMessage } },
            { new: true, runValidators: true }
        ).populate('users', '-password').populate('latestMessage')

        if (!updatedChat) {
            throw throwError('Error updating chat', httpStatus.INTERNAL_SERVER_ERROR);
        }
        return updatedChat;
    },

    addToGroup: async (dto: AddToGroupDto) => {

        const { chatId, userId } = dto;

        const chat = await Chat.findById(chatId);
        if (!chat) {
            throwError('Group Chat does not exit', httpStatus.NOT_FOUND);
        }

        if (!chat!.isGroupChat) {
            throwError('Only group chats can have members added', httpStatus.BAD_REQUEST);
        }

        const userid = new Types.ObjectId(userId);

        if (chat!.users.includes(userid)) {
            throwError('User is already a member of this group', httpStatus.CONFLICT);
        }


        chat!.users.push(userid);
        const addChat = await chat!.save();

        return addChat;

    },

    removeFromGroup: async (dto: RemoveFromGroupDto) => {
        const { chatId, userId } = dto

        const chat = await Chat.findById(chatId);

        if (!chat) {
            throwError('Group Chat does not exit', httpStatus.NOT_FOUND);
        }

        if (!chat!.isGroupChat) {
            throwError('Only group chats can have members remove', httpStatus.BAD_REQUEST);
        }

        const userid = new Types.ObjectId(userId);

        if (!chat!.users.includes(userid)) {
            throwError('User is not a member of this group', httpStatus.NOT_FOUND);
        }


        chat!.users = chat!.users.filter((id) => id.toString() !== userId.toString())

        const removeChat = await chat!.save();

        return removeChat
    }

}

export default ChatService;
