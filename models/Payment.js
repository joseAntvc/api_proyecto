const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema({
    type: String
}, { collection: 'payment' });

const Payment = mongoose.model('Payment', paymentSchema)
module.exports = Payment