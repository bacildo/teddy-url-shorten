import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@ApiBearerAuth('bearer')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto, description: 'Data for user registry' })
  @ApiResponse({ status: 201, description: 'User created.' })
  @ApiResponse({ status: 400, description: 'Invalid Data.' })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<void> {
    return this.authService.register(registerDto.email, registerDto.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto, description: 'Login data (email e senha)' })
  @ApiResponse({ status: 201, description: 'User authenticated.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() login: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(login);
  }
}
