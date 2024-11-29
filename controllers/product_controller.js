const UserSales = require('../models/UserSales'); 
const Product = require('../models/Product');

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
    const product = new Product(req.body);
    await product.save();

    const userId = req.body.userId;
    let userSales = await UserSales.findOne({ user: userId });

    if (!userSales) {
      userSales = new UserSales({
        user: userId,
        products: []
      });
    }

    userSales.products.push({
      product_id: product._id,
      quantity: req.body.quantity || 1,
      price: req.body.price || product.price
    });

    await userSales.save();

    res.send({ product, userSales });
  } catch (err) {
    res.status(400).send('Error saving product and updating user sales: ' + err.message);
  }
};

const update = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).send('The product with the given ID was not found.');
        res.send(product);
    } catch (err) {
        res.status(400).send('Error updating product: ' + err.message);
    }
};

const remove = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).send('The product with the given ID was not found.');
        res.send({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).send('Error deleting product: ' + err.message);
    }
};

module.exports = {fetchAll, fetchById, create, update, remove, fetchByUser, fetchByCategory }