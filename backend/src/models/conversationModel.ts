import mongoose, { Schema, Document } from 'mongoose';

interface IConversation extends Document {
    participants: mongoose.Types.ObjectId[];
    messages: mongoose.Types.ObjectId[];     
}


const ConversationSchema = new Schema<IConversation>(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',

            }
        ],

        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Message',
                default: [],
            }
        ]

    },
    { timestamps: true }
);

const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
export default Conversation;