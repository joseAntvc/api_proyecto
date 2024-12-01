const AWS = require('aws-sdk');
const multer = require('multer');


const s3 = new AWS.S3({ region: 'us-east-1' });


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const generateSignedUrl = async (req, res) => {
    const filename = req.params.filename;
    let user = req.params.user; 
    const bucketName = 'tedw21031011';

    const params = {
        Bucket: bucketName,
        Key: filename,
        Expires: 60, // Expiración de la URL en segundos
    };

    try {
        const signedUrl = s3.getSignedUrl('getObject', params);
        res.status(200).json({ url: signedUrl });
    } catch (error) {
        console.error('Error al generar la URL firmada:', error);
        res.status(500).json({ message: 'Error al generar la URL firmada', error: error.message });
    }
};

// Función para subir una imagen y retornar su URL pública
const uploadImage = async (req, res) => {
    const bucketName = 'tedw21031011';
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'No se proporcionó ningún archivo.' });
    }

    // Nombre del archivo en S3
    const key = `proyecto/${Date.now()}_${file.originalname}`;

    const params = {
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        await s3.upload(params).promise();

        // URL pública del archivo
        const publicUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;

        res.status(200).json({ url: publicUrl });
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        res.status(500).json({ message: 'Error al subir la imagen', error: error.message });
    }
};

module.exports = { generateSignedUrl, uploadImage, upload };
