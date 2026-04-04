const express = require("express");
const router = express.Router();
const Resident = require("../models/User"); // ✅ correct import

// ✅ GET POINTS
router.get("/points", async (req, res) => {
  try {
    const { email } = req.query;

    const user = await Resident.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    res.json({ points: user.points });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ REDEEM
router.post("/redeem", async (req, res) => {
  try {
    const { email, pointsRequired, rewardName } = req.body;

    const user = await Resident.findOne({ email });

    if (user.points < pointsRequired) {
      return res.json({ message: "Not enough points ❌" });
    }

    user.points -= pointsRequired;
    await user.save();

    res.json({ message: `${rewardName} redeemed ✅` });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;