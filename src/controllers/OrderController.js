const { validationResult } = require('express-validator');
const sequelize = require('../config/database');
const { Customer, MenuItem, Order, OrderItem } = require('../models');

class OrderController {
  async create(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { customer_id, items } = req.body;

      // Verificar se cliente existe
      const customer = await Customer.findByPk(customer_id);
      if (!customer) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }

      // Verificar se todos os itens do menu existem
      const menuItems = await MenuItem.findAll({
        where: {
          id: items.map(item => item.menu_item_id)
        }
      });

      if (menuItems.length !== items.length) {
        return res.status(404).json({ error: 'Um ou mais itens do menu não encontrados' });
      }

      // Criar pedido
      const order = await Order.create({
        customer_id,
        status: 'pending',
        total_amount: 0
      }, { transaction });

      // Criar itens do pedido e calcular total
      let totalAmount = 0;
      await Promise.all(
        items.map(async (item) => {
          const menuItem = menuItems.find(mi => mi.id === item.menu_item_id);
          const subtotal = parseFloat(menuItem.price) * item.quantity;
          totalAmount += subtotal;

          await OrderItem.create({
            order_id: order.id,
            menu_item_id: item.menu_item_id,
            quantity: item.quantity,
            unit_price: menuItem.price,
            subtotal
          }, { transaction });
        })
      );

      // Atualizar valor total do pedido
      await order.update({ total_amount: totalAmount }, { transaction });

      await transaction.commit();

      // Carregar pedido completo com itens
      const completeOrder = await Order.findByPk(order.id, {
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [{
              model: MenuItem,
              as: 'menuItem'
            }]
          }
        ]
      });

      return res.status(201).json(completeOrder);
    } catch (error) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      console.error('Erro ao criar pedido:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async updateStatus(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { order_id } = req.params;
      const { status } = req.body;

      const order = await Order.findByPk(order_id);
      
      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      await order.update({ status });

      const updatedOrder = await Order.findByPk(order_id, {
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [{
              model: MenuItem,
              as: 'menuItem'
            }]
          }
        ]
      });

      return res.status(200).json(updatedOrder);
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async modifyOrder(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { order_id } = req.params;
      const { items } = req.body;

      // Buscar pedido
      const order = await Order.findByPk(order_id, {
        include: [{
          model: OrderItem,
          as: 'items'
        }]
      });

      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      // Verificar status do pedido
      if (!['pending', 'preparing'].includes(order.status)) {
        return res.status(400).json({ 
          error: 'Pedido não pode ser modificado no status atual'
        });
      }

      // Verificar se todos os itens do menu existem
      const menuItems = await MenuItem.findAll({
        where: {
          id: items.map(item => item.menu_item_id)
        }
      });

      if (menuItems.length !== items.length) {
        return res.status(404).json({ error: 'Um ou mais itens do menu não encontrados' });
      }

      // Remover itens antigos
      await OrderItem.destroy({
        where: { order_id: order.id },
        transaction
      });

      // Criar novos itens e calcular total
      let totalAmount = 0;
      await Promise.all(
        items.map(async (item) => {
          const menuItem = menuItems.find(mi => mi.id === item.menu_item_id);
          const subtotal = parseFloat(menuItem.price) * item.quantity;
          totalAmount += subtotal;

          await OrderItem.create({
            order_id: order.id,
            menu_item_id: item.menu_item_id,
            quantity: item.quantity,
            unit_price: menuItem.price,
            subtotal
          }, { transaction });
        })
      );

      // Atualizar valor total do pedido
      await order.update({ total_amount: totalAmount }, { transaction });

      await transaction.commit();

      // Carregar pedido atualizado
      const updatedOrder = await Order.findByPk(order.id, {
        include: [{
          model: OrderItem,
          as: 'items',
          include: [{
            model: MenuItem,
            as: 'menuItem'
          }]
        }]
      });

      return res.status(200).json(updatedOrder);
    } catch (error) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      console.error('Erro ao modificar pedido:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = new OrderController();