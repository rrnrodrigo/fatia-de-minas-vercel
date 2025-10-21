# 🚀 Guia Completo: Deploy do Site Fatia de Minas na Vercel

## 📋 O que você vai conseguir

- ✅ Site no ar em **10 minutos**
- ✅ **100% Gratuito** (plano Hobby da Vercel)
- ✅ **HTTPS/SSL automático** (site seguro)
- ✅ **Domínio personalizado** (fatiademinas.com.br)
- ✅ **Banco de dados gratuito** (Vercel Postgres)
- ✅ **Deploy automático** a cada atualização
- ✅ **CDN global** (site super rápido)

---

## 🎯 Passo 1: Criar Conta no GitHub (5 minutos)

O GitHub é onde vamos guardar o código do seu site (como um "Google Drive" para desenvolvedores).

### 1.1 Criar Conta

1. Acesse: **https://github.com**
2. Clique em **"Sign up"** (Cadastrar)
3. Preencha:
   - **Email**: Seu email
   - **Password**: Crie uma senha forte
   - **Username**: Escolha um nome de usuário (ex: `fatiademinas`)
4. Resolva o CAPTCHA
5. Clique em **"Create account"**
6. Verifique seu email e confirme a conta

### 1.2 Instalar GitHub Desktop (Opcional - Facilita muito!)

**Para Windows/Mac:**
1. Acesse: **https://desktop.github.com**
2. Baixe e instale o GitHub Desktop
3. Abra o programa
4. Faça login com sua conta GitHub

**OU use o navegador** (vou te mostrar as duas formas)

---

## 🎯 Passo 2: Subir o Projeto para o GitHub

### Método A: Via GitHub Desktop (MAIS FÁCIL) ⭐

1. **Abra o GitHub Desktop**
2. Clique em **"File"** > **"Add Local Repository"**
3. Clique em **"Choose..."** e selecione a pasta `fatia-de-minas`
4. Se aparecer erro, clique em **"create a repository"**
5. Preencha:
   - **Name**: `fatia-de-minas`
   - **Description**: `Site oficial da Fatia de Minas`
   - Marque **"Initialize this repository with a README"**
6. Clique em **"Create Repository"**
7. Clique em **"Publish repository"**
8. **IMPORTANTE**: Desmarque **"Keep this code private"** (ou deixe marcado se preferir privado)
9. Clique em **"Publish Repository"**

✅ **Pronto!** Seu código está no GitHub!

### Método B: Via Navegador (Alternativa)

1. **Acesse**: https://github.com/new
2. Preencha:
   - **Repository name**: `fatia-de-minas`
   - **Description**: `Site oficial da Fatia de Minas`
   - Deixe **Public** (ou Private se preferir)
   - Marque **"Add a README file"**
3. Clique em **"Create repository"**
4. Na página do repositório, clique em **"uploading an existing file"**
5. Arraste a pasta `fatia-de-minas` (ou use "choose your files")
6. Clique em **"Commit changes"**

---

## 🎯 Passo 3: Criar Conta na Vercel (3 minutos)

### 3.1 Cadastro

1. Acesse: **https://vercel.com**
2. Clique em **"Sign Up"** (Cadastrar)
3. Escolha **"Continue with GitHub"** (Continuar com GitHub)
4. Faça login com sua conta GitHub
5. Autorize a Vercel a acessar seus repositórios
6. Pronto! Conta criada e conectada ao GitHub

---

## 🎯 Passo 4: Fazer Deploy do Site (5 minutos)

### 4.1 Importar Projeto

1. No dashboard da Vercel, clique em **"Add New..."** > **"Project"**
2. Você verá a lista dos seus repositórios do GitHub
3. Encontre **"fatia-de-minas"** e clique em **"Import"**

### 4.2 Configurar Projeto

Na tela de configuração:

1. **Project Name**: `fatia-de-minas` (pode deixar como está)
2. **Framework Preset**: Selecione **"Vite"**
3. **Root Directory**: `./` (deixe como está)
4. **Build Command**: 
   ```
   pnpm install && pnpm run build
   ```
5. **Output Directory**: `client/dist`
6. **Install Command**: 
   ```
   pnpm install
   ```

### 4.3 Configurar Variáveis de Ambiente

Clique em **"Environment Variables"** e adicione:

```
DATABASE_URL=postgresql://[VAMOS_CONFIGURAR_DEPOIS]
JWT_SECRET=sua_chave_secreta_forte_123456789
VITE_APP_TITLE=Fatia de Minas
VITE_APP_LOGO=/imagens/logo.png
NODE_ENV=production
```

**⚠️ IMPORTANTE**: Vamos configurar o `DATABASE_URL` no próximo passo!

### 4.4 Deploy!

1. Clique em **"Deploy"**
2. Aguarde 2-5 minutos enquanto a Vercel:
   - Instala as dependências
   - Faz o build do projeto
   - Publica o site
3. Quando aparecer **"Congratulations!"** com confetes 🎉, está pronto!

### 4.5 Ver Seu Site

1. Clique em **"Visit"** ou copie a URL
2. Sua URL temporária será algo como: `fatia-de-minas.vercel.app`
3. **Teste o site!** Navegue pelas páginas

---

## 🎯 Passo 5: Configurar Banco de Dados Vercel Postgres (5 minutos)

### 5.1 Criar Banco de Dados

1. No dashboard da Vercel, vá em **"Storage"** (menu lateral)
2. Clique em **"Create Database"**
3. Selecione **"Postgres"**
4. Escolha:
   - **Database Name**: `fatia-de-minas-db`
   - **Region**: Selecione **"São Paulo (GRU)"** (mais próximo do Brasil)
5. Clique em **"Create"**
6. Aguarde a criação (1-2 minutos)

### 5.2 Conectar ao Projeto

1. Após criar, clique em **"Connect Project"**
2. Selecione seu projeto **"fatia-de-minas"**
3. Clique em **"Connect"**
4. A Vercel vai automaticamente adicionar a variável `DATABASE_URL` ao seu projeto!

### 5.3 Criar Tabelas do Banco

1. No dashboard do banco, clique em **"Query"** (ou "Console")
2. Cole o seguinte SQL:

```sql
-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name TEXT,
  email VARCHAR(320),
  "loginMethod" VARCHAR(64),
  role VARCHAR(20) DEFAULT 'user' NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "lastSignedIn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  preco INTEGER NOT NULL,
  "precoPromocional" INTEGER,
  descricao TEXT,
  imagem VARCHAR(255),
  estoque INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Carrinho
CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  "sessionId" VARCHAR(255) NOT NULL,
  "productId" INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("productId") REFERENCES products(id) ON DELETE CASCADE
);

-- Inserir produtos de exemplo
INSERT INTO products (nome, categoria, preco, "precoPromocional", descricao, imagem, estoque, ativo) VALUES
('Queijo Canastra Artesanal', 'Queijos', 8990, 7990, 'Queijo Canastra artesanal de sabor incomparável, produzido na Serra da Canastra. Textura firme e sabor marcante que representa a tradição mineira.', 'canastra2.jpeg', 25, true),
('Queijo Minas Padrão Vidat', 'Queijos', 4500, NULL, 'Queijo Minas Padrão da marca Vidat, com sabor suave e textura macia. Ideal para o café da manhã ou lanche da tarde. Produto fresco e de qualidade.', 'padrao.jpg', 30, true),
('Provolone Temperado', 'Queijos', 2990, 2390, 'Provolone artesanal temperado com ervas especiais. Sabor intenso e aromático, perfeito para aperitivos e tábuas de frios.', 'provoletinhotemp.jpg', 20, true),
('Queijo Prato Fatiado', 'Queijos', 3290, NULL, 'Queijo Prato fatiado, ideal para sanduíches e lanches. Sabor suave e textura macia que derrete perfeitamente.', 'padrao.jpg', 15, true),
('Doce de Leite Souvenir', 'Doces', 1850, NULL, 'Doce de leite cremoso e tradicional, feito com leite fresco de Minas. Embalagem souvenir perfeita para presente ou consumo próprio.', 'docedeleitesouvenir.jpg', 40, true),
('Bananinha Cremosa Zero Açúcar', 'Doces', 1290, NULL, 'Bananinha cremosa sem adição de açúcar, feita com bananas selecionadas. Sabor natural e textura suave, ideal para quem busca opções mais saudáveis.', 'ZeroAcucar.jpeg', 35, true),
('Linguiça Artesanal Temperada', 'Embutidos', 3890, NULL, 'Linguiça artesanal temperada com especiarias selecionadas. Produzida com carne suína de qualidade, seguindo receitas tradicionais mineiras.', 'linguiça3.jpg', 18, true),
('Manteiga Belo Monte', 'Mercearia', 2490, NULL, 'Manteiga artesanal Belo Monte, produzida com leite fresco da fazenda. Sabor intenso e cremosidade incomparável para o seu pão quentinho.', 'manteigabelomonte.jpeg', 28, true),
('Requeijão Cremoso Artesanal', 'Mercearia', 2890, NULL, 'Requeijão cremoso artesanal de textura aveludada. Perfeito para passar no pão, rechear bolos ou acompanhar biscoitos.', 'requeijãocremoso2.jpg', 22, true),
('Paçoca de Amendoim Artesanal', 'Mercearia', 890, NULL, 'Paçoca de amendoim artesanal crocante e saborosa. Feita com amendoim torrado e açúcar, sem conservantes. Tradicional doce mineiro.', 'padrao.jpg', 50, true);
```

3. Clique em **"Run"** ou **"Execute"**
4. ✅ Pronto! Banco configurado com produtos!

---

## 🎯 Passo 6: Redeploy com Banco Configurado

1. Volte para o dashboard do projeto na Vercel
2. Vá em **"Deployments"**
3. Clique nos **três pontinhos** do último deploy
4. Clique em **"Redeploy"**
5. Aguarde 2-3 minutos
6. ✅ Site atualizado com banco de dados funcionando!

---

## 🎯 Passo 7: Configurar Domínio Personalizado (Opcional)

### 7.1 Adicionar Domínio

1. No projeto da Vercel, vá em **"Settings"** > **"Domains"**
2. Digite: `fatiademinas.com.br`
3. Clique em **"Add"**
4. A Vercel vai mostrar os registros DNS que você precisa configurar

### 7.2 Configurar DNS na Hostgator

1. Acesse o **cPanel da Hostgator**
2. Vá em **"Zone Editor"** ou **"Editor de Zona DNS"**
3. Adicione os registros que a Vercel mostrou:

**Registro A:**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**Registro CNAME:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

4. Salve as alterações
5. Aguarde 10-30 minutos para propagar
6. ✅ Seu domínio estará funcionando!

---

## 🎯 Passo 8: Testar Tudo

### 8.1 Teste o Site

Acesse seu site e teste:

- ✅ Página inicial carrega
- ✅ Imagens aparecem
- ✅ Menu funciona
- ✅ Produtos são listados
- ✅ Adicionar ao carrinho funciona
- ✅ Página do carrinho funciona
- ✅ Botão WhatsApp funciona
- ✅ Painel admin (`/admin`) funciona

### 8.2 Teste o Painel Admin

1. Acesse: `https://seu-site.vercel.app/admin`
2. Teste:
   - ✅ Listar produtos
   - ✅ Adicionar novo produto
   - ✅ Editar produto
   - ✅ Excluir produto
   - ✅ Upload de imagem

---

## 🔄 Como Atualizar o Site no Futuro

### Método Fácil: GitHub Desktop

1. Faça as alterações nos arquivos do projeto
2. Abra o **GitHub Desktop**
3. Você verá as alterações listadas
4. Digite uma mensagem (ex: "Adicionei novos produtos")
5. Clique em **"Commit to main"**
6. Clique em **"Push origin"**
7. **Automático**: A Vercel detecta e faz deploy automaticamente!
8. Aguarde 2-3 minutos
9. ✅ Site atualizado!

### Método Navegador

1. Acesse seu repositório no GitHub
2. Navegue até o arquivo que quer editar
3. Clique no ícone de lápis (Edit)
4. Faça as alterações
5. Clique em **"Commit changes"**
6. A Vercel faz deploy automaticamente!

---

## 📊 Monitoramento e Analytics

### Ver Estatísticas do Site

1. No dashboard da Vercel, vá em **"Analytics"**
2. Você verá:
   - Número de visitantes
   - Páginas mais acessadas
   - Tempo de carregamento
   - Erros (se houver)

### Ver Logs de Erro

1. Vá em **"Logs"** no dashboard
2. Você verá todos os logs do servidor
3. Útil para debugar problemas

---

## 🆘 Solução de Problemas

### Problema: Deploy falhou

**Solução:**
1. Vá em **"Deployments"** > Clique no deploy com erro
2. Veja os logs de erro
3. Geralmente é:
   - Variável de ambiente faltando
   - Erro de sintaxe no código
4. Corrija e faça novo commit

### Problema: Banco de dados não conecta

**Solução:**
1. Verifique se a variável `DATABASE_URL` está configurada
2. Vá em **"Settings"** > **"Environment Variables"**
3. Verifique se `DATABASE_URL` está lá
4. Se não estiver, reconecte o banco em **"Storage"**

### Problema: Imagens não aparecem

**Solução:**
1. Verifique se as imagens estão na pasta `/client/public/imagens/`
2. Verifique se os nomes dos arquivos estão corretos
3. Faça novo commit e push

### Problema: Site lento

**Solução:**
1. A Vercel tem CDN global, site deve ser rápido
2. Otimize imagens (reduza tamanho)
3. Verifique em **"Analytics"** se há problemas

---

## 💰 Custos e Limites do Plano Gratuito

### Plano Hobby (Gratuito)

✅ **Incluído:**
- 100 GB de banda por mês
- Builds ilimitados
- Deploy automático
- SSL/HTTPS grátis
- Domínio personalizado
- 1 banco de dados Postgres (512 MB)
- 10.000 linhas no banco

✅ **Suficiente para:**
- 10.000-50.000 visitantes/mês
- Loja pequena/média
- Até 1.000 produtos

⚠️ **Se ultrapassar:**
- Vercel te avisa antes
- Você pode fazer upgrade para Pro (US$ 20/mês)
- Ou otimizar o site

---

## 🎉 Parabéns!

Seu site está no ar, profissional e gratuito! 🚀

### Próximos Passos Recomendados

1. ✅ Adicione seus produtos reais
2. ✅ Teste todas as funcionalidades
3. ✅ Configure Google Analytics (opcional)
4. ✅ Divulgue nas redes sociais
5. ✅ Monitore as vendas

### Recursos Úteis

- **Dashboard Vercel**: https://vercel.com/dashboard
- **Documentação Vercel**: https://vercel.com/docs
- **GitHub**: https://github.com
- **Suporte Vercel**: https://vercel.com/support

---

## 📞 Precisa de Ajuda?

Se tiver qualquer dúvida durante o processo, me pergunte! Estou aqui para ajudar! 😊

**Desenvolvido com ❤️ para a Fatia de Minas**

