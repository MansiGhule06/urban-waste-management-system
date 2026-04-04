const express = require("express");
const router = express.Router();
const Pickup = require("../models/pickup"); // ✅ correct import
const Resident = require("../models/User");
// ✅ GET recycler data
router.get("/", async (req, res) => {
  try {
    const data = await Pickup.find({
      status: { $in: ["In Transit",  "Recycled", "Disposed"] }
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed ❌" });
  }
});
router.put("/update/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Pickup.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Pickup not found ❌" });
    }

    res.json({ message: "Updated ✅", data: updated });
 // 🔍 Get pickup first
    const pickup = await Pickup.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({ error: "Pickup not found ❌" });
    }

    // ✅ Update status
    pickup.status = status;
    await pickup.save();

    // 🎯 ADD POINTS ONLY WHEN RECYCLED
if (status === "Recycled" || status === "Disposed") {
  console.log("🔥 RECYCLED TRIGGERED");

  console.log("Pickup object:", pickup);

  console.log("Trying email field:", pickup.userEmail);
  console.log("Trying email field:", pickup.email);

  const emailToUse = pickup.userEmail || pickup.email;

  console.log("Final email used:", emailToUse);

  const user = await Resident.findOne({ email: emailToUse });

  console.log("User found:", user);
await Resident.findByIdAndUpdate(
    pickup.residentId,
    { $inc: { points: 10 } }
  );
  if (user) {
    user.points = (user.points || 0) + 10;
    await user.save();

    console.log("✅ Points updated:", user.points);
  } else {
    console.log("❌ USER NOT FOUND");
  }
}

    res.json({ message: "Updated ✅", data: pickup });

  } catch (err) {
    res.status(500).json({ error: "Update failed ❌" });
  }
});
router.get("/count", async (req, res) => {
  try {
    const { email } = req.query;

    const count = await Pickup.countDocuments({
      userEmail: email
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/stats", async (req, res) => {
  try {
    const incoming = await Pickup.countDocuments({ status: "In Transit" });

    const pending = await Pickup.countDocuments({ status: "collected" });

    const processing = await Pickup.countDocuments({
      status: { $in: ["Recycled", "Disposed"] }
    });

    res.json({
      incoming,
      pending,
      processing
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/material-stats", async (req, res) => {
  try {
    const data = await Pickup.aggregate([
      {
        $group: {
          _id: "$wasteType",   // 👈 field from your schema
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/weekly-stats", async (req, res) => {
  try {
    const data = await Pickup.aggregate([
      {
        $match: {
          status: { $in: ["Recycled", "Disposed"] }
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfWeek: "$createdAt" }, // 1=Sun, 7=Sat
            status: "$status"
          },
          total: { $sum: 1 }
        }
      }
    ]);

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;