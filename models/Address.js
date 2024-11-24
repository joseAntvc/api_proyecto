const mongoose = require("mongoose");
const { Schema } = mongoose;

const addressSchema = new Schema({
  country: String,
  city: String,
  postal_code: String,
  street: String,
}, { collection: 'address' });

const Address = mongoose.model('Address', addressSchema)
module.exports = Address
