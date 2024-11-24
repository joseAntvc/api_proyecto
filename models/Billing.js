const mongoose = require("mongoose");
const Address = require('./Address');
const { Schema } = mongoose;

const billingSchema = new Schema({
    company: String,
    email: String,
    phone: String,
    address: { type: Schema.Types.ObjectId, ref: 'Address' }
  }, { collection: 'billing' });

const Billing = mongoose.model('Billing', billingSchema)
module.exports = Billing