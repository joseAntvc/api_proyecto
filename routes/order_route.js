const express = require('express');
const router = express.Router();
const { getUserOrders, createOrder } = require('../controllers/order_controller');

router.get('/:userId', getUserOrders);

router.post('/', createOrder)

module.exports = router;
