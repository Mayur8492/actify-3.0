require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // For development
    methods: ['GET', 'POST']
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room`);
  });

  // Real-time page collaboration
  socket.on('update_page', (pageData) => {
    // Broadcast to the user's room so other active sessions update
    if (pageData && pageData.createdBy) {
       socket.to(pageData.createdBy).emit('page_updated', pageData);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible in routes/controllers
app.set('io', io);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/workspaces', require('./src/routes/workspaceRoutes'));
app.use('/api/pages', require('./src/routes/pageRoutes'));
app.use('/api/tasks', require('./src/routes/taskRoutes'));
app.use('/api/activities', require('./src/routes/activityRoutes'));
app.use('/api/focus', require('./src/routes/focusSessionRoutes'));
app.use('/api/analytics', require('./src/routes/analyticsRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/habits', require('./src/routes/habitRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Actify API' });
});

// Database Connection with Fallback
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/actify')
  .then(() => console.log('MongoDB connected'))
  .catch(async (err) => {
    console.error('Local MongoDB connection failed. Falling back to mongodb-memory-server...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log(`Connected to In-Memory MongoDB at ${uri}`);
    } catch (memErr) {
      console.error('Failed to start mongodb-memory-server:', memErr);
    }
  });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
