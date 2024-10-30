# Usando imagem base
FROM node:20

# Define o diretório de trabalho na raiz do projeto
WORKDIR /app

# Copia apenas os arquivos de configuração necessários
COPY package.json package-lock.json ./
COPY tsconfig.json ./

# Instala as dependências do projeto
RUN npm install --legacy-peer-deps

# Copia todos os arquivos do projeto
COPY . .

# Gera o build do projeto
RUN npm run build

# Expõe a porta do serviço
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "run", "start:prod"]
