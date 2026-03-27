const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const residentRoutes = require('./routes/resident');  // import the route
const staffRoutes = require('./routes/staff');
const recyclerRoutes = require('./routes/recycler');

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

// Test route
app.get('/', (req, res) => res.send('Backend Running 🚀'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));