/**
 * ================================================
 * HADITH ROUTES
 * ================================================
 * 
 * REST API endpoints for Hadith operations
 */

const express = require('express');
const router = express.Router();
const hadithController = require('../controllers/hadithController');

// Search Hadith
// GET /api/hadith/search?query=prayer
router.get('/search', hadithController.searchHadith);

// Get available collections
// GET /api/hadith/collections
router.get('/collections', hadithController.getCollections);

// Search by theme
// GET /api/hadith/theme/:theme
router.get('/theme/:theme', hadithController.searchByTheme);

// Get Hadith by ID
// GET /api/hadith/:id
router.get('/:id', hadithController.getHadithById);

module.exports = router;
