const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    email: {
    type: String,
    required: true
  },
  issuetype: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: "Pending"
  }
});

module.exports = mongoose.model("Report", reportSchema);