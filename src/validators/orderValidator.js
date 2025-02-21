const { body } = require('express-validator');

const orderValidationRules = [
  body('customer_id')
    .isInt()
    .withMessage('ID do cliente inválido'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Pedido deve ter pelo menos um item'),
  body('items.*.menu_item_id')
    .isInt()
    .withMessage('ID do item do menu inválido'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantidade deve ser maior que zero')
];

module.exports = orderValidationRules;