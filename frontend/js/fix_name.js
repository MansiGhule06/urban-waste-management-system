const mongoose = require("mongoose");
const Pickup = require("./models/pickup");
const Resident = require("./models/resident");

mongoose.connect("mongodb://127.0.0.1:27017/YOUR_DB_NAME")
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

async function fixNames() {
  const pickups = await Pickup.find();

  for (let p of pickups) {
    const resident = await Resident.findOne({ email: p.email });

    if (resident) {
      p.residentName = resident.fullname;
      await p.save();
      console.log("Updated:", p._id);
    }
  }

  console.log("✅ All pickups updated");
  process.exit();
}

fixNames();