const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile_number: { type: String, required: true },
  pass: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Staff', staffSchema);