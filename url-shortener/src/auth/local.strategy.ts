import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' }); 
  }

  async validate(login:LoginDto): Promise<any> {
    const user = await this.authService.validateUser(login);
    if (!user) {
      throw new UnauthorizedException(); 
    }
    return user; 
  }
}
