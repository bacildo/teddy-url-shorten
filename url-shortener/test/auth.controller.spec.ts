import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should call AuthService to register a new user', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'testPassword',
      };
      await authController.register(registerDto);
      expect(authService.register).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.password,
      );
    });
  });

  describe('login', () => {
    it('should call AuthService to log in and return a JWT token', async () => {
      const accessToken = { accessToken: 'testToken' };
      mockAuthService.login.mockResolvedValue(accessToken);
      const loginDto = { email: 'test@example.com', password: 'testPassword' };
      const result = await authController.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(accessToken);
    });
  });
});
