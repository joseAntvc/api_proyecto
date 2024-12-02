const mongoose = require('mongoose');
const Billing = require('./Billing');
const Address = require('./Address');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  last_name: String,
  username: { type: String, unique: true },
  phone: String,
  email: { type: String, unique: true },
  password: String,
  addresses: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
  billings: [{ type: Schema.Types.ObjectId, ref: 'Billing' }]
}, { collection: 'users' });

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});
const User = mongoose.model("User", userSchema);
module.exports = { User };