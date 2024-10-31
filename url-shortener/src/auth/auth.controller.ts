import { Controller, Post, Body, Inject } from '@nestjs/common';
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
import { customLogger } from '../utils/logger'; 

@ApiTags('auth')
@ApiBearerAuth('bearer')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject('Logger') private readonly logger: typeof customLogger, 
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto, description: 'Data for user registry' })
  @ApiResponse({ status: 201, description: 'User created.' })
  @ApiResponse({ status: 400, description: 'Invalid Data.' })
  async register(@Body() registerDto: RegisterDto): Promise<void> {
    this.logger.log(`Registering user with email: ${registerDto.email}`); 
    try {
      await this.authService.register(registerDto.email, registerDto.password);
      this.logger.log('User registered successfully'); 
    } catch (error) {
      this.logger.error(`Error registering user: ${error.message}`); 
      throw error; 
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto, description: 'Login data (email and password)' })
  @ApiResponse({ status: 201, description: 'User authenticated.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() login: LoginDto): Promise<{ accessToken: string }> {
    this.logger.log(`Attempting to log in user with email: ${login.email}`); 
    try {
      const accessToken = await this.authService.login(login);
      this.logger.log('User logged in successfully'); 
      return accessToken;
    } catch (error) {
      this.logger.error(`Login failed for user ${login.email}: ${error.message}`); 
      throw error; 
    }
  }
}
