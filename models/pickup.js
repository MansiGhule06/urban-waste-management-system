const mongoose = require("mongoose");

const pickupSchema = new mongoose.Schema({
    residentName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    wasteType: {
        type: String,
        required: true
    },
    date: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    status: {
        type: String,
        default: "scheduled"
    },
    weight: {
        type: Number,
        default: 0
    },
    points: {
  type: Number,
  default: 0
},
residentId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Resident"
}
}, { timestamps: true });

module.exports = mongoose.model("Pickup", pickupSchema);