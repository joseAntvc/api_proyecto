const mongoose = require("mongoose");
const User = require('./User');
const Product = require('./Product');
const { Schema } = mongoose;

const shoppingCartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    products: [{
      product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      amount: mongoose.Types.Decimal128
    }]
}, { collection: 'shoppingcart' });

const ShoppingCart = mongoose.model('ShoppingCart', shoppingCartSchema)
module.exports = ShoppingCart
