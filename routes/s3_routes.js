const express = require('express');
const router = express.Router();
const s3Controller = require('../controllers/s3_controller');

// Ruta para generar una URL firmada para un archivo en S3
router.get('/product_url/:filename', s3Controller.generateSignedUrl);

// Ruta para subir una imagen
router.post('/upload_image', s3Controller.upload.single('image'), s3Controller.uploadImage);

module.exports = router;
