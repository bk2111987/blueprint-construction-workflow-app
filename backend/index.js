require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-express-middleware');
const Backend = require('i18next-fs-backend');
const path = require('path');
const { sequelize } = require('./models');

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const bidRoutes = require('./routes/bids');
const materialRoutes = require('./routes/materials');
const taskRoutes = require('./routes/tasks');
const messageRoutes = require('./routes/messages');

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

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join_room', (data) => {
    if (data.userId) socket.join(`user_${data.userId}`);
    if (data.projectId) socket.join(`project_${data.projectId}`);
  });

  socket.on('leave_room', (data) => {
    if (data.userId) socket.leave(`user_${data.userId}`);
    if (data.projectId) socket.leave(`project_${data.projectId}`);
  });

  socket.on('typing', (data) => {
    socket.to(`user_${data.receiverId}`).emit('user_typing', {
      senderId: data.senderId,
      typing: data.typing
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/disputes', require('./routes/disputes'));

// ERP Integration webhook endpoint example
app.post('/api/erp/stock-update', async (req, res) => {
  try {
    const { sku, stockLevel } = req.body;
    const material = await require('./models').Material.findOne({ where: { sku } });
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    await material.update({ stockLevel, isAvailable: stockLevel > 0 });
    // Optionally emit socket event for low stock alert
    if (stockLevel <= material.minStockLevel) {
      io.to(`vendor_${material.vendorId}`).emit('low_stock_alert', material);
    }
    res.json({ message: 'Stock updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Scheduled job or endpoint for alerts on expiring licenses/permits (simplified example)
const checkExpiringLicenses = async () => {
  const projects = await require('./models').Project.findAll({
    where: {
      permitExpiryDate: {
        [require('sequelize').Op.lte]: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // next 30 days
      }
    }
  });
  projects.forEach(project => {
    io.to(`contractor_${project.contractorId}`).emit('license_expiry_alert', {
      projectId: project.id,
      permitExpiryDate: project.permitExpiryDate
    });
  });
};

// Run checkExpiringLicenses daily (example using setInterval)
setInterval(checkExpiringLicenses, 24 * 60 * 60 * 1000); // every 24 hours

// Basic route
app.get('/', (req, res) => {
  res.send('Blueprint App Backend API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: 'Unique constraint error',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  if (err.name === 'MulterError') {
    return res.status(400).json({
      error: 'File upload error',
      message: err.message
    });
  }

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Database connection and server start
const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    // Sync database in development
    if (process.env.NODE_ENV === 'development') {
      return sequelize.sync({ alter: true });
    }
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = { app, server };
