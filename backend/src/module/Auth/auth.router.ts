import express from 'express'
import AuthController from './auth.controller'
import { validationMiddleware, authMiddleware } from '../../middlewares'
import { SignupSchema, LoginSchema } from '../../validation/userValidation'


const AuthRouter = express.Router()

AuthRouter.get('/', authMiddleware, AuthController.allUsers)

AuthRouter.post(
    '/register',
    validationMiddleware(SignupSchema),
    AuthController.signup,
)

AuthRouter.post(
    '/login',
    validationMiddleware(LoginSchema),
    AuthController.login,
)

export default AuthRouter