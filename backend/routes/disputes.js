const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const disputeController = require('../controllers/disputeController');

// All routes require authentication
router.use(auth);

// GET /api/disputes - Get all disputes for user
router.get('/', disputeController.getDisputes);

// POST /api/disputes - Create a new dispute
router.post('/', disputeController.createDispute);

// GET /api/disputes/:id - Get dispute by ID
router.get('/:id', disputeController.getDisputeById);

// PUT /api/disputes/:id - Update dispute
router.put('/:id', disputeController.updateDispute);

// POST /api/disputes/:id/resolve - Resolve dispute
router.post('/:id/resolve', disputeController.resolveDispute);

module.exports = router;
