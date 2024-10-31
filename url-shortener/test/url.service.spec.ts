import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { UrlService } from 'src/urls/urls.service';
import { Url } from 'src/urls/url.entity';
import { Click } from 'src/urls/click.entity';

jest.mock('uuid', () => ({
  v4: () => 'mock-uuid-123456789',
}));

describe('UrlService', () => {
  let service: UrlService;

  const mockUrlRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
  };

  const mockClickRepository = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: getRepositoryToken(Url),
          useValue: mockUrlRepository,
        },
        {
          provide: getRepositoryToken(Click),
          useValue: mockClickRepository,
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('shortenUrl', () => {
    it('should shorten a URL', async () => {
      const originalUrl = 'https://example.com';
      const ownerId = 1;
      const shortUrl = 'mock-u';

      mockUrlRepository.create.mockReturnValue({ originalUrl, shortUrl });
      mockUrlRepository.save.mockResolvedValue({ originalUrl, shortUrl });

      const result = await service.shortenUrl(originalUrl, ownerId);

      expect(result).toEqual(shortUrl);
      expect(mockUrlRepository.create).toHaveBeenCalledWith({
        originalUrl,
        shortUrl,
        owner: { id: ownerId },
      });
      expect(mockUrlRepository.save).toHaveBeenCalled();
    });
  });

  describe('redirectToOriginal', () => {
    it('should return the original URL', async () => {
      const shortUrl = 'abc123';
      const originalUrl = 'https://example.com';
      const url = { originalUrl, shortUrl };

      mockUrlRepository.findOne.mockResolvedValue(url);
      mockClickRepository.save.mockResolvedValue(undefined);

      const result = await service.redirectToOriginal(shortUrl);

      expect(result).toEqual(originalUrl);
      expect(mockClickRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if URL not found', async () => {
      mockUrlRepository.findOne.mockResolvedValue(null);

      await expect(
        service.redirectToOriginal('invalidShortUrl'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUrlsByUser', () => {
    it('should return an array of URLs', async () => {
      const userId = 1;
      const urls = [
        { id: 1, originalUrl: 'https://example.com', shortUrl: 'abc123' },
      ];

      mockUrlRepository.find.mockResolvedValue(urls);

      const result = await service.getUrlsByUser(userId);

      expect(result).toEqual(urls);
      expect(mockUrlRepository.find).toHaveBeenCalledWith({
        where: { owner: { id: userId }, deletedAt: null },
        relations: ['clicks'],
      });
    });
  });

  describe('updateOriginalUrl', () => {
    it('should update the original URL', async () => {
      const shortUrl = 'abc123';
      const newOriginalUrl = 'https://newexample.com';
      const url = { shortUrl, originalUrl: 'https://example.com' };

      mockUrlRepository.findOne.mockResolvedValue(url);
      mockUrlRepository.save.mockResolvedValue({
        ...url,
        originalUrl: newOriginalUrl,
      });

      await service.updateOriginalUrl(shortUrl, newOriginalUrl);

      expect(mockUrlRepository.save).toHaveBeenCalledWith({
        ...url,
        originalUrl: newOriginalUrl,
      });
    });

    it('should throw NotFoundException if URL not found', async () => {
      mockUrlRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateOriginalUrl('invalidShortUrl', 'newUrl'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUrl', () => {
    it('should delete the URL', async () => {
      const shortUrl = 'abc123';
      const url = { shortUrl, deletedAt: null };

      mockUrlRepository.findOne.mockResolvedValue(url);
      mockUrlRepository.save.mockResolvedValue({
        ...url,
        deletedAt: new Date(),
      });

      await service.deleteUrl(shortUrl);

      expect(mockUrlRepository.save).toHaveBeenCalledWith({
        ...url,
        deletedAt: expect.any(Date),
      });
    });

    it('should throw NotFoundException if URL not found', async () => {
      mockUrlRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteUrl('invalidShortUrl')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
