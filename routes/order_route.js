const express = require('express');
const router = express.Router();
const { getUserOrders } = require('../controllers/order_controller');

router.get('/:userId', getUserOrders);

module.exports = router;
