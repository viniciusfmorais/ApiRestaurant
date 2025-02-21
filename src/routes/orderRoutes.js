const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const orderValidationRules = require('../validators/orderValidator');
const orderStatusValidationRules = require('../validators/orderStatusValidator');
const orderModifyValidationRules = require('../validators/orderModifyValidator');

router.post('/order', orderValidationRules, OrderController.create);
router.patch('/order/:order_id', orderStatusValidationRules, OrderController.updateStatus);
router.patch('/order/modify/:order_id', orderModifyValidationRules, OrderController.modifyOrder);

module.exports = router;