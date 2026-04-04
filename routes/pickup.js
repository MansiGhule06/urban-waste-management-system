const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); // <-- add this
const Pickup = require("../models/pickup");
const sendpickupemail = require("../mailer");

// ✅ CREATE PICKUP (from resident form)
router.post("/create", async (req, res) => {
    try {
        const pickup = new Pickup(req.body);

        await pickup.save();

        res.json({ message: "Pickup Scheduled ✅" });
    } catch (err) {
        res.status(500).json({ error: "Error creating pickup ❌" });
    }
    router.post("/create", async (req, res) => {
  try {
    const { email, ...rest } = req.body;

    // 🔍 Find resident by email
    const resident = await Resident.findOne({ email });

    if (!resident) {
      return res.status(404).json({ error: "Resident not found ❌" });
    }

    // ✅ Add resident name from DB
    const pickup = new Pickup({
      ...rest,
      email,
      residentName: resident.fullname,
      residentId: resident._id 
    });

    await pickup.save();

    res.json({ message: "Pickup Scheduled ✅" });
    sendpickupemail(email, pickup._id).catch(err => console.error("Email error:", err));

  } catch (err) {
    res.status(500).json({ error: "Error creating pickup ❌" });
  }
});
});


// ✅ GET ALL PICKUPS (for staff dashboard)
router.get("/all", async (req, res) => {
  try {
    const pickups = await Pickup.find().sort({ createdAt: -1 });
    res.json(pickups);
  } catch (err) {
    res.status(500).json({ error: "Error fetching pickups ❌" });
  }
});

// GET pickups for a specific resident
router.get("/", async (req, res) => {
  try {
    const email = req.query.email; // from frontend
    if (!email) return res.status(400).json({ error: "Email required" });

    // Match field name exactly with schema
    const pickups = await Pickup.find({ userEmail: email }).sort({ createdAt: -1 });
    res.json(pickups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching pickups" });
  }
});
      
// ✅ UPDATE STATUS (FINAL FIXED)
router.put("/update/:id", async (req, res) => {
    try {
        const { status, weight } = req.body;

        // ✅ allowed statuses
        const validStatus = ["pending", "confirmed", "collected", "In Transit"];

        if (!validStatus.includes(status)) {
            return res.status(400).json({ error: "Invalid status ❌" });
        }

        const updateData = { status };

        // ✅ ONLY when final states → save weight
        if (status === "Recycled" || status === "Disposed") {
            if (weight) {
                updateData.weight = weight;
            }
        }

        const updated = await Pickup.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: "Pickup not found ❌" });
        }

        res.json({ message: "Status Updated ✅", data: updated });

    } catch (err) {
        res.status(500).json({ error: "Update failed ❌" });
    }
});

// GET one pickup by ID
// GET by tracking ID (ObjectId)
router.get("/track/:id", async (req, res) => {
  const id = req.params.id;

  // Convert string to ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid tracking ID" });
  }

  try {
    const pickup = await Pickup.findById(id); // <-- converts automatically if ObjectId
    if (!pickup) return res.status(404).json({ message: "Tracking ID not found" });

    res.json(pickup); // send full object
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// ✅ COUNT pickups
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
module.exports = router;


//recycler dashboard - update status + weight
// ✅ GET IN-TRANSIT PICKUPS
// ✅ GET pickups by status
