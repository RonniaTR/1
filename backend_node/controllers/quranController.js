/**
 * ================================================
 * QURAN CONTROLLER
 * ================================================
 * 
 * Request handlers for Quran endpoints
 * Validates input via utils/validators.js
 * Passes errors to global errorHandler middleware
 */

const quranService = require('../services/quranService');
const { validateSearchQuery, validateNumericId, validateLanguage } = require('../utils/validators');

/**
 * Search verses across all Surahs
 * GET /api/quran/search?query=mercy&language=en
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const searchVerses = async (req, res, next) => {
  try {
    const { query, language = 'en' } = req.query;

    // Validate query parameter
    if (!query) {
      return next({
        status: 400,
        message: 'Search query is required',
        details: 'Example: /api/quran/search?query=mercy&language=en'
      });
    }

    // Sanitize and validate search query
    const sanitizedQuery = validateSearchQuery(query, 1, 500);

    // Validate language parameter
    const validatedLanguage = validateLanguage(language);

    console.log(`[Quran Controller] Searching verses: "${sanitizedQuery}" in ${validatedLanguage}`);

    // Call service with validated inputs
    const results = await quranService.searchVerses(sanitizedQuery, validatedLanguage);

    res.json({
      status: 'success',
      data: results
    });
  } catch (error) {
    // Pass error to global error handler middleware
    next({
      status: error.status || 500,
      message: error.message || 'Verse search failed',
      endpoint: '/api/quran/search'
    });
  }
};

/**
 * Get full Surah with all verses
 * GET /api/quran/surah/:id?language=en
 * 
 * @param {object} req - Express request object with params.id
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 * 
 * ID ranges from 1-114
 */
const getSurah = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { language = 'en' } = req.query;

    // Validate Surah ID
    if (!id) {
      return next({
        status: 400,
        message: 'Surah ID is required',
        details: 'Example: /api/quran/surah/1?language=en (ID ranges 1-114)'
      });
    }

    // Validate ID is numeric and in range 1-114
    const surahId = validateNumericId(id, 1, 114);

    // Validate language parameter
    const validatedLanguage = validateLanguage(language);

    console.log(`[Quran Controller] Fetching Surah ${surahId} in ${validatedLanguage}`);

    // Call service with validated inputs
    const surah = await quranService.getSurah(surahId, validatedLanguage);

    res.json({
      status: 'success',
      data: surah
    });
  } catch (error) {
    // Pass error to global error handler middleware
    next({
      status: error.status || 500,
      message: error.message || 'Failed to fetch Surah',
      endpoint: '/api/quran/surah/:id'
    });
  }
};

/**
 * Get single verse/Ayah
 * GET /api/quran/verse/:surah/:verse?language=en
 * 
 * @param {object} req - Express request object with params.surah, params.verse
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 * 
 * Surah ranges 1-114, Verse varies by Surah
 */
const getVerse = async (req, res, next) => {
  try {
    const { surah, verse } = req.params;
    const { language = 'en' } = req.query;

    // Validate parameters
    if (!surah || !verse) {
      return next({
        status: 400,
        message: 'Surah and verse numbers are required',
        details: 'Example: /api/quran/verse/2/255?language=en (Surah 2, Verse 255)'
      });
    }

    // Validate Surah ID (1-114)
    const surahId = validateNumericId(surah, 1, 114);

    // Validate Verse ID (basic range, specific range varies by Surah)
    const verseId = validateNumericId(verse, 1, 600);

    // Validate language parameter
    const validatedLanguage = validateLanguage(language);

    console.log(`[Quran Controller] Fetching Verse ${surahId}:${verseId} in ${validatedLanguage}`);

    // Call service with validated inputs
    const ayah = await quranService.getVerse(surahId, verseId, validatedLanguage);

    res.json({
      status: 'success',
      data: ayah
    });
  } catch (error) {
    // Pass error to global error handler middleware
    next({
      status: error.status || 500,
      message: error.message || 'Failed to fetch verse',
      endpoint: '/api/quran/verse/:surah/:verse'
    });
  }
};

/**
 * Get all Surahs metadata
 * GET /api/quran/surahs
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 * 
 * Returns metadata for all 114 Surahs
 */
const getAllSurahs = async (req, res, next) => {
  try {
    console.log('[Quran Controller] Fetching all Surahs metadata');

    // Call service (now async with real API calls and caching)
    const surahs = await quranService.getAllSurahs();

    res.json({
      status: 'success',
      count: surahs.length,
      data: surahs
    });
  } catch (error) {
    // Pass error to global error handler middleware
    next({
      status: error.status || 500,
      message: error.message || 'Failed to fetch Surahs metadata',
      endpoint: '/api/quran/surahs'
    });
  }
};

/**
 * Get supported editions/language translations
 * GET /api/quran/editions
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 * 
 * Returns available Quran translations: Arabic, English, Spanish, Turkish
 */
const getSupportedEditions = async (req, res, next) => {
  try {
    console.log('[Quran Controller] Fetching supported editions');

    // Call service (now async with real API calls and caching)
    const editions = await quranService.getSupportedEditions();

    res.json({
      status: 'success',
      count: editions.length,
      data: editions
    });
  } catch (error) {
    // Pass error to global error handler middleware
    next({
      status: error.status || 500,
      message: error.message || 'Failed to fetch editions',
      endpoint: '/api/quran/editions'
    });
  }
};

module.exports = {
  searchVerses,
  getSurah,
  getVerse,
  getAllSurahs,
  getSupportedEditions
};
