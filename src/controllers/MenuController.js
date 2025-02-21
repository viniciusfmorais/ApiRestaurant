const { validationResult } = require('express-validator');
const MenuItem = require('../models/MenuItem');

class MenuController {
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description, price, category } = req.body;
      const menuItem = await MenuItem.create({
        name,
        description,
        price,
        category
      });

      return res.status(201).json(menuItem);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async list(req, res) {
    try {
      const { category, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const queryOptions = {
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['name', 'ASC']]
      };

      if (category) {
        if (!['starter', 'main_course', 'dessert', 'drink'].includes(category)) {
          return res.status(400).json({ error: 'Categoria inválida' });
        }
        queryOptions.where = { category };
      }

      const { count, rows } = await MenuItem.findAndCountAll(queryOptions);

      return res.status(200).json({
        items: rows,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = new MenuController();