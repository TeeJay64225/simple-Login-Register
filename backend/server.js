const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User'); // Import User model

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Middleware (Allow frontend requests from Vercel)
app.use(cors({
    origin: "https://simple-login-register.vercel.app",
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

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ MongoDB Connected');

    // ✅ Make sure the app listens on PORT
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });

})
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});
