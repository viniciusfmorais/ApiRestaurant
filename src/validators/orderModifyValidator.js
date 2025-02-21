const { body } = require('express-validator');

const orderModifyValidationRules = [
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

module.exports = orderModifyValidationRules;