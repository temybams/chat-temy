import { Request } from 'express'
import { IUser } from '../models/userModel'


type RequestUser = Omit<IUser, 'password'>

type RequestWithUser = Request & {
    user?: RequestUser
}

export { RequestUser, RequestWithUser }
