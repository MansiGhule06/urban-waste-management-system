const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, maxlength: 254, unique: true },
  mobile_number: { type: String, required: true, maxlength: 15 },
  pass: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  points: {
  type: Number,
  default: 0
}
});
module.exports = mongoose.model('resident', userSchema);
