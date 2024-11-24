const mongoose = require("mongoose");
const Category = require('./Category');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: String,
    description: String,
    price: Number,
    stock: Number,
    images: [String],
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }]
}, { collection: 'product' });

const Product = mongoose.model('Product', productSchema)
module.exports = Product
