/**
 * ================================================
 * AI ROUTES
 * ================================================
 * 
 * REST API endpoints for AI Scholar system
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Ask scholar a question
// POST /api/ai/ask
router.post('/ask', aiController.askScholar);

// Get available scholars
// GET /api/ai/scholars
router.get('/scholars', aiController.getAvailableScholars);

// Process batch questions
// POST /api/ai/batch
router.post('/batch', aiController.processBatch);

module.exports = router;
