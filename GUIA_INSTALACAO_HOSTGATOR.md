# 🚀 Guia de Instalação do Site Fatia de Minas na Hostgator

## 📋 Pré-requisitos

Antes de começar, você precisará:

1. ✅ Acesso ao painel cPanel da Hostgator
2. ✅ Domínio configurado (fatiademinas.com.br)
3. ✅ Acesso FTP ou File Manager do cPanel
4. ✅ MySQL Database disponível

---

## 📁 Estrutura do Projeto

O site foi desenvolvido com:
- **Frontend**: React 19 + Vite
- **Backend**: Node.js + Express + tRPC
- **Banco de Dados**: MySQL/TiDB
- **Autenticação**: OAuth integrado

---

## 🔧 Passo 1: Preparar o Ambiente na Hostgator

### 1.1 Criar Banco de Dados MySQL

1. Acesse o **cPanel** da Hostgator
2. Vá em **MySQL® Databases**
3. Crie um novo banco de dados:
   - Nome: `fatiademinas_db`
4. Crie um usuário MySQL:
   - Usuário: `fatiademinas_user`
   - Senha: (escolha uma senha forte)
5. Adicione o usuário ao banco de dados com **ALL PRIVILEGES**
6. Anote as credenciais:
   ```
   Host: localhost
   Database: fatiademinas_db
   Username: fatiademinas_user
   Password: [sua_senha]
   ```

### 1.2 Verificar Versão do Node.js

1. Acesse o **cPanel**
2. Vá em **Setup Node.js App**
3. Verifique se a versão do Node.js é **18.x ou superior**
4. Se não estiver disponível, entre em contato com o suporte da Hostgator

---

## 📦 Passo 2: Fazer Upload dos Arquivos

### Opção A: Via File Manager (Recomendado para iniciantes)

1. No cPanel, acesse **File Manager**
2. Navegue até `/public_html/` (ou a pasta do seu domínio)
3. Faça upload do arquivo `fatia-de-minas.zip`
4. Clique com botão direito no arquivo e selecione **Extract**
5. Após extrair, mova todos os arquivos da pasta `fatia-de-minas` para `/public_html/`

### Opção B: Via FTP (Recomendado para usuários avançados)

1. Use um cliente FTP (FileZilla, WinSCP, etc.)
2. Conecte-se ao servidor:
   - Host: ftp.fatiademinas.com.br
   - Usuário: [seu_usuario_cpanel]
   - Senha: [sua_senha_cpanel]
   - Porta: 21
3. Navegue até `/public_html/`
4. Faça upload de todos os arquivos do projeto

---

## ⚙️ Passo 3: Configurar Variáveis de Ambiente

1. No File Manager, navegue até a pasta raiz do projeto
2. Crie um arquivo chamado `.env` (se não existir)
3. Adicione as seguintes variáveis:

```env
# Banco de Dados
DATABASE_URL=mysql://fatiademinas_user:[SUA_SENHA]@localhost:3306/fatiademinas_db

# JWT Secret (gere uma chave aleatória forte)
JWT_SECRET=sua_chave_secreta_muito_forte_aqui_123456

# URLs do Aplicativo
VITE_APP_TITLE=Fatia de Minas
VITE_APP_LOGO=/imagens/logo.png

# OAuth (se aplicável)
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# APIs Internas
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=[sua_chave_api]

# Proprietário
OWNER_OPEN_ID=[seu_id]
OWNER_NAME=Fatia de Minas
```

**⚠️ IMPORTANTE**: Substitua os valores entre `[colchetes]` pelos seus dados reais!

---

## 🗄️ Passo 4: Configurar o Banco de Dados

### 4.1 Importar Schema do Banco

1. No cPanel, acesse **phpMyAdmin**
2. Selecione o banco `fatiademinas_db`
3. Clique na aba **SQL**
4. Cole o seguinte script SQL:

```sql
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(64) NOT NULL,
  `name` text,
  `email` varchar(320),
  `loginMethod` varchar(64),
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `lastSignedIn` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `categoria` varchar(100) NOT NULL,
  `preco` int NOT NULL,
  `precoPromocional` int DEFAULT NULL,
  `descricao` text,
  `imagem` varchar(255) DEFAULT NULL,
  `estoque` int NOT NULL DEFAULT '0',
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sessionId` varchar(255) NOT NULL,
  `productId` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

5. Clique em **Executar**

### 4.2 Importar Produtos de Exemplo (Opcional)

1. Na aba **SQL** do phpMyAdmin
2. Cole o conteúdo do arquivo `produtos_seed.sql` (fornecido no pacote)
3. Clique em **Executar**

---

## 🚀 Passo 5: Instalar Dependências e Iniciar o Site

### 5.1 Via Terminal SSH (Recomendado)

1. Acesse o terminal SSH no cPanel (**Terminal** ou **SSH Access**)
2. Navegue até a pasta do projeto:
   ```bash
   cd /home/[seu_usuario]/public_html
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Execute o build de produção:
   ```bash
   npm run build
   ```

5. Inicie o servidor:
   ```bash
   npm run start
   ```

### 5.2 Configurar como Aplicação Node.js no cPanel

1. No cPanel, vá em **Setup Node.js App**
2. Clique em **Create Application**
3. Configure:
   - **Node.js version**: 18.x ou superior
   - **Application mode**: Production
   - **Application root**: `/home/[seu_usuario]/public_html`
   - **Application URL**: fatiademinas.com.br
   - **Application startup file**: `server/_core/index.js`
4. Clique em **Create**
5. Copie o comando `source` fornecido e execute no terminal
6. Clique em **Start App**

---

## 🖼️ Passo 6: Verificar Imagens

1. Verifique se a pasta `/public_html/client/public/imagens/` contém todas as imagens
2. Imagens incluídas:
   - logo.png
   - canastra2.jpeg
   - Prov4.jpg
   - docedeleitesouvenir.jpg
   - milho2.jpeg
   - linguiça3.jpg
   - manteigabelomonte.jpeg
   - padrao.jpg
   - provoletinhotemp.jpg
   - requeijãocremoso2.jpg
   - vaidosatemeperado.PNG
   - ZeroAcucar.jpeg

3. Se alguma imagem estiver faltando, faça upload manualmente para essa pasta

---

## 🔐 Passo 7: Configurar SSL (HTTPS)

1. No cPanel, vá em **SSL/TLS Status**
2. Selecione seu domínio `fatiademinas.com.br`
3. Clique em **Run AutoSSL** para gerar certificado gratuito
4. Aguarde a instalação (pode levar alguns minutos)
5. Após instalado, force HTTPS:
   - Vá em **File Manager**
   - Edite o arquivo `.htaccess` na raiz
   - Adicione no início:
   ```apache
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

---

## ✅ Passo 8: Testar o Site

1. Acesse: `https://fatiademinas.com.br`
2. Verifique:
   - ✅ Página inicial carrega corretamente
   - ✅ Imagens aparecem
   - ✅ Menu funciona
   - ✅ Produtos são listados
   - ✅ Carrinho funciona
   - ✅ Botão WhatsApp funciona
3. Teste o painel admin:
   - Acesse: `https://fatiademinas.com.br/admin`
   - Faça login (se necessário)
   - Teste adicionar/editar produtos

---

## 🛠️ Passo 9: Gerenciar Produtos

### Adicionar Produtos via Painel Admin

1. Acesse `/admin`
2. Clique em **Novo Produto**
3. Preencha os campos:
   - Nome do produto
   - Categoria
   - Preço
   - Preço promocional (opcional)
   - Descrição
   - **Upload de imagem**: Arraste e solte ou clique para selecionar
   - Estoque
   - Status (Ativo/Inativo)
4. Clique em **Criar**

### Fazer Upload de Imagens de Produtos

**Método 1: Via Painel Admin (Recomendado)**
- Use o recurso de drag & drop no formulário de produtos
- A imagem será automaticamente salva na pasta `/imagens/`

**Método 2: Via FTP/File Manager**
1. Faça upload das imagens para `/public_html/client/public/imagens/`
2. No painel admin, ao cadastrar o produto, digite apenas o nome do arquivo (ex: `queijo.jpg`)

### Importar Produtos via CSV

1. Prepare um arquivo CSV com as colunas:
   ```
   id,nome,categoria,preco,precoPromocional,descricao,imagem,estoque,ativo
   ```
2. No painel admin, clique em **Importar CSV**
3. Selecione o arquivo
4. Os produtos serão importados automaticamente

---

## 📞 Suporte e Contato

### Números de Telefone Configurados
- WhatsApp: **(21) 99795-3063**
- Todos os botões de WhatsApp já estão configurados com este número

### Redes Sociais Configuradas
- Instagram: `@fatiademinas`
- Facebook: `/fatiademinas`

### Email
- atendimento@fatiademinas.com.br

---

## 🔧 Troubleshooting (Solução de Problemas)

### Problema: Site não carrega

**Solução:**
1. Verifique se o aplicativo Node.js está rodando no cPanel
2. Verifique os logs de erro em **Setup Node.js App** > **Open logs**
3. Reinicie a aplicação

### Problema: Imagens não aparecem

**Solução:**
1. Verifique se as imagens estão na pasta `/client/public/imagens/`
2. Verifique as permissões da pasta (deve ser 755)
3. Limpe o cache do navegador (Ctrl+F5)

### Problema: Produtos não aparecem

**Solução:**
1. Verifique a conexão com o banco de dados no arquivo `.env`
2. Acesse phpMyAdmin e verifique se a tabela `products` existe e tem dados
3. Execute o script SQL de criação das tabelas novamente

### Problema: Erro de permissão ao fazer upload de imagens

**Solução:**
1. Via File Manager, clique com botão direito na pasta `/imagens/`
2. Selecione **Change Permissions**
3. Configure para **755** ou **775**
4. Marque **Recurse into subdirectories**
5. Clique em **Change Permissions**

### Problema: Erro 500 Internal Server Error

**Solução:**
1. Verifique o arquivo `.htaccess` na raiz
2. Verifique os logs de erro do servidor
3. Verifique se todas as variáveis de ambiente estão configuradas
4. Entre em contato com o suporte da Hostgator

---

## 📚 Arquivos Importantes

### Estrutura de Pastas
```
/public_html/
├── client/
│   ├── public/
│   │   └── imagens/          ← Imagens do site
│   └── src/
│       ├── components/       ← Componentes React
│       ├── pages/            ← Páginas do site
│       └── lib/              ← Bibliotecas
├── server/
│   ├── _core/                ← Core do servidor
│   ├── db.ts                 ← Funções do banco
│   └── routers.ts            ← Rotas tRPC
├── drizzle/
│   └── schema.ts             ← Schema do banco
├── .env                      ← Variáveis de ambiente
├── package.json              ← Dependências
└── README_FATIA_DE_MINAS.md  ← Documentação
```

### Arquivos de Configuração
- `.env` - Variáveis de ambiente (NUNCA compartilhe este arquivo!)
- `package.json` - Dependências do projeto
- `drizzle.config.ts` - Configuração do ORM
- `.htaccess` - Configuração do Apache

---

## 🎯 Próximos Passos

Após a instalação bem-sucedida:

1. ✅ Configure o Google Analytics (opcional)
2. ✅ Configure backup automático do banco de dados
3. ✅ Teste todos os fluxos de compra
4. ✅ Configure emails transacionais (opcional)
5. ✅ Adicione seus produtos reais
6. ✅ Teste em diferentes dispositivos (mobile, tablet, desktop)
7. ✅ Configure monitoramento de uptime
8. ✅ Faça backup regular dos arquivos e banco de dados

---

## 📝 Notas Finais

- **Backup**: Faça backup regular do banco de dados e dos arquivos
- **Atualizações**: Mantenha as dependências atualizadas
- **Segurança**: Nunca compartilhe suas credenciais ou arquivo `.env`
- **Performance**: Monitore o desempenho do site regularmente
- **Suporte**: Em caso de dúvidas, consulte a documentação ou entre em contato

---

## 🎉 Parabéns!

Seu site da Fatia de Minas está pronto para vender! 🧀🍯

**Desenvolvido com ❤️ por Manus AI**

