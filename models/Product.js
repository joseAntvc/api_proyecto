const mongoose = require("mongoose");
const Category = require('./Category');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: String,
    description: String,
    price: Number,
    stock: Number,
    size: String,
    color: [String],
    gender: String, 
    images: [String],
    category: { type: Schema.Types.ObjectId, ref: 'Category' }
}, { collection: 'product' });

const Product = mongoose.model('Product', productSchema)
module.exports = Product
