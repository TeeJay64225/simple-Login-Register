const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User'); // Import User model

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Middleware (Allow frontend requests from Vercel)
app.use(cors({
    origin: "https://simple-login-register.vercel.app", // Your frontend URL
    methods: "GET,POST",
    credentials: true
}));

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

// User Login Route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({ message: 'Login successful', user });
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("❌ MongoDB connection string is missing in .env");
    process.exit(1);
}

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
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
