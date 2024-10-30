import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { mkdirSync, writeFileSync } from 'fs';
import { AppModule } from './app.module';
import { join } from 'path';

// Carregar variáveis de ambiente
dotenv.config({ path: `${__dirname}/../../.env` });

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  // Configuração completa do Swagger
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

  // Caminho absoluto para salvar o Swagger JSON na raiz do projeto
  const outputPath = join(process.cwd(), 'docs', 'swagger-output.json');
  // Tentar gravar o arquivo Swagger JSON
  try {
    mkdirSync(join(process.cwd(), 'docs'), { recursive: true });
    writeFileSync(outputPath, JSON.stringify(document))
    console.log('Arquivo Swagger gerado com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar o arquivo Swagger:', error);
  }

  await app.listen(3000);
}
bootstrap();