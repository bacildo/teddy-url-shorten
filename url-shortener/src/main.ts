import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { mkdirSync, writeFileSync } from 'fs';
import { AppModule } from './app.module';
import { join } from 'path';

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
    console.log('Arquivo Swagger gerado com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar o arquivo Swagger:', error);
  }

  await app.listen(3000);
}
bootstrap();
