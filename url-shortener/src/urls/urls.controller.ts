import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Delete,
  Redirect,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UrlService } from '../urls/urls.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('url')
@ApiBearerAuth()
@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  @ApiOperation({ summary: 'URL Shorten' })
  @ApiBody({ type: CreateUrlDto, description: 'URL data to be shortened.' })
  @ApiResponse({ status: 201, description: 'Successfully shortened URL.' })
  @ApiResponse({ status: 400, description: 'Error shortening URL.' })
  async shortenUrl(
    @Body() createUrlDto: CreateUrlDto,
    @Req() req: any,
  ): Promise<{ shortUrl: string }> {
    const ownerId = req.user?.id;
    const shortUrl = await this.urlService.shortenUrl(
      createUrlDto.originalUrl,
      ownerId,
    );
    return { shortUrl };
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
    const originalUrl = await this.urlService.redirectToOriginal(shortUrl);
    return { url: originalUrl };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Get authenticated users URLs.' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved URLs.' })
  async getUrlsByUser(@Req() req: any) {
    return await this.urlService.getUrlsByUser(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':shortUrl')
  @ApiOperation({ summary: 'Update original URL.' })
  @ApiBody({ type: UpdateUrlDto, description: 'Original URL updated successfully.' })
  @ApiResponse({
    status: 200,
    description: 'Original URL updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'URL not found.' })
  async updateOriginalUrl(
    @Param('shortUrl') shortUrl: string,
    @Body() updateUrlDto: UpdateUrlDto,
  ) {
    await this.urlService.updateOriginalUrl(shortUrl, updateUrlDto.originalUrl);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':shortUrl')
  @ApiOperation({ summary: 'Delete shortened URL' })
  @ApiResponse({ status: 200, description: 'URL deleted successfully.' })
  @ApiResponse({ status: 404, description: 'URL not found.' })
  async deleteUrl(@Param('shortUrl') shortUrl: string) {
    await this.urlService.deleteUrl(shortUrl);
  }
}
