import { Request } from 'express';
import { User } from 'src/auth/user.entity';

export interface CustomRequest extends Request {
  user?: User;
}
