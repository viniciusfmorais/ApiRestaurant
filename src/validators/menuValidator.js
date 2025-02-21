const { body } = require('express-validator');

const menuValidationRules = [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('description').notEmpty().withMessage('Descrição é obrigatória'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Preço deve ser maior ou igual a zero'),
  body('category')
    .isIn(['starter', 'main_course', 'dessert', 'drink'])
    .withMessage('Categoria inválida')
];

module.exports = menuValidationRules;