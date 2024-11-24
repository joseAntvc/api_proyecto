const mongoose = require("mongoose");
const Order = require('./Order');
const Payment = require('./Payment');
const { Schema } = mongoose;

const orderStatusSchema = new Schema({
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
    payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
    status: String,
    updated_at: { type: Date, default: Date.now }
}, { collection: 'orderstatus' });

const OrderStatus = mongoose.model('OrderStatus', orderStatusSchema)
module.exports = OrderStatus
