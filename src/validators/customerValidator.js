const { body } = require('express-validator');

const customerValidationRules = [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('phone').notEmpty().withMessage('Telefone é obrigatório')
];

module.exports = customerValidationRules;