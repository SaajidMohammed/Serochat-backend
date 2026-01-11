const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Import Config and Socket from src
const connectDB = require('./src/config/db');
const { initSocket } = require('./src/utils/socket');

// Route Imports from src
const authRoutes = require('./src/routes/authRoutes');
const postRoutes = require('./src/routes/postRoutes');
const chatRoutes = require('./src/routes/chatRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// --- HELPER: Auto-create uploads folder if missing ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log("📁 Created 'uploads' directory");
}

// Middleware
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Serve static folder for uploaded images
// This ensures that http://localhost:5000/uploads/image.jpg works
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chats', chatRoutes);

// Base Route
app.get('/', (req, res) => {
    res.send('🚀 SeroChat API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});