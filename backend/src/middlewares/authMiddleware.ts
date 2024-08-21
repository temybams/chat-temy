import httpStatus from 'http-status';
import { Response, NextFunction } from 'express';
import User from '../models/userModel';
import { RequestWithUser } from '../types/request.types';
import JwtService from '../services/jwtServices';
import throwError from '../utils/error';
import catchAsync from './catchAsync';

const authMiddleware = catchAsync(
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
       
        let token: string | undefined;
        let type: string | undefined;
        [type, token] = req.headers.authorization?.split(' ') ?? [];

        if (type !== 'Bearer' || !token) {
            return throwError('Unauthorized', httpStatus.UNAUTHORIZED);
        }

        const decoded = JwtService.verify(token) as { sub: string };

        if (!decoded) {
            return throwError('Unauthorized', httpStatus.UNAUTHORIZED);
        }

        const user = await User.findById(decoded.sub);

        if (!user) {
            return throwError('Unauthorized', httpStatus.UNAUTHORIZED);
        }

        req.user = user;

        next();
    }
);

export default authMiddleware;
