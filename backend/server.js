const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User'); // Import User model

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

console.log('✅ Server script started');

// Test Route
app.get('/', (req, res) => {
    res.send('Server is running...');
    console.log('✅ GET request received at /');
});

// User Registration Route
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create and save new user
        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => {
        console.log('✅ MongoDB Connected');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });
