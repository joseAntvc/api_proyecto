const mongoose = require("mongoose");
const Product = require('./Product');
const { Schema } = mongoose;

const userSalesSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  products: [{
    product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: mongoose.Types.Decimal128
  }]
}, { collection: 'usersales' });

const UserSales = mongoose.model('UserSales', userSalesSchema)
module.exports = UserSales