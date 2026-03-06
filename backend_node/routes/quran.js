/**
 * ================================================
 * QURAN ROUTES
 * ================================================
 * 
 * REST API endpoints for Quran operations
 */

const express = require('express');
const router = express.Router();
const quranController = require('../controllers/quranController');

// Search verses
// GET /api/quran/search?query=word
router.get('/search', quranController.searchVerses);

// Get all Surahs metadata
// GET /api/quran/surahs
router.get('/surahs', quranController.getAllSurahs);

// Get supported editions
// GET /api/quran/editions
router.get('/editions', quranController.getSupportedEditions);

// Get single verse
// GET /api/quran/verse/:surah/:verse
router.get('/verse/:surah/:verse', quranController.getVerse);

// Get full Surah
// GET /api/quran/surah/:id
router.get('/surah/:id', quranController.getSurah);

module.exports = router;
