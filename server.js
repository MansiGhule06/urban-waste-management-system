const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const residentRoutes = require('./routes/resident');  // import the route
const staffRoutes = require('./routes/staff');
const recyclerRoutes = require('./routes/recycler');
const pickupRoutes = require("./routes/pickup");
const reportRoutes = require("./routes/reportRoutes");
const recycletable = require("./routes/recycle");
const notify = require("./routes/notify");
const rewardRoutes = require("./routes/rewardRoutes");
const app = express();

app.use(cors());           // allow cross-origin requests
app.use(express.json());   // parse JSON bodies
app.get('/test', (req, res) => {
    res.send('Backend working ✅');
});
// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected ✅'))
    .catch(err => console.log(err));

// Use resident routes
app.use('/api/resident', residentRoutes);  // <-- all routes inside resident.js start with /api/resident
app.use('/api/staff', staffRoutes);
app.use('/api/recycler', recyclerRoutes);
app.use("/api/pickup", pickupRoutes);
app.use("/api/recycle", recycletable);
app.use("/api/notify", notify);
app.use("/api/reports", reportRoutes);
app.use("/api/rewards", rewardRoutes);

app.get("/api/pickup", async (req, res) => {
  try {
    const data = await Pickup.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
// Test route
app.get('/', (req, res) => res.send('Backend Running 🚀'));
// GET pickups for a specific user
app.get("/api/reports", async (req, res) => {
  try {
    const { email } = req.query;

    const reports = await Report.find({ email }).sort({ date: -1 });

    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(3000, () => console.log("Server running"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));