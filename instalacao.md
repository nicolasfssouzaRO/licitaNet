# Guia de Instalação e Configuração - SaaS de Integração com o Compranet

Este guia fornece instruções detalhadas para instalação, configuração e implantação do SaaS de Integração com o Compranet.

## Índice

1. [Requisitos do Sistema](#requisitos-do-sistema)
2. [Instalação](#instalação)
3. [Configuração](#configuração)
4. [Implantação](#implantação)
5. [Atualização](#atualização)
6. [Backup e Recuperação](#backup-e-recuperação)

## Requisitos do Sistema

### Hardware Recomendado

- **Processador**: Dual-core 2GHz ou superior
- **Memória RAM**: 4GB ou superior
- **Espaço em Disco**: 1GB disponível para a aplicação

### Software Necessário

- **Sistema Operacional**: Windows 10/11, macOS 10.15+, Ubuntu 20.04+ ou distribuições Linux similares
- **Node.js**: Versão 14.x ou superior
- **NPM**: Versão 6.x ou superior
- **Navegadores Suportados**: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+

### Requisitos de Rede

- **Conexão com Internet**: Necessária para comunicação com as APIs do Compranet
- **Portas**: 80 e 443 devem estar liberadas para comunicação HTTP/HTTPS

## Instalação

### Instalação via Repositório Git

1. Clone o repositório:
   ```bash
   git clone https://github.com/sua-organizacao/saas-compranet.git
   cd saas-compranet
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

### Instalação via Pacote

1. Baixe o pacote de instalação do site oficial ou do repositório de releases.

2. Extraia o conteúdo do pacote:
   ```bash
   unzip saas-compranet-v1.0.0.zip -d saas-compranet
   cd saas-compranet
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

## Configuração

### Configuração do Ambiente

1. Crie um arquivo de configuração de ambiente:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` com suas configurações:
   ```
   # Configurações da Aplicação
   PORT=3000
   NODE_ENV=production
   
   # Credenciais do Comprasnet Contratos
   COMPRASNET_CLIENT_ID=seu_client_id
   COMPRASNET_CLIENT_SECRET=seu_client_secret
   
   # Configurações de Cache
   CACHE_ENABLED=true
   CACHE_DURATION=3600
   ```

### Configuração das APIs

Se necessário, ajuste as configurações das APIs no arquivo `api/config.js`:

```javascript
// Exemplo de ajuste para usar uma API de homologação
const CONFIG = {
    comprasGov: {
        baseUrl: 'https://homolog.compras.dados.gov.br',
        // ...
    },
    // ...
};
```

### Configuração de Segurança

1. Certifique-se de que as credenciais do Comprasnet estão seguras:
   - Não compartilhe o arquivo `.env`
   - Não inclua credenciais em repositórios de código

2. Se estiver implantando em produção, considere:
   - Usar HTTPS
   - Configurar políticas de CORS
   - Implementar rate limiting

## Implantação

### Implantação Local (Desenvolvimento)

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse a aplicação em `http://localhost:3000`

### Implantação em Servidor (Produção)

#### Usando PM2 (Recomendado)

1. Instale o PM2 globalmente:
   ```bash
   npm install -g pm2
   ```

2. Inicie a aplicação com PM2:
   ```bash
   pm2 start npm --name "saas-compranet" -- start
   ```

3. Configure o PM2 para iniciar automaticamente:
   ```bash
   pm2 startup
   pm2 save
   ```

#### Usando Docker

1. Construa a imagem Docker:
   ```bash
   docker build -t saas-compranet .
   ```

2. Execute o container:
   ```bash
   docker run -p 3000:3000 --env-file .env -d saas-compranet
   ```

### Configuração de Proxy Reverso (Nginx)

Para servir a aplicação através do Nginx:

1. Instale o Nginx:
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. Crie um arquivo de configuração para o site:
   ```bash
   sudo nano /etc/nginx/sites-available/saas-compranet
   ```

3. Adicione a seguinte configuração:
   ```
   server {
       listen 80;
       server_name seu-dominio.com.br;
   
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. Ative o site e reinicie o Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/saas-compranet /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Atualização

### Atualização via Git

1. Pare a aplicação (se estiver em execução):
   ```bash
   pm2 stop saas-compranet
   ```

2. Atualize o código:
   ```bash
   git pull origin main
   ```

3. Instale novas dependências:
   ```bash
   npm install
   ```

4. Reinicie a aplicação:
   ```bash
   pm2 start saas-compranet
   ```

### Atualização Manual

1. Faça backup da pasta de configuração:
   ```bash
   cp .env .env.backup
   ```

2. Substitua os arquivos da aplicação pelos novos.

3. Restaure o arquivo de configuração:
   ```bash
   cp .env.backup .env
   ```

4. Instale as dependências e reinicie a aplicação:
   ```bash
   npm install
   pm2 restart saas-compranet
   ```

## Backup e Recuperação

### Backup

Recomenda-se fazer backup regular dos seguintes arquivos:

1. Arquivo de configuração `.env`
2. Quaisquer personalizações feitas nos arquivos de código
3. Dados armazenados localmente (se aplicável)

Exemplo de script de backup:

```bash
#!/bin/bash
BACKUP_DIR="/backups/saas-compranet"
APP_DIR="/path/to/saas-compranet"
DATE=$(date +%Y%m%d_%H%M%S)

# Cria diretório de backup
mkdir -p $BACKUP_DIR

# Cria arquivo de backup
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz \
    $APP_DIR/.env \
    $APP_DIR/api/config.js

echo "Backup criado em $BACKUP_DIR/backup_$DATE.tar.gz"
```

### Recuperação

Para restaurar a partir de um backup:

1. Pare a aplicação:
   ```bash
   pm2 stop saas-compranet
   ```

2. Extraia o arquivo de backup:
   ```bash
   tar -xzf backup_20250419.tar.gz -C /tmp/restore
   ```

3. Copie os arquivos necessários:
   ```bash
   cp /tmp/restore/path/to/saas-compranet/.env /path/to/saas-compranet/
   cp /tmp/restore/path/to/saas-compranet/api/config.js /path/to/saas-compranet/api/
   ```

4. Reinicie a aplicação:
   ```bash
   pm2 start saas-compranet
   ```

## Solução de Problemas

### Logs da Aplicação

Para visualizar logs da aplicação:

```bash
# Se estiver usando PM2
pm2 logs saas-compranet

# Se estiver usando Docker
docker logs container_id
```

### Problemas Comuns

1. **Erro de conexão com as APIs do Compranet**:
   - Verifique sua conexão com a internet
   - Confirme se as URLs base estão corretas em `api/config.js`
   - Verifique se as credenciais estão corretas no arquivo `.env`

2. **Erro "Module not found"**:
   - Execute `npm install` para garantir que todas as dependências estão instaladas

3. **Erro de porta em uso**:
   - Altere a porta no arquivo `.env` (PORT=3001)
   - Verifique se não há outro processo usando a mesma porta

4. **Problemas de desempenho**:
   - Aumente o limite de memória do Node.js: `NODE_OPTIONS=--max-old-space-size=4096`
   - Ative o cache definindo `CACHE_ENABLED=true` no arquivo `.env`

### Contato para Suporte

Para suporte técnico avançado, entre em contato:

- Email: suporte@saas-compranet.com.br
- Telefone: (XX) XXXX-XXXX
- Horário: Segunda a Sexta, das 9h às 18h

---

© 2025 SaaS Compranet. Todos os direitos reservados.
