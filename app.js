const express = require('express');
require('dotenv').config();
require('./config/database');

const userRoutes = require('./routes/user');
const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
