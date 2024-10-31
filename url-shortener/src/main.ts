import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { mkdirSync, writeFileSync } from 'fs';
import { AppModule } from './app.module';
import { join } from 'path';
import { customLogger } from './utils/logger';

dotenv.config({ path: `${__dirname}/../../.env` });

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('URL Shortener API')
    .setDescription('API for shortening URLs')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const outputPath = join(process.cwd(), 'docs', 'swagger-output.json');
  try {
    mkdirSync(join(process.cwd(), 'docs'), { recursive: true });
    writeFileSync(outputPath, JSON.stringify(document));
    customLogger.log('Swagger file created');
  } catch (error) {
    customLogger.error('Error generating swagger file');
  }

  await app.listen(3000);
  customLogger.log('Server running on the port 3000!');
}
bootstrap();
