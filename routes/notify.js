const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); // <-- add this
const Pickup = require("../models/pickup");
router.get("/", async (req, res) => {
  try {
    const email = req.query.email;

    // ✅ If email is provided → return that user's pickups
    if (email) {
      const pickups = await Pickup.find({ userEmail: email }).sort({ createdAt: -1 });
      return res.json(pickups);
    }

    // ✅ If no email → return ALL (for admin/staff if needed)
    const pickups = await Pickup.find().sort({ createdAt: -1 });
    res.json(pickups);

  } catch (err) {
    res.status(500).json({ error: "Fetch failed ❌" });
  }
});
module.exports = router;