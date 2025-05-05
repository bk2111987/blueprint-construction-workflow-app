require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const http = require('http');
const socketIo = require('socket.io');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-express-middleware');
const Backend = require('i18next-fs-backend');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Initialize i18next for bilingual support
i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'fr'],
    backend: {
      loadPath: path.join(__dirname, '/locales/{{lng}}/translation.json')
    }
  });

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(i18nextMiddleware.handle(i18next));

// Import database models
const models = require('./models');

// Database connection
models.sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    // Sync database (in development)
    if (process.env.NODE_ENV === 'development') {
      return models.sequelize.sync({ alter: true });
    }
  })
  .catch(err => console.error('Unable to connect to the database:', err));

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join_room', (projectId) => {
    socket.join(`project_${projectId}`);
  });

  socket.on('leave_room', (projectId) => {
    socket.leave(`project_${projectId}`);
  });

  socket.on('new_message', async (message) => {
    try {
      const savedMessage = await models.Message.create(message);
      io.to(`project_${message.projectId}`).emit('message_received', savedMessage);
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', require('./routes/projects'));

// Basic route
app.get('/', (req, res) => {
  res.send('Blueprint App Backend API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for testing
module.exports = { app, server };
