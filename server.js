const express = require('express');
const mongoose = require('mongoose');

const app = express();

// MongoDB Connection
mongoose.connect("mongodb+srv://admin:root@cluster0.h6ci3tl.mongodb.net/UrbanwasteDB=Cluster0")
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

// Basic Route
app.get('/', (req, res) => {
    res.send("Backend + MongoDB Running 🚀");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});