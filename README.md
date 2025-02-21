# Restaurant Order Manager API

API REST para gerenciamento de pedidos de um restaurante, desenvolvida com Node.js, Express e PostgreSQL.

## Tecnologias Utilizadas

- Node.js (versão LTS)
- PostgreSQL
- Sequelize ORM
- Express
- Jest para testes

## Pré-requisitos

- Node.js (versão LTS)
- PostgreSQL instalado e rodando
- npm ou yarn

## Configuração do Projeto

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/restaurant-api.git
cd restaurant-api
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
- Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL=postgresql://seu_usuario:sua_senha@localhost:5432/restaurant_db
PORT=3000
```

4. Crie o banco de dados:
```sql
CREATE DATABASE restaurant_db;
```

5. Execute as migrations:
```bash
npm run db:migrate
```

## Executando o Projeto

1. Inicie o servidor em modo desenvolvimento:
```bash
npm run dev
```

2. O servidor estará rodando em `http://localhost:3000`

## Executando os Testes

```bash
npm test
```

## Estrutura do Projeto

```
src/
  ├── config/
  │   └── database.js
  ├── models/
  │   ├── Customer.js
  │   ├── MenuItem.js
  │   ├── Order.js
  │   └── OrderItem.js
  ├── controllers/
  │   ├── CustomerController.js
  │   ├── MenuController.js
  │   └── OrderController.js
  ├── routes/
  │   ├── customerRoutes.js
  │   ├── menuRoutes.js
  │   └── orderRoutes.js
  ├── validators/
  │   ├── customerValidator.js
  │   ├── menuValidator.js
  │   └── orderValidator.js
  └── app.js
```

## Endpoints da API

### Clientes
- `POST /customer` - Criar novo cliente
- `GET /customer` - Listar clientes
- `GET /customer/orders/:customer_id` - Listar pedidos do cliente

### Menu
- `POST /menu` - Adicionar item ao menu
- `GET /menu` - Listar menu (suporta filtros por categoria)

### Pedidos
- `POST /order` - Criar pedido
- `PATCH /order/:order_id` - Atualizar status do pedido
- `PATCH /order/modify/:order_id` - Modificar itens do pedido

## Status do Pedido

Os status possíveis para um pedido são:
- pending
- preparing
- ready
- delivered
- canceled