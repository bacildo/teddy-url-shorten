import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' }); // Define o campo de email como o campo de username
  }

  async validate(login:LoginDto): Promise<any> {
    const user = await this.authService.validateUser(login);
    if (!user) {
      throw new UnauthorizedException(); // Lança um erro se o usuário não for encontrado
    }
    return user; // Retorna o usuário validado
  }
}
