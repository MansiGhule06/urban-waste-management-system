const mongoose = require("mongoose");
const Pickup = require("./models/pickup");
const Resident = require("./models/user");

mongoose.connect("mongodb://admin:root@ac-6xtbli0-shard-00-00.h6ci3tl.mongodb.net:27017,ac-6xtbli0-shard-00-01.h6ci3tl.mongodb.net:27017,ac-6xtbli0-shard-00-02.h6ci3tl.mongodb.net:27017/UrbanwasteDB?ssl=true&replicaSet=atlas-vbrwjg-shard-0&authSource=admin&appName=Cluster0")
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
