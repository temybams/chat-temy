import mongoose, { Schema, Document } from "mongoose";


interface IUser extends Document {
    _id: string;
    fullName: string;
    username: string;
    password: string;
    gender: string;
    profilePic: string;
};

const UserSchema = new Schema<IUser>(
    {
        fullName: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        gender: {
            type: String,
            required: true,
            enum: ['male', 'female']
        },
        profilePic: {
            type: String,
            default: ""
        }


    },
    { timestamps: true },
);


const User = mongoose.model<IUser>('User', UserSchema);

export default User;