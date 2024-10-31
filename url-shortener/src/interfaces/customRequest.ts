import { Request } from 'express';
import { User } from 'src/auth/user.entity';
import { JwtPayload } from './jwtPayload';

export interface CustomRequest extends Request {
  user?: User & JwtPayload;
}
