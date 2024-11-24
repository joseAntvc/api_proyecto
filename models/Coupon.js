const mongoose = require("mongoose");
const { Schema } = mongoose;

const couponSchema = new Schema({
    code: { type: String, unique: true },
    percentage: Number,
    expiration: Date,
    minimum_amount: Number
  }, { collection: 'coupon' });

const Coupon = mongoose.model('Coupon', couponSchema)
module.exports = Coupon