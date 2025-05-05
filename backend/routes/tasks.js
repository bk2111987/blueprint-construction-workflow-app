const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { authorize } = require('../middleware/auth');
const taskController = require('../controllers/taskController');
const multer = require('multer');

// Configure multer for task attachments
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/tasks/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'task-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
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

// GET /api/tasks - Get all tasks (filtered by role and project)
router.get('/', taskController.getTasks);

// POST /api/tasks - Create a new task (contractor only)
router.post(
  '/',
  authorize('contractor'),
  taskController.createTask
);

// GET /api/tasks/:id - Get task by ID
router.get('/:id', taskController.getTaskById);

// PUT /api/tasks/:id - Update task (contractor or assigned user)
router.put(
  '/:id',
  taskController.updateTask
);

// DELETE /api/tasks/:id - Delete task (contractor only)
router.delete(
  '/:id',
  authorize('contractor'),
  taskController.deleteTask
);

// PATCH /api/tasks/:id/progress - Update task progress (assigned user only)
router.patch(
  '/:id/progress',
  taskController.updateTaskProgress
);

// POST /api/tasks/:id/attachments - Add attachments to task
router.post(
  '/:id/attachments',
  upload.array('attachments', 5), // Allow up to 5 files
  async (req, res, next) => {
    try {
      // Add file URLs to request body
      req.body.attachments = req.files.map(file => `/uploads/tasks/${file.filename}`);
      next();
    } catch (error) {
      next(error);
    }
  },
  taskController.updateTask
);

module.exports = router;
