import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
    });
    await this.usersRepository.save(user);
  }

  async validateUser(login: LoginDto): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { email: login.email },
    });
    if (user && (await bcrypt.compare(login.password, user.password))) {
      return user;
    }
    return null;
  }

  async findUserById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ id });
  }

  async login(login: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.validateUser(login);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
