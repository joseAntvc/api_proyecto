const Product = require('../models/Product');
const UserSales = require('../models/UserSales');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({ region: 'us-east-1' });
const bucketName = 'tedw21031011';

const fetchAll = async (req, res) =>{
    try {
        const products = await Product.find().populate("category");
        res.send(products);
    } catch (err) {
        res.status(500).send('Error retrieving products: ' + err.message);
    }
};

const fetchById = async (req, res) => {
  try {
      const productId = req.params.productId;
      const product = await Product.findById(productId).populate("category");
      if (!product) {
          return res.status(404).send('Product not found');
      }
      res.send(product);
  } catch (err) {
      res.status(500).send('Error retrieving product by ID: ' + err.message);
  }
};

const fetchByCategory = async (req, res) => {
  try {
      const categoryId = req.params.categoryId;
      const products = await Product.find({ category: categoryId }).populate("category");
      if (products.length === 0) {
          return res.status(404).send('No products found for this category');
      }
      res.send(products);
  } catch (err) {
      res.status(500).send('Error retrieving products by category: ' + err.message);
  }
};

const fetchByName = async (req, res) => {
    try {
        const productName = req.query.name;
        const categoryId = req.params.categoryId; 
        const query = {
            name: { $regex: productName, $options: 'i' }, // Insensible a mayúsculas y minúsculas
        };

        if (categoryId) {
            query.category = categoryId;
        }

        const products = await Product.find(query).populate("category");

        if (products.length === 0) {
            return res.status(404).send('No se encontraron productos con ese nombre.');
        }
        res.send(products);
    } catch (err) {
        res.status(500).send('Error al buscar productos por nombre: ' + err.message);
    }
};

const fetchByUser = async (req, res) => {
  try {
      const userId = req.params.userId;
      const userSales = await UserSales.findOne({ user: userId })
          .populate({
              path: 'products.product_id',
              populate: {
                  path: 'category',
              },
          });
      
      if (!userSales) {
          return res.status(404).send('No sales found for this user');
      }
      
      res.send(userSales.products);
  } catch (err) {
      res.status(500).send('Error retrieving products: ' + err.message);
  }
};


const create = async (req, res) => {
    try {
        const userId = req.body.userId;
        const file = req.file; // Obteniendo archivo desde Multer
        let imageUrl = null;


        if (file) {
            // Subir imagen a S3
            const key = `proyecto/${userId}_${file.originalname}`;
            const params = {
                Bucket: bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            };

            await s3.upload(params).promise();
            imageUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;
        }

        // Crear el producto
        const product = new Product({
            ...req.body,
            images: imageUrl ? [imageUrl] : [] // Agregar URL de la imagen al producto
        });

        await product.save();

        
        let userSales = await UserSales.findOne({ user: userId });

        if (!userSales) {
            userSales = new UserSales({ user: userId, products: [] });
        }

        userSales.products.push({
            product_id: product._id,
        });

        await userSales.save();

        res.status(201).json({ product, userSales });
    } catch (err) {
        console.error('Error al crear el producto:', err);
        res.status(400).send('Error al crear el producto: ' + err.message);
    }
};

const update = async (req, res) => {
    console.log(req.body.userId)
    try {
        const userId = req.body.userId;
        const file = req.file; // Obteniendo archivo desde Multer
        let imageUrl = null;

        if (file) {
            // Subir imagen a S3
            const key = `proyecto/${userId}_${file.originalname}`;
            const params = {
                Bucket: bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            };

            await s3.upload(params).promise();
            imageUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;
        }

        // Actualizar el producto
        const updatedData = {
            ...req.body,
            ...(imageUrl && { images: [imageUrl] }), // Agregar la nueva URL de la imagen si existe
        };

        const product = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        if (!product) {
            return res.status(404).send('The product with the given ID was not found.');
        }

        res.send(product);
    } catch (err) {
        console.error('Error al actualizar el producto:', err);
        res.status(400).send('Error al actualizar el producto: ' + err.message);
    }
};


const remove = async (req, res) => {
    try {
      // Eliminar el producto de la colección de productos
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) return res.status(404).send('The product with the given ID was not found.');
  
      // Eliminar todas las referencias de este producto en la colección usersales
      await UserSales.updateMany(
        { "products.product_id": req.params.id },
        { $pull: { products: { product_id: req.params.id } } }
      );
  
      res.send({ message: 'Product deleted successfully, references removed from UserSales.' });
    } catch (err) {
      res.status(500).send('Error deleting product: ' + err.message);
    }
  };
  
  


module.exports = {fetchAll, fetchById, create, update, remove, fetchByUser, fetchByCategory, fetchByName }