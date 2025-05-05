const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { authorize } = require('../middleware/auth');
const materialController = require('../controllers/materialController');
const multer = require('multer');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/materials/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'material-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// All routes require authentication
router.use(auth);

// GET /api/materials - Get all materials (filtered by vendor if applicable)
router.get('/', materialController.getMaterials);

// POST /api/materials - Create a new material (vendors only)
router.post(
  '/',
  authorize('vendor'),
  materialController.createMaterial
);

// GET /api/materials/:id - Get material by ID
router.get('/:id', materialController.getMaterialById);

// PUT /api/materials/:id - Update material (vendor only)
router.put(
  '/:id',
  authorize('vendor'),
  materialController.updateMaterial
);

// PATCH /api/materials/:id/stock - Update stock level (vendor only)
router.patch(
  '/:id/stock',
  authorize('vendor'),
  materialController.updateStock
);

// DELETE /api/materials/:id - Delete material (vendor only)
router.delete(
  '/:id',
  authorize('vendor'),
  materialController.deleteMaterial
);

// POST /api/materials/bulk-update-stock - Bulk update stock levels (vendor only)
router.post(
  '/bulk-update-stock',
  authorize('vendor'),
  materialController.bulkUpdateStock
);

module.exports = router;
