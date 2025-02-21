const request = require('supertest');
const app = require('../src/app');
const MenuItem = require('../src/models/MenuItem');

describe('Menu Management', () => {
  beforeEach(async () => {
    await MenuItem.destroy({ where: {} });
  });

  test('Should create a new menu item', async () => {
    const response = await request(app)
      .post('/menu')
      .send({
        name: 'Risoto de Funghi',
        description: 'Risoto cremoso com cogumelos',
        price: 45.90,
        category: 'main_course'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Risoto de Funghi');
  });

  test('Should not create menu item with invalid category', async () => {
    const response = await request(app)
      .post('/menu')
      .send({
        name: 'Risoto de Funghi',
        description: 'Risoto cremoso com cogumelos',
        price: 45.90,
        category: 'invalid_category'
      });

    expect(response.status).toBe(400);
  });

  test('Should list menu items with pagination', async () => {
    await MenuItem.create({
      name: 'Risoto de Funghi',
      description: 'Risoto cremoso com cogumelos',
      price: 45.90,
      category: 'main_course'
    });

    const response = await request(app)
      .get('/menu')
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('items');
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('page');
    expect(response.body).toHaveProperty('totalPages');
  });
});