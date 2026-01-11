const socketio = require('socket.io');

let io;

const initSocket = (server) => {
    io = socketio(server, {
        cors: {
            origin: "*", // In production, replace with your frontend URL
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`📡 New client connected: ${socket.id}`);

        // Join a private room based on User ID
        socket.on('join', (userId) => {
            socket.join(userId);
            console.log(`👤 User ${userId} joined their private room`);
        });

        // Handle typing events (Optional UI flair)
        socket.on('typing', (data) => {
            socket.to(data.receiverId).emit('displayTyping', data.senderId);
        });

        socket.on('disconnect', () => {
            console.log('🔌 Client disconnected');
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = { initSocket, getIO };