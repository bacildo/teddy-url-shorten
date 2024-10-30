import { Test, TestingModule } from '@nestjs/testing';
import { CreateUrlDto } from 'src/urls/dto/create-url.dto';
import { UpdateUrlDto } from 'src/urls/dto/update-url.dto';
import { UrlController } from 'src/urls/urls.controller';
import { UrlService } from 'src/urls/urls.service';

describe('UrlController', () => {
  let controller: UrlController;
  let service: UrlService;

  const mockUrlService = {
    shortenUrl: jest.fn(),
    redirectToOriginal: jest.fn(),
    getUrlsByUser: jest.fn(),
    updateOriginalUrl: jest.fn(),
    deleteUrl: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: mockUrlService,
        },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
    service = module.get<UrlService>(UrlService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('shortenUrl', () => {
    it('should shorten a URL', async () => {
      const originalUrl = 'https://example.com';
      const ownerId = 1;
      const shortUrl = 'abc123';

      mockUrlService.shortenUrl.mockResolvedValue(shortUrl);

      const result = await controller.shortenUrl(
        { originalUrl } as CreateUrlDto,
        { user: { id: ownerId } },
      );

      expect(result).toEqual({ shortUrl });
      expect(mockUrlService.shortenUrl).toHaveBeenCalledWith(
        originalUrl,
        ownerId,
      );
    });
  });

  describe('redirectToOriginal', () => {
    it('should redirect to the original URL', async () => {
      const shortUrl = 'abc123';
      const originalUrl = 'https://example.com';

      mockUrlService.redirectToOriginal.mockResolvedValue(originalUrl);

      const result = await controller.redirectToOriginal(shortUrl);

      expect(result).toEqual({ url: originalUrl });
      expect(mockUrlService.redirectToOriginal).toHaveBeenCalledWith(shortUrl);
    });
  });

  describe('getUrlsByUser', () => {
    it('should return an array of URLs for the user', async () => {
      const userId = 1;
      const urls = [{ shortUrl: 'abc123', originalUrl: 'https://example.com' }];

      mockUrlService.getUrlsByUser.mockResolvedValue(urls);

      const result = await controller.getUrlsByUser({ user: { id: userId } });

      expect(result).toEqual(urls);
      expect(mockUrlService.getUrlsByUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('updateOriginalUrl', () => {
    it('should update the original URL', async () => {
      const shortUrl = 'abc123';
      const newOriginalUrl = 'https://newexample.com';

      await controller.updateOriginalUrl(shortUrl, {
        originalUrl: newOriginalUrl,
      } as UpdateUrlDto);

      expect(mockUrlService.updateOriginalUrl).toHaveBeenCalledWith(
        shortUrl,
        newOriginalUrl,
      );
    });
  });

  describe('deleteUrl', () => {
    it('should delete the URL', async () => {
      const shortUrl = 'abc123';

      await controller.deleteUrl(shortUrl);

      expect(mockUrlService.deleteUrl).toHaveBeenCalledWith(shortUrl);
    });
  });
});
