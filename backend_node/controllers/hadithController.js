/**
 * ================================================
 * HADITH CONTROLLER
 * ================================================
 * 
 * Request handlers for Hadith endpoints
 * Validates input via utils/validators.js
 * Passes errors to global errorHandler middleware
 */

const hadithService = require('../services/hadithService');
const { validateSearchQuery, validateRequestBody } = require('../utils/validators');

/**
 * Search Hadith
 * GET /api/hadith/search?query=prayer&collection=bukhari
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const searchHadith = async (req, res, next) => {
  try {
    const { query, collection } = req.query;

    // Validate query parameter
    if (!query) {
      return next({
        status: 400,
        message: 'Search query is required',
        details: 'Example: /api/hadith/search?query=prayer'
      });
    }

    // Sanitize and validate search query
    const sanitizedQuery = validateSearchQuery(query, 3, 500);

    console.log(`[Hadith Controller] Searching for: "${sanitizedQuery}"${collection ? ` in ${collection}` : ''}`);

    // Call service with validated inputs
    const results = await hadithService.searchHadith(sanitizedQuery, collection);

    res.json({
      status: 'success',
      data: results
    });
  } catch (error) {
    // Pass error to global error handler middleware
    next({
      status: error.status || 500,
      message: error.message || 'Hadith search failed',
      endpoint: '/api/hadith/search'
    });
  }
};

/**
 * Get Hadith by ID
 * GET /api/hadith/:id
 * 
 * @param {object} req - Express request object with params.id
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 * 
 * Example: /api/hadith/bukhari_1_1
 */
const getHadithById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID parameter
    if (!id || id.trim().length === 0) {
      return next({
        status: 400,
        message: 'Hadith ID is required',
        details: 'Example: /api/hadith/bukhari_1_1'
      });
    }

    // Validate ID format (basic check - should be alphanumeric with underscore)
    if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
      return next({
        status: 400,
        message: 'Invalid Hadith ID format',
        details: 'ID should contain only letters, numbers, underscores, or hyphens'
      });
    }

    console.log(`[Hadith Controller] Fetching hadith: ${id}`);

    // Call service with validated ID
    const hadith = await hadithService.getHadithById(id);

    res.json({
      status: 'success',
      data: hadith
    });
  } catch (error) {
    // Pass error to global error handler middleware
    next({
      status: error.status || 500,
      message: error.message || 'Failed to fetch hadith',
      endpoint: '/api/hadith/:id'
    });
  }
};

/**
 * Get available Hadith collections
 * GET /api/hadith/collections
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const getCollections = async (req, res, next) => {
  try {
    console.log('[Hadith Controller] Fetching available collections');

    // Call service (now async with real API calls)
    const collections = await hadithService.getAvailableCollections();

    res.json({
      status: 'success',
      count: collections.length,
      data: collections
    });
  } catch (error) {
    // Pass error to global error handler middleware
    next({
      status: error.status || 500,
      message: error.message || 'Failed to fetch hadith collections',
      endpoint: '/api/hadith/collections'
    });
  }
};

/**
 * Search Hadith by theme
 * GET /api/hadith/theme/:theme
 * 
 * @param {object} req - Express request object with params.theme
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 * 
 * Example: /api/hadith/theme/prayer
 */
const searchByTheme = async (req, res, next) => {
  try {
    const { theme } = req.params;

    // Validate theme parameter
    if (!theme) {
      return next({
        status: 400,
        message: 'Theme is required',
        details: 'Example: /api/hadith/theme/prayer'
      });
    }

    // Sanitize and validate theme query
    const sanitizedTheme = validateSearchQuery(theme, 3, 200);

    console.log(`[Hadith Controller] Searching by theme: "${sanitizedTheme}"`);

    // Call service with validated theme
    const results = await hadithService.searchByTheme(sanitizedTheme);

    res.json({
      status: 'success',
      data: results
    });
  } catch (error) {
    // Pass error to global error handler middleware
    next({
      status: error.status || 500,
      message: error.message || 'Theme search failed',
      endpoint: '/api/hadith/theme/:theme'
    });
  }
};

module.exports = {
  searchHadith,
  getHadithById,
  getCollections,
  searchByTheme
};
