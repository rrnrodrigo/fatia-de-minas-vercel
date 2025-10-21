# Integração com Google Sheets - Fatia de Minas

## Visão Geral

O painel administrativo do site permite importar produtos diretamente de uma planilha CSV do Google Sheets. Esta documentação explica como configurar e usar essa funcionalidade.

## Formato da Planilha

A planilha deve estar no formato CSV com as seguintes colunas (nesta ordem):

```
id,nome,categoria,preco,preco_promocional,descricao,imagem,estoque,ativo
```

### Descrição das Colunas

| Coluna | Tipo | Obrigatório | Descrição | Exemplo |
|--------|------|-------------|-----------|---------|
| id | número | Não | ID do produto (será gerado automaticamente) | 1 |
| nome | texto | Sim | Nome do produto | Queijo Canastra Artesanal |
| categoria | texto | Sim | Categoria do produto | Queijos |
| preco | número | Sim | Preço em centavos | 8990 |
| preco_promocional | número | Não | Preço promocional em centavos (opcional) | 7990 |
| descricao | texto | Não | Descrição detalhada do produto | Queijo artesanal... |
| imagem | texto | Não | Nome do arquivo de imagem | canastra2.jpeg |
| estoque | número | Sim | Quantidade em estoque | 15 |
| ativo | booleano | Sim | Se o produto está ativo | true |

### Categorias Disponíveis

- Queijos
- Doces
- Bebidas
- Embutidos
- Biscoitos Finos
- Mercearia

## Como Usar

### 1. Preparar a Planilha no Google Sheets

1. Acesse o Google Sheets e crie uma nova planilha
2. Adicione o cabeçalho na primeira linha:
   ```
   id,nome,categoria,preco,preco_promocional,descricao,imagem,estoque,ativo
   ```
3. Preencha os dados dos produtos nas linhas seguintes

### 2. Exportar como CSV

1. No Google Sheets, clique em **Arquivo** → **Fazer download** → **Valores separados por vírgula (.csv)**
2. Salve o arquivo no seu computador

### 3. Importar no Painel Administrativo

1. Acesse o painel administrativo em `/admin`
2. Clique no botão **"Importar CSV"**
3. Selecione o arquivo CSV que você baixou
4. Os produtos serão importados automaticamente

## Exemplo de Planilha

Aqui está um exemplo de como sua planilha deve estar formatada:

```csv
id,nome,categoria,preco,preco_promocional,descricao,imagem,estoque,ativo
1,Queijo Canastra Artesanal,Queijos,8990,7990,"Queijo Canastra artesanal de sabor incomparável",canastra2.jpeg,15,true
2,Queijo Minas Padrão,Queijos,4550,,"Queijo Minas tradicional com sabor suave",padrao.jpg,25,true
3,Doce de Leite,Doces,1850,,"Doce de leite cremoso e tradicional",docedeleite.jpg,30,true
```

## Observações Importantes

### Preços

- Os preços devem ser informados em **centavos**
- Exemplo: R$ 89,90 = 8990 centavos
- O campo `preco_promocional` é opcional. Se não houver promoção, deixe vazio

### Imagens

- As imagens devem estar na pasta `client/public/images/`
- Informe apenas o nome do arquivo (ex: `canastra2.jpeg`)
- Formatos suportados: JPG, JPEG, PNG, WEBP

### Status do Produto

- Use `true` para produtos ativos (visíveis no site)
- Use `false` para produtos inativos (ocultos no site)

## Atualização de Produtos

Para atualizar produtos existentes:

1. Edite diretamente no painel administrativo clicando no botão de editar
2. Ou importe um novo CSV (produtos duplicados serão criados novamente)

## Gerenciamento Manual

Além da importação em massa, você pode:

- **Criar produtos individualmente**: Clique em "Novo Produto" no painel
- **Editar produtos**: Clique no ícone de lápis ao lado do produto
- **Excluir produtos**: Clique no ícone de lixeira (soft delete - produto fica inativo)

## Integração Futura com Google Sheets API

Para sincronização automática em tempo real, será necessário:

1. Criar um projeto no Google Cloud Console
2. Ativar a Google Sheets API
3. Criar credenciais de serviço
4. Configurar as variáveis de ambiente no servidor
5. Implementar sincronização periódica

Esta funcionalidade pode ser adicionada em uma versão futura do sistema.

## Suporte

Para dúvidas ou problemas com a importação:

- Verifique se o formato CSV está correto
- Certifique-se de que as imagens existem na pasta correta
- Confira se os preços estão em centavos
- Valide que as categorias estão escritas corretamente

