const request = require('supertest');
const app = require('../src/app');
const Customer = require('../src/models/Customer');

describe('Customer Registration', () => {
  beforeEach(async () => {
    await Customer.destroy({ where: {} });
  });

  test('Should create a new customer', async () => {
    const response = await request(app)
      .post('/customer')
      .send({
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '11999999999'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('João Silva');
  });

  test('Should not create customer with duplicate email', async () => {
    await Customer.create({
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '11999999999'
    });

    const response = await request(app)
      .post('/customer')
      .send({
        name: 'João Silva 2',
        email: 'joao@email.com',
        phone: '11999999999'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Email já cadastrado');
  });
});