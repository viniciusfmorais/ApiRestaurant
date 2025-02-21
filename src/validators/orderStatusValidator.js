const { body } = require('express-validator');

const orderStatusValidationRules = [
  body('status')
    .isIn(['pending', 'preparing', 'ready', 'delivered', 'canceled'])
    .withMessage('Status inválido. Use: pending, preparing, ready, delivered ou canceled')
];

module.exports = orderStatusValidationRules;