const request = require('supertest');
const app = require('../src/app');
const { Order, OrderItem } = require('../src/models/Order');
const Customer = require('../src/models/Customer');
const MenuItem = require('../src/models/MenuItem');

describe('Order Management', () => {
  let customer;
  let menuItem;

  beforeEach(async () => {
    await Order.destroy({ where: {} });
    await Customer.destroy({ where: {} });
    await MenuItem.destroy({ where: {} });

    customer = await Customer.create({
      name: 'Test Customer',
      email: 'test@test.com',
      phone: '123456789'
    });

    menuItem = await MenuItem.create({
      name: 'Test Item',
      description: 'Test Description',
      price: 10.00,
      category: 'main_course'
    });
  });

  test('Should create a new order', async () => {
    const response = await request(app)
      .post('/order')
      .send({
        customer_id: customer.id,
        items: [{
          menu_item_id: menuItem.id,
          quantity: 2
        }]
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.total_amount).toBe('20.00');
  });
});
