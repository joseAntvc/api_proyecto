const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
    name: String
}, { collection: 'category' });

const Category = mongoose.model('Category', categorySchema)
module.exports = Category