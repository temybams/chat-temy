import * as argon from 'argon2'
import httpStatus from 'http-status'
import JWTService from '../../services/jwtServices'
import { SignupDto, LoginDto } from '../../dto'
import throwError from '../../utils/error'
import User from '../../models/userModel'
import {RequestWithUser} from '../../types/request.types'

const AuthService = {
    signup: async (dto: SignupDto) => {

        const { fullname, email, password, gender, profilePic } = dto;

        let user = await User.findOne({ email})
        if (user) {
            return throwError('User already exists', httpStatus.CONFLICT)
        }

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${email}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${email}`;

        const hashedPassword = await argon.hash(password);

        user = new User({
            fullname,
            email,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic,

        })


        await user.save();


    },

    login: async (dto: LoginDto) => {
        const { email, password } = dto;
        let user = await User.findOne({ email })

        if (!user) {
            return throwError('Invalid credentials', httpStatus.NOT_FOUND)
        }

        const valid = await argon.verify(user.password, dto.password)

        if (!valid) {
            return throwError('Invalid credentials', httpStatus.NOT_ACCEPTABLE)
        }

        const token = JWTService.sign({ sub: user.id })

        return token
    },

    allUsers: async (req: RequestWithUser) => {
        const keyword = req.query.search
            ? {
                $or: [
                    { fullname: { $regex: req.query.search, $options: "i" } },
                    { email: { $regex: req.query.search, $options: "i" } },
                ],
            }
            : {};

        const users = await User.find(keyword).find({ _id: { $ne: req.user?._id } });
        return users;
    },
}
export default AuthService