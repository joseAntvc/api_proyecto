const ShoppingCart = require('../models/ShoppingCart');
const Product = require('../models/Product');

// Obtener el carrito de compras de un usuario
const fetchCart = async (req, res) => {
    try {
        const cart = await ShoppingCart.findOne({ user: req.params.userId }).populate('products.product_id');
        if (!cart) {
            return res.status(404).send('Shopping cart not found.');
        }
        res.send(cart);
    } catch (err) {
        res.status(500).send('Error retrieving shopping cart: ' + err.message);
    }
};

// Crear un carrito de compras para un usuario (si no existe)
const createCart = async (req, res) => {
    try {
        const existingCart = await ShoppingCart.findOne({ user: req.body.user });
        if (existingCart) {
            return res.status(400).send('User already has a shopping cart.');
        }

        const cart = new ShoppingCart(req.body);
        await cart.save();
        res.send(cart);
    } catch (err) {
        res.status(400).send('Error creating shopping cart: ' + err.message);
    }
};

// Agregar un producto al carrito
const addProductToCart = async (req, res) => {
    try {
        const cart = await ShoppingCart.findOne({ user: req.params.userId });
        if (!cart) return res.status(404).send('Shopping cart not found.');

        const product = await Product.findById(req.body.product_id);
        if (!product) return res.status(404).send('Product not found.');

        // Verificar si el producto ya está en el carrito
        const existingProductIndex = cart.products.findIndex(p => p.product_id.toString() === req.body.product_id);
        
        if (existingProductIndex > -1) {
            // Si el producto ya está, actualizar la cantidad y el monto
            cart.products[existingProductIndex].quantity += req.body.quantity;
            cart.products[existingProductIndex].amount += req.body.amount;
        } else {
            // Si no está, agregarlo al carrito
            cart.products.push({
                product_id: req.body.product_id,
                quantity: req.body.quantity,
                amount: req.body.amount
            });
        }

        await cart.save();
        res.send(cart);
    } catch (err) {
        res.status(400).send('Error adding product to shopping cart: ' + err.message);
    }
};

// Actualizar la cantidad de un producto en el carrito
const updateProductQuantity = async (req, res) => {
    try {
        const cart = await ShoppingCart.findOne({ user: req.params.userId });
        if (!cart) return res.status(404).send('Shopping cart not found.');

        const productIndex = cart.products.findIndex(p => p.product_id.toString() === req.params.productId);
        if (productIndex === -1) return res.status(404).send('Product not found in cart.');

        cart.products[productIndex].quantity = req.body.quantity;
        cart.products[productIndex].amount = req.body.amount;

        await cart.save();
        res.send(cart);
    } catch (err) {
        res.status(400).send('Error updating product quantity in shopping cart: ' + err.message);
    }
};

// Eliminar un producto del carrito
const removeProductFromCart = async (req, res) => {
    try {
        const cart = await ShoppingCart.findOne({ user: req.params.userId });
        if (!cart) return res.status(404).send('Shopping cart not found.');

        const productIndex = cart.products.findIndex(p => p.product_id.toString() === req.params.productId);
        if (productIndex === -1) return res.status(404).send('Product not found in cart.');

        cart.products.splice(productIndex, 1); // Eliminar el producto

        await cart.save();
        res.send(cart);
    } catch (err) {
        res.status(500).send('Error removing product from shopping cart: ' + err.message);
    }
};

// Eliminar el carrito completo de un usuario
const removeCart = async (req, res) => {
    try {
        const cart = await ShoppingCart.findOneAndDelete({ user: req.params.userId });
        if (!cart) return res.status(404).send('Shopping cart not found.');
        res.send({ message: 'Shopping cart deleted successfully' });
    } catch (err) {
        res.status(500).send('Error deleting shopping cart: ' + err.message);
    }
};

module.exports = { fetchCart, createCart, addProductToCart, updateProductQuantity, removeProductFromCart, removeCart };