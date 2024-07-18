import { Request, Response } from "express";
import User from "../models/userModel";
import bcryptjs from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generatetoken";

export const signup = async (req: Request, res: Response) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password does not match." })

        }
        const user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ message: "This username already exists." })
        }
        //hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const boyprofilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === 'male' ? boyprofilePic : girlProfilePic,
        });

        if (newUser) {


            //generate Jwt token
            generateTokenAndSetCookie(newUser._id, res);

            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic
            })
        } else {
            res.status(400).json({ message: 'Invalid user data' })

        }
    } catch (error: any) {
        console.log('Error in signup controller', error.message)
        res.status(500).json({ error: 'internal server error' });
    }

};


export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcryptjs.compare(password, user?.password || '');

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: 'Invalidusername or password' })
        }

        generateTokenAndSetCookie(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullname: user.fullName,
            username: user.username,
            profilepic: user.profilePic

        })
    } catch (error: any) {
        console.log('Error in login controller', error.message)
        res.status(500).json({ error: 'internal server error' });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        res.cookie('jwt', "", { maxAge: 0 })
        res.status(200).json({ message: 'Logged out successfully' })
    } catch (error: any) {
        console.log('Error in logout controller', error.message)
        res.status(500).json({ error: 'internal server error' });
    }
};



