const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/CustomerController');
const customerValidationRules = require('../validators/customerValidator');

router.post('/customer', customerValidationRules, CustomerController.create);
router.get('/customer', CustomerController.list);
router.get('/customer/orders/:customer_id', CustomerController.listOrders);

module.exports = router;