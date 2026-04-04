const express = require("express");
const router = express.Router();
const Report = require("../models/reports");

// ✅ POST: Create report
router.post("/", async (req, res) => {
  try {
    const { issuetype, address, description, email } = req.body;

    const newReport = new Report({
      issuetype,
      address,
      description,
      email
    });

    await newReport.save();

    res.json({ message: "Saved ✅" });

  } catch (error) {
    console.log("❌ ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});


// ✅ GET: All reports OR by email
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;

    let reports;

    if (email) {
      reports = await Report.find({ email }).sort({ date: -1 });
    } else {
      reports = await Report.find().sort({ date: -1 });
    }

    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ PUT: Update status
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ✅ COUNT reports
router.get("/count", async (req, res) => {
  try {
    const { email } = req.query;

    const count = await Report.countDocuments({
      email,
      status: { $ne: "Resolved" }
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;