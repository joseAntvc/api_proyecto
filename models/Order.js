const mongoose = require("mongoose");
const User = require('./User');
const Product = require('./Product');
const Address = require('./Address');
const Billing = require('./Billing');
const Coupon = require('./Coupon');
const Payment = require('./Payment');
const { Schema } = mongoose;

const orderSchema = new Schema({
    date: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    shipping_address: { type: Schema.Types.ObjectId, ref: 'Address' },
    billing_address: { type: Schema.Types.ObjectId, ref: 'Billing' },
    items: [{
      product: { type: Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      price: mongoose.Types.Decimal128
    }],
    total_amount: mongoose.Types.Decimal128,
    coupons: [{ type: Schema.Types.ObjectId, ref: 'Coupon' }],
    payment: { type: Schema.Types.ObjectId, ref: 'Payment' }
}, { collection: 'order' });

const Order = mongoose.model('Order', orderSchema)
module.exports = Order