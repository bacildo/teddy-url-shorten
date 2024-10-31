# URL Shortener API

## Descrição

Este projeto é uma API para encurtamento de URLs, construída com NestJS e TypeScript. A API permite que usuários registrem contas, façam login e encurtem URLs, tanto autenticados quanto não autenticados.

## Tecnologias Utilizadas

- **NestJS**: Framework para Node.js que utiliza conceitos de programação orientada a objetos e injeção de dependências.
- **TypeScript**: Linguagem que adiciona tipagem estática ao JavaScript.
- **JWT**: Implementação de autenticação baseada em tokens.
- **Winston**: Biblioteca para logging, utilizada para registrar eventos e erros.
- **Docker**: Utilizado para containerização da aplicação.

## Endpoints da API

### Documentação com Swagger

A API possui integração com Swagger para facilitar a visualização e teste dos endpoints. A documentação está disponível na rota:

http://localhost:3000/

### Autenticação

- **POST** `/auth/register`: Registra um novo usuário.
- **POST** `/auth/login`: Realiza login de um usuário e retorna um token de acesso.

### URLs

- **POST** `/url/shorten`: Encurta uma URL (requer autenticação).
- **POST** `/url/no-auth/shorten`: Encurta uma URL (sem necessidade de autenticação).
- **GET** `/url/:shortUrl`: Redireciona para a URL original a partir do código encurtado.
- **GET** `/url`: Recupera URLs encurtadas do usuário autenticado (requer autenticação).
- **PUT** `/url/:shortUrl`: Atualiza a URL original (requer autenticação).
- **DELETE** `/url/:shortUrl`: Deleta uma URL encurtada de forma lógica (requer autenticação).

## Configuração

1. Clone o repositório:

   git clone <url-do-repositorio>

2. Instale as dependências:

   npm install

3. Crie um arquivo .env na raiz do projeto com as seguintes variáveis:

   DATABASE_HOST=<host-do-banco>
   DATABASE_PORT=<porta-do-banco>
   DATABASE_USER=<usuario-do-banco>
   DATABASE_PASSWORD=<senha-do-banco>
   DATABASE_NAME=<nome-do-banco>
   JWT_SECRET=<seu-segredo-jwt>

## Uso do Docker

Este projeto é compatível com Docker e utiliza um Dockerfile e um docker-compose.yml para facilitar a execução da aplicação.

Para iniciar a aplicação usando Docker, execute:

docker-compose up --build

O build da aplicação criará automaticamente a base de dados. Se você encontrar uma mensagem informando que o Nest não conseguiu conectar ao banco de dados, aguarde um momento e tente novamente. Isso pode acontecer devido à sincronização entre os serviços. O sistema possui um mecanismo de retry para garantir que o build seja bem-sucedido.

## Logging

A aplicação utiliza a biblioteca Winston para logging, permitindo monitorar e registrar eventos relevantes e erros que possam ocorrer durante a execução da API.

## Contribuições

Sinta-se à vontade para contribuir com melhorias ou correções! Para isso, você pode abrir uma issue ou enviar um pull request.

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.