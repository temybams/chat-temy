import { Request, Response } from 'express'
import catchAsync from '../../middlewares/catchAsync'
import { LoginDto, SignupDto } from '../../dto'
import AuthService from './auth.service'
import { RequestWithUser } from '../../types/request.types'



const AuthController = {
    signup: catchAsync(async (req: Request, res: Response) => {
        await AuthService.signup(req.body as SignupDto)
        res.status(201).json({
            success: true,
            message: 'User created successfully',
        })
    }),

    login: catchAsync(async (req: Request, res: Response) => {
        const token = await AuthService.login(req.body as LoginDto)
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: {
                token,
            },
        })
    }),


    allUsers: catchAsync(async (req: RequestWithUser, res: Response) => {
        const users = await AuthService.allUsers(req);
        res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            data: users,
        });
    }),


}


export default AuthController