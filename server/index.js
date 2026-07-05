const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Mongoose import kiya
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Database connected successfully!'))
    .catch((err) => console.log('Database connection error: ', err));


    app.use(express.json());
// Basic Route for Testing
app.get('/', (req, res) => {
    res.send('Task Management System Backend is running successfully!');
});
// Task Routes Link kar rahe hain
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});