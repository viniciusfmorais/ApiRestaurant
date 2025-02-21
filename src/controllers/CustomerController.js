const { validationResult } = require('express-validator');
const { Customer, Order, OrderItem, MenuItem } = require('../models');

class CustomerController {
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, phone } = req.body;

      const existingCustomer = await Customer.findOne({ where: { email } });
      if (existingCustomer) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      const customer = await Customer.create({ name, email, phone });
      return res.status(201).json(customer);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async list(req, res) {
    try {
      const customers = await Customer.findAll({
        order: [['name', 'ASC']]
      });
      return res.status(200).json(customers);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async listOrders(req, res) {
    try {
      const { customer_id } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      // Verificar se cliente existe
      const customer = await Customer.findByPk(customer_id);
      if (!customer) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }

      // Buscar pedidos do cliente
      const { count, rows: orders } = await Order.findAndCountAll({
        where: { customer_id },
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [{
              model: MenuItem,
              as: 'menuItem',
              attributes: ['name', 'price']
            }]
          }
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });

      const totalPages = Math.ceil(count / limit);

      // Formatar resposta
      const formattedOrders = orders.map(order => ({
        id: order.id,
        status: order.status,
        total_value: order.total_amount,
        createdAt: order.createdAt,
        items: order.items.map(item => ({
          name: item.menuItem.name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.subtotal
        }))
      }));

      return res.status(200).json({
        orders: formattedOrders,
        pagination: {
          total: count,
          totalPages,
          currentPage: page,
          itemsPerPage: limit
        }
      });
    } catch (error) {
      console.error('Erro ao listar pedidos:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = new CustomerController();