import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomRequest } from 'src/interfaces/customRequest';
import { UrlService } from '../urls/urls.service';
import { customLogger } from '../utils/logger';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';

@ApiTags('url')
@ApiBearerAuth('bearer')
@Controller('url')
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    @Inject('Logger') private readonly logger: typeof customLogger,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('shorten')
  @ApiOperation({ summary: 'URL Shorten' })
  @ApiBody({ type: CreateUrlDto, description: 'URL data to be shortened.' })
  @ApiResponse({ status: 201, description: 'Successfully shortened URL.' })
  @ApiResponse({ status: 400, description: 'Error shortening URL.' })
  async shortenUrl(
    @Body() createUrlDto: CreateUrlDto,
    @Req() req: CustomRequest,
  ): Promise<{ shortUrl: string }> {
    const ownerId = req.user?.id;
    this.logger.log(
      `User ${ownerId} is shortening a URL: ${createUrlDto.originalUrl}`,
    );
    const shortUrl = await this.urlService.shortenUrl(
      createUrlDto.originalUrl,
      ownerId,
    );
    const baseUrl = 'http://localhost:3000/url';
    const fullShortUrl = `${baseUrl}/${shortUrl}`;
    this.logger.log(`Shortened URL created: ${fullShortUrl}`);
    return { shortUrl: fullShortUrl };
  }

  @Post('no-auth/shorten/')
  @ApiOperation({ summary: 'URL Shorten' })
  @ApiBody({ type: CreateUrlDto, description: 'URL data to be shortened.' })
  @ApiResponse({ status: 201, description: 'Successfully shortened URL.' })
  @ApiResponse({ status: 400, description: 'Error shortening URL.' })
  async shortenUrlNoAuth(
    @Body() createUrlDto: CreateUrlDto,
  ): Promise<{ shortUrl: string }> {
    this.logger.log(
      `Shortening URL without authentication: ${createUrlDto.originalUrl}`,
    );
    const shortUrl = await this.urlService.shortenUrl(createUrlDto.originalUrl);
    const baseUrl = 'http://localhost:3000/url';
    const fullShortUrl = `${baseUrl}/${shortUrl}`;
    this.logger.log(`Shortened URL created without auth: ${fullShortUrl}`);
    return { shortUrl: fullShortUrl };
  }

  @Get(':shortUrl')
  @Redirect()
  @ApiOperation({ summary: 'Redirect to original URL.' })
  @ApiResponse({
    status: 302,
    description: 'Redirecting to original URL.',
  })
  async redirectToOriginal(
    @Param('shortUrl') shortUrl: string,
  ): Promise<{ url: string }> {
    this.logger.log(`Redirecting to original URL for short URL: ${shortUrl}`);
    const originalUrl = await this.urlService.redirectToOriginal(shortUrl);
    this.logger.log(`Redirected to original URL: ${originalUrl}`);
    return { url: originalUrl };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Get authenticated users URLs.' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved URLs.' })
  async getUrlsByUser(@Req() req: CustomRequest) {
    const ownerId = req.user.id;
    this.logger.log(`Fetching URLs for user ${ownerId}`);
    const urls = await this.urlService.getUrlsByUser(ownerId);
    this.logger.log(
      `Successfully retrieved URLs for user ${ownerId}: ${urls.length} URLs found`,
    );
    return urls;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':shortUrl')
  @ApiOperation({ summary: 'Update original URL.' })
  @ApiBody({
    type: UpdateUrlDto,
    description: 'Original URL updated successfully.',
  })
  @ApiResponse({
    status: 200,
    description: 'Original URL updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'URL not found.' })
  async updateOriginalUrl(
    @Param('shortUrl') shortUrl: string,
    @Body() updateUrlDto: UpdateUrlDto,
  ) {
    this.logger.log(
      `Updating original URL for short URL: ${shortUrl} with new URL: ${updateUrlDto.originalUrl}`,
    );
    await this.urlService.updateOriginalUrl(shortUrl, updateUrlDto.originalUrl);
    this.logger.log(
      `Original URL updated successfully for short URL: ${shortUrl}`,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':shortUrl')
  @ApiOperation({ summary: 'Delete shortened URL' })
  @ApiResponse({ status: 200, description: 'URL deleted successfully.' })
  @ApiResponse({ status: 404, description: 'URL not found.' })
  async deleteUrl(@Param('shortUrl') shortUrl: string) {
    this.logger.log(`Deleting shortened URL: ${shortUrl}`);
    await this.urlService.deleteUrl(shortUrl);
    this.logger.log(`Shortened URL deleted successfully: ${shortUrl}`);
  }
}
