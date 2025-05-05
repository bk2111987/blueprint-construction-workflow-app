const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { authorize } = require('../middleware/auth');
const bidController = require('../controllers/bidController');

// All routes require authentication
router.use(auth);

// GET /api/bids - Get all bids (filtered by role)
router.get('/', bidController.getBids);

// POST /api/bids - Submit a new bid (subcontractors only)
router.post(
  '/',
  authorize('subcontractor'),
  bidController.createBid
);

// GET /api/bids/:id - Get bid by ID
router.get('/:id', bidController.getBidById);

// PUT /api/bids/:id - Update bid (subcontractor only, pending bids only)
router.put(
  '/:id',
  authorize('subcontractor'),
  bidController.updateBid
);

// POST /api/bids/:id/accept - Accept bid (contractor only)
router.post(
  '/:id/accept',
  authorize('contractor'),
  bidController.acceptBid
);

// POST /api/bids/:id/reject - Reject bid (contractor only)
router.post(
  '/:id/reject',
  authorize('contractor'),
  bidController.rejectBid
);

module.exports = router;
