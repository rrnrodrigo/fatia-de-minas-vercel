# 🧀 Fatia de Minas - Site E-commerce

## Sobre o Projeto

Site e-commerce completo para a **Fatia de Minas**, loja especializada em produtos artesanais mineiros. O site foi desenvolvido com foco em design impactante, experiência do usuário e conversão de vendas.

### Descrição da Empresa

A Fatia de Minas nasceu do desejo de levar o verdadeiro sabor mineiro para o coração do Rio de Janeiro. Mais do que simples queijos, somos um pedacinho de Minas presente em cada queijo, doce, geleia, cachaça e iguaria que oferecemos.

Trabalhamos com produtos selecionados criteriosamente, direto de pequenos produtores mineiros, garantindo frescor, qualidade e aquele gostinho caseiro que só Minas sabe ter.

## 🎨 Características do Design

### Paleta de Cores
- **Primária**: Terracota (#C84B31) - Remete às cores quentes de Minas Gerais
- **Secundária**: Dourado (#F4A261) - Representa a riqueza e qualidade dos produtos
- **Neutras**: Cinzas e brancos para equilíbrio visual

### Tipografia
- **Títulos**: Playfair Display (elegante e sofisticada)
- **Textos**: Poppins (moderna e legível)

### Elementos Visuais
- Hero carousel com imagens de alta qualidade
- Cards de produtos com efeitos hover
- Badges de desconto em destaque
- Ícones ilustrativos para categorias
- Botão flutuante do WhatsApp

## 🚀 Funcionalidades

### Para Clientes

#### Página Principal
- ✅ Hero carousel rotativo com 3 slides
- ✅ Menu de categorias com ícones
- ✅ Seção de benefícios (frete grátis, parcelamento, etc.)
- ✅ Produtos organizados por categoria
- ✅ Sistema de expandir/recolher categorias
- ✅ Depoimentos de clientes
- ✅ Newsletter para captura de e-mails
- ✅ Rodapé completo com informações

#### Sistema de Produtos
- ✅ Cards com imagem, nome, preço e descrição
- ✅ Exibição de preço promocional (quando aplicável)
- ✅ Badge de desconto percentual
- ✅ Botão "Adicionar ao Carrinho"
- ✅ Indicador de estoque

#### Carrinho de Compras
- ✅ Visualização de todos os itens
- ✅ Ajuste de quantidade (+/-)
- ✅ Remoção de itens
- ✅ Cálculo automático de subtotais e total
- ✅ Formulário de dados do cliente
- ✅ Integração com WhatsApp para finalização

#### Integração WhatsApp
- ✅ Envio automático do pedido formatado
- ✅ Inclui dados do cliente e itens
- ✅ Botão flutuante em todas as páginas
- ✅ Mensagem pré-formatada com todos os detalhes

### Para Administradores

#### Painel Administrativo (`/admin`)
- ✅ Listagem completa de produtos
- ✅ Criação de novos produtos
- ✅ Edição de produtos existentes
- ✅ Exclusão de produtos
- ✅ Importação em massa via CSV
- ✅ Upload de imagens
- ✅ Controle de estoque
- ✅ Ativação/desativação de produtos

## 📁 Estrutura do Projeto

```
fatia-de-minas/
├── client/                      # Frontend React
│   ├── public/
│   │   └── images/             # Imagens dos produtos
│   │       ├── logo.png
│   │       ├── canastra2.jpeg
│   │       ├── docedeleite.jpg
│   │       └── ...
│   └── src/
│       ├── components/         # Componentes reutilizáveis
│       │   ├── Header.tsx
│       │   ├── Footer.tsx
│       │   └── ProductCard.tsx
│       ├── pages/             # Páginas do site
│       │   ├── Home.tsx       # Página principal
│       │   ├── Cart.tsx       # Carrinho de compras
│       │   └── Admin.tsx      # Painel administrativo
│       ├── lib/
│       │   └── trpc.ts        # Cliente tRPC
│       └── index.css          # Estilos globais
├── server/                    # Backend Node.js
│   ├── routers.ts            # Rotas tRPC
│   └── db.ts                 # Funções de banco de dados
├── drizzle/                  # Schema do banco de dados
│   └── schema.ts
└── shared/                   # Código compartilhado
    └── const.ts
```

## 🗄️ Banco de Dados

### Tabelas

#### products
- `id`: ID único do produto
- `nome`: Nome do produto
- `categoria`: Categoria (Queijos, Doces, etc.)
- `preco`: Preço em centavos
- `precoPromocional`: Preço promocional (opcional)
- `descricao`: Descrição detalhada
- `imagem`: Nome do arquivo de imagem
- `estoque`: Quantidade em estoque
- `ativo`: Se o produto está ativo
- `createdAt`: Data de criação

#### cart_items
- `id`: ID único do item
- `sessionId`: ID da sessão do cliente
- `productId`: ID do produto
- `quantidade`: Quantidade no carrinho
- `createdAt`: Data de adição

#### orders
- `id`: ID único do pedido
- `sessionId`: ID da sessão do cliente
- `nome`: Nome do cliente
- `telefone`: Telefone do cliente
- `endereco`: Endereço de entrega
- `items`: JSON com itens do pedido
- `total`: Valor total em centavos
- `status`: Status do pedido
- `createdAt`: Data do pedido

## 🔧 Tecnologias Utilizadas

### Frontend
- **React 19**: Biblioteca JavaScript para interfaces
- **TypeScript**: Tipagem estática
- **Tailwind CSS 4**: Framework CSS utilitário
- **shadcn/ui**: Componentes UI modernos
- **Wouter**: Roteamento leve
- **tRPC**: Comunicação type-safe com backend
- **Lucide React**: Ícones

### Backend
- **Node.js**: Runtime JavaScript
- **Express 4**: Framework web
- **tRPC 11**: API type-safe
- **Drizzle ORM**: ORM TypeScript-first
- **MySQL/TiDB**: Banco de dados

## 📱 Responsividade

O site é totalmente responsivo e otimizado para:
- 📱 Smartphones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Telas grandes (1920px+)

## 🎯 Conversão e UX

### Elementos de Conversão
- Call-to-actions destacados
- Badges de desconto visíveis
- Processo de checkout simplificado
- Integração direta com WhatsApp
- Depoimentos de clientes
- Seção de benefícios em destaque

### Otimizações de Performance
- Lazy loading de imagens
- Componentes otimizados
- Cache de queries
- Carregamento progressivo

## 📦 Como Adicionar Produtos

### Método 1: Painel Administrativo

1. Acesse `/admin`
2. Clique em "Novo Produto"
3. Preencha os campos:
   - Nome do produto
   - Categoria
   - Preço (em reais)
   - Preço promocional (opcional)
   - Descrição
   - Nome da imagem
   - Estoque
   - Status (ativo/inativo)
4. Clique em "Criar"

### Método 2: Importação CSV

1. Prepare uma planilha CSV com o formato correto
2. Acesse `/admin`
3. Clique em "Importar CSV"
4. Selecione o arquivo
5. Os produtos serão importados automaticamente

**Consulte o arquivo `INTEGRACAO_GOOGLE_SHEETS.md` para detalhes sobre o formato CSV.**

## 🖼️ Como Adicionar Imagens

1. Coloque as imagens na pasta `client/public/images/`
2. Formatos suportados: JPG, JPEG, PNG, WEBP
3. Recomendação: imagens quadradas de 800x800px
4. Use nomes descritivos sem espaços (ex: `queijo-canastra.jpg`)

## 📞 Configuração do WhatsApp

Para alterar o número do WhatsApp:

1. Abra o arquivo `client/src/pages/Home.tsx`
2. Localize a linha com `https://wa.me/5521999999999`
3. Substitua pelo seu número no formato internacional
4. Exemplo: `https://wa.me/5521987654321`

Faça o mesmo no arquivo `client/src/pages/Cart.tsx`.

## 🎨 Personalização

### Alterar Cores

Edite o arquivo `client/src/index.css`:

```css
:root {
  --primary: 16 74% 49%;      /* Cor primária */
  --secondary: 25 95% 67%;    /* Cor secundária */
  /* ... outras cores ... */
}
```

### Alterar Fontes

No mesmo arquivo `index.css`, modifique:

```css
@import url('https://fonts.googleapis.com/css2?family=SuaFonte&display=swap');

body {
  font-family: 'SuaFonte', sans-serif;
}
```

### Alterar Logo

1. Substitua o arquivo `client/public/images/logo.png`
2. Mantenha o mesmo nome ou atualize a referência no `Header.tsx`

## 📊 Categorias de Produtos

As categorias disponíveis são:

1. 🧀 **Queijos** - Queijos artesanais mineiros
2. 🍯 **Doces** - Doces tradicionais e geleias
3. 🍷 **Bebidas** - Cachaças e licores
4. 🥓 **Embutidos** - Linguiças e defumados
5. 🍪 **Biscoitos Finos** - Biscoitos artesanais
6. 🛒 **Mercearia** - Manteigas, requeijões e outros

Para adicionar novas categorias, edite:
- `client/src/pages/Home.tsx`
- `client/src/pages/Admin.tsx`

## 🔐 Segurança

- Sessões de carrinho isoladas por cliente
- Validação de dados no backend
- Proteção contra SQL injection (via Drizzle ORM)
- Sanitização de inputs

## 📈 Próximas Melhorias

### Funcionalidades Futuras
- [ ] Sistema de cupons de desconto
- [ ] Programa de fidelidade
- [ ] Avaliações de produtos
- [ ] Busca e filtros avançados
- [ ] Integração com Google Analytics
- [ ] Sistema de pagamento online
- [ ] Painel de relatórios de vendas
- [ ] Sincronização automática com Google Sheets
- [ ] Sistema de notificações por e-mail
- [ ] Rastreamento de pedidos

### Otimizações
- [ ] PWA (Progressive Web App)
- [ ] Service Workers para cache
- [ ] Otimização de imagens (WebP, AVIF)
- [ ] CDN para assets estáticos

## 📞 Suporte

Para dúvidas ou suporte técnico:
- **WhatsApp**: (21) 99999-9999
- **E-mail**: contato@fatiademinas.com.br
- **Instagram**: @fatiademinas

## 📄 Licença

Este projeto foi desenvolvido exclusivamente para a Fatia de Minas.

---

**Desenvolvido com ❤️ e muito queijo mineiro!** 🧀

