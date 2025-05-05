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

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
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

app.use(i18nextMiddleware.handle(i18next));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

// Test DB connection
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Basic route
app.get('/', (req, res) => {
  res.send('Blueprint App Backend API');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
