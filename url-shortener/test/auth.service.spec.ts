import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/user.entity';

describe('AuthService', () => {
  let authService: AuthService;

  const mockUserRepository = {
    create: jest.fn().mockImplementation((user) => user),
    save: jest.fn(),
    findOne: jest.fn() as jest.MockedFunction<
      (options: any) => Promise<User | null>
    >,
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('testToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('deve estar definido', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('deve criar e salvar um usuário com senha hash', async () => {
      const password = 'testPassword';
      const hashedPassword = await bcrypt.hash(password, 10);

      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce(hashedPassword as never);
      await authService.register('test@example.com', password);

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: hashedPassword,
      });
      expect(mockUserRepository.save).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('deve retornar um token JWT para credenciais válidas', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      } as User;

      mockUserRepository.findOne.mockResolvedValueOnce(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never);

      const loginDto = { email: 'example@test.com', password: '12345' };
      const result = await authService.login(loginDto);

      expect(result).toEqual({ accessToken: 'testToken' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: 'test@example.com',
        sub: user.id,
      });
    });

    it('deve lançar um UnauthorizedException para credenciais inválidas', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce(null);
      const loginDto = { email: 'example.com', password: '213123' };
      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
