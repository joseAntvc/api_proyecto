const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/report_controller');

// Ruta para obtener el reporte de ventas
router.get('/sales', reportsController.getSalesReport);
router.get('/buy/:Id', reportsController.getVentasAnuales);
router.get('/sales/:Id', reportsController.getPedidosAnuales);


module.exports = router;