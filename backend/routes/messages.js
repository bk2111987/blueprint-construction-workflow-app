const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const messageController = require('../controllers/messageController');
const multer = require('multer');

// Configure multer for message attachments
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/messages/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'message-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// All routes require authentication
router.use(auth);

// GET /api/messages - Get messages (filtered by conversation or project)
router.get('/', messageController.getMessages);

// POST /api/messages - Send a new message
router.post(
  '/',
  upload.single('attachment'),
  async (req, res, next) => {
    try {
      if (req.file) {
        req.body.type = 'file';
        req.body.attachmentUrl = `/uploads/messages/${req.file.filename}`;
      }
      next();
    } catch (error) {
      next(error);
    }
  },
  messageController.sendMessage
);

// GET /api/messages/unread - Get unread message count
router.get('/unread', messageController.getUnreadCount);

// POST /api/messages/read - Mark messages as read
router.post('/read', messageController.markAsRead);

// GET /api/messages/conversations - Get list of conversations
router.get('/conversations', messageController.getConversations);

// WebSocket event handlers (to be implemented in socket.io setup)
/*
socket.on('join_room', (data) => {
  socket.join(`user_${data.userId}`);
  if (data.projectId) {
    socket.join(`project_${data.projectId}`);
  }
});

socket.on('leave_room', (data) => {
  socket.leave(`user_${data.userId}`);
  if (data.projectId) {
    socket.leave(`project_${data.projectId}`);
  }
});

socket.on('typing', (data) => {
  socket.to(`user_${data.receiverId}`).emit('user_typing', {
    senderId: data.senderId,
    typing: data.typing
  });
});
*/

module.exports = router;
