const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/MenuController');
const menuValidationRules = require('../validators/menuValidator');

router.post('/menu', menuValidationRules, MenuController.create);
router.get('/menu', MenuController.list);

module.exports = router;