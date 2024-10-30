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

  it('deve estar definido', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('deve chamar o AuthService para registrar um novo usuário', async () => {
      const email = 'test@example.com';
      const password = 'testPassword';
      await authController.register(email, password);

      expect(authService.register).toHaveBeenCalledWith(email, password);
    });
  });

  describe('login', () => {
    it('deve chamar o AuthService para login e retornar um token JWT', async () => {
      const email = 'test@example.com';
      const password = 'testPassword';
      const accessToken = { accessToken: 'testToken' };
      mockAuthService.login.mockResolvedValue(accessToken);

      const result = await authController.login(email, password);

      expect(authService.login).toHaveBeenCalledWith(email, password);
      expect(result).toEqual(accessToken);
    });
  });
});
