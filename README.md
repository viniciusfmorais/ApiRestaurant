# Restaurant Order Manager API

REST API for restaurant order management, developed with Node.js, Express, and PostgreSQL.

## Technologies Used

- Node.js (LTS version)
- PostgreSQL
- Sequelize ORM
- Express
- Jest for testing

## Prerequisites

- Node.js (LTS version)
- PostgreSQL installed and running
- npm or yarn

## Project Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/restaurant-api.git
cd restaurant-api
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
- Create a `.env` file in the project root:
```env
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/restaurant_db
PORT=3000
```

4. Create the database:
```sql
CREATE DATABASE restaurant_db;
```

5. Run migrations:
```bash
npm run db:migrate
```

## Running the Project

1. Start the server in development mode:
```bash
npm run dev
```

2. The server will be running at `http://localhost:3000`

## Running Tests

```bash
npm test
```

## Project Structure

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

## API Endpoints

### Customers
- `POST /customer` - Create new customer
- `GET /customer` - List customers
- `GET /customer/orders/:customer_id` - List customer orders

### Menu
- `POST /menu` - Add menu item
- `GET /menu` - List menu (supports category filters)

### Orders
- `POST /order` - Create order
- `PATCH /order/:order_id` - Update order status
- `PATCH /order/modify/:order_id` - Modify order items

## Order Status

Possible order statuses are:
- pending
- preparing
- ready
- delivered
- canceled

## API Examples

### Create Customer
```json
POST /customer
{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890"
}
```

### Create Menu Item
```json
POST /menu
{
    "name": "Mushroom Risotto",
    "description": "Creamy risotto with fresh mushrooms",
    "price": 45.90,
    "category": "main_course"
}
```

### Create Order
```json
POST /order
{
    "customer_id": 1,
    "items": [
        {
            "menu_item_id": 1,
            "quantity": 2
        },
        {
            "menu_item_id": 2,
            "quantity": 1
        }
    ]
}
```

### Update Order Status
```json
PATCH /order/1
{
    "status": "preparing"
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details