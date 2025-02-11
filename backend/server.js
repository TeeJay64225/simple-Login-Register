const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Hash passwords
const jwt = require('jsonwebtoken'); // Generate JWT tokens
require('dotenv').config();

const User = require('./models/User'); // Import User model

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Middleware (Allow frontend requests from Vercel)
app.use(cors({
    origin: "*",  // Allow all origins for debugging
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

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found:", email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Password mismatch for user:", email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        if (!process.env.JWT_SECRET) {
            console.error("❌ JWT_SECRET is missing in .env");
            return res.status(500).json({ message: "Internal Server Error: JWT misconfiguration" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log(`✅ Login successful for user: ${email}`);
        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('❌ Login Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
