import { Request } from 'express'
import { SignupDto } from '../dto'
import { Types } from 'mongoose'; 


type RequestUser = Omit<SignupDto, 'password'> & { _id: Types.ObjectId }

type RequestWithUser = Request & {
    user?: RequestUser
}

export { RequestUser, RequestWithUser }
