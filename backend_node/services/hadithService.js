/**
 * ================================================
 * HADITH SERVICE
 * ================================================
 * 
 * Service layer for Hadith operations
 * Integrates with free Hadith APIs for real data
 * 
 * API Endpoints:
 * - https://hadithapi.com/api/hadiths (search Hadith)
 * - https://hadithapi.com/api/hadiths/{id} (get by ID)
 * - https://hadithapi.com/api/collections (list collections)
 * 
 * Supported Collections:
 * - Sahih Bukhari (bukhari)
 * - Sahih Muslim (muslim)
 * - Sunan Abu Dawood (abudawood)
 * - Sunan An-Nasa'i (nasai)
 * - Sunan Ibn Majah (ibnmajah)
 * - Jami' at-Tirmidhi (tirmidhi)
 */

const axios = require('axios');
const { validateSearchQuery } = require('../utils/validators');

// Configuration
const HADITH_API_URL = process.env.HADITH_API_URL || 'https://hadithapi.com/api';
const API_TIMEOUT = 10000; // 10 seconds

// In-memory cache for collections
const cache = {
  collections: null,
  collectionsTimestamp: null,
  cacheDuration: 24 * 60 * 60 * 1000 // 24 hours
};

/**
 * Search Hadith by keyword
 * Searches across all Hadith collections
 * 
 * @param {string} query - Search query
 * @param {string} collection - Optional collection filter (bukhari, muslim, etc)
 * @returns {object} Search results with metadata
 * @throws {object} Error object with status code
 */
const searchHadith = async (query, collection = null) => {
  try {
    // Validate and sanitize query
    const sanitizedQuery = validateSearchQuery(query, 3, 500);

    console.log(`[Hadith Service] Searching for: "${sanitizedQuery}"${collection ? ` in ${collection}` : ''}`);

    // Build API URL with query parameters
    let url = `${HADITH_API_URL}/hadiths?search=${encodeURIComponent(sanitizedQuery)}`;
    if (collection) {
      url += `&collection=${encodeURIComponent(collection)}`;
    }

    // Limit results to avoid overwhelming response
    url += '&limit=20';

    const response = await axios.get(url, { timeout: API_TIMEOUT });

    if (!response.data) {
      throw {
        status: 500,
        message: 'Invalid response from Hadith API'
      };
    }

    return {
      query: sanitizedQuery,
      collection: collection || 'all',
      results: response.data.hadiths || [],
      total: response.data.total || 0,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    if (error.status) {
      throw error;
    }

    if (error.response?.status === 404) {
      return {
        query,
        collection: collection || 'all',
        results: [],
        total: 0,
        message: 'No hadiths found matching your query',
        timestamp: new Date().toISOString()
      };
    }

    throw {
      status: 500,
      message: `Hadith search failed: ${error.message}`
    };
  }
};

/**
 * Get specific Hadith by ID
 * Fetches detailed information about a single hadith
 * 
 * @param {string|number} hadithId - Hadith identifier
 * @returns {object} Hadith details with all metadata
 * @throws {object} Error object with status code
 */
const getHadithById = async (hadithId) => {
  try {
    if (!hadithId) {
      throw {
        status: 400,
        message: 'Hadith ID is required'
      };
    }

    // Ensure ID is a string and trimmed
    const id = String(hadithId).trim();

    console.log(`[Hadith Service] Fetching hadith: ${id}`);

    const response = await axios.get(
      `${HADITH_API_URL}/hadiths/${id}`,
      { timeout: API_TIMEOUT }
    );

    if (!response.data || !response.data.hadith) {
      throw {
        status: 404,
        message: 'Hadith not found'
      };
    }

    const hadith = response.data.hadith;

    // Transform API response for consistency
    return {
      id: hadith.hadithNumber || id,
      collection: hadith.collection || 'Unknown',
      bookNumber: hadith.bookNumber,
      hadithNumber: hadith.hadithNumber,
      narrator: hadith.narrator || 'Unknown',
      arabicText: hadith.arabicText || '',
      englishText: hadith.englishText || hadith.text || '',
      grading: hadith.grade || 'Ungraded',
      chains: hadith.chains || [],
      themes: hadith.themes || [],
      explanation: hadith.explanation || '',
      relatedVerses: hadith.relatedVerses || [],
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    if (error.status) {
      throw error;
    }

    if (error.response?.status === 404) {
      throw {
        status: 404,
        message: `Hadith with ID ${hadithId} not found`
      };
    }

    throw {
      status: 500,
      message: `Failed to fetch hadith: ${error.message}`
    };
  }
};

/**
 * Get available Hadith collections
 * Fetches metadata about all supported collections
 * Uses caching to reduce API calls
 * 
 * @returns {array} Array of collection objects with metadata
 * @throws {object} Error object with status code
 */
const getAvailableCollections = async () => {
  try {
    // Check cache first
    const now = Date.now();
    if (cache.collections && cache.collectionsTimestamp && (now - cache.collectionsTimestamp) < cache.cacheDuration) {
      console.log('[Hadith Service] Returning cached collections');
      return cache.collections;
    }

    console.log('[Hadith Service] Fetching available collections');

    const response = await axios.get(
      `${HADITH_API_URL}/collections`,
      { timeout: API_TIMEOUT }
    );

    if (!response.data || !response.data.collections) {
      throw {
        status: 500,
        message: 'Invalid response from collections API'
      };
    }

    // Transform collections for consistent format
    const collections = response.data.collections.map(col => ({
      id: col.id || col.slug,
      name: col.name,
      author: col.author || 'Unknown',
      hadiths: col.hadithsCount || col.numberOfHadiths || 0,
      grading: col.grade || col.grading || 'Ungraded',
      year: col.year || col.period || 'Unknown',
      shortIntro: col.shortIntro || col.description || '',
      language: col.language || 'en'
    }));

    // Cache the collections
    cache.collections = collections;
    cache.collectionsTimestamp = now;

    return collections;
  } catch (error) {
    if (error.status) {
      throw error;
    }

    // Fallback to static collections if API fails
    console.warn('[Hadith Service] Collections API failed, returning fallback data');
    return [
      {
        id: 'bukhari',
        name: 'Sahih Al-Bukhari',
        author: 'Muhammad ibn Ismail Al-Bukhari',
        hadiths: 7563,
        grading: 'Most Authentic (Sahih)',
        year: '810-870 CE'
      },
      {
        id: 'muslim',
        name: 'Sahih Muslim',
        author: 'Muslim ibn Al-Hajjaj',
        hadiths: 3033,
        grading: 'Authentic (Sahih)',
        year: '815-875 CE'
      },
      {
        id: 'abudawood',
        name: 'Sunan Abu Dawood',
        author: 'Abu Dawood Al-Sijistani',
        hadiths: 4800,
        grading: 'Generally Authentic',
        year: '817-889 CE'
      },
      {
        id: 'nasai',
        name: 'Sunan An-Nasa\'i',
        author: 'Ahmad ibn Shuaib An-Nasa\'i',
        hadiths: 5761,
        grading: 'Generally Authentic',
        year: '829-915 CE'
      },
      {
        id: 'ibnmajah',
        name: 'Sunan Ibn Majah',
        author: 'Muhammad ibn Yazid Ibn Majah',
        hadiths: 4341,
        grading: 'Mixed - Contains weak hadiths',
        year: '824-887 CE'
      },
      {
        id: 'tirmidhi',
        name: 'Jami\' at-Tirmidhi',
        author: 'Muhammad ibn Isa At-Tirmidhi',
        hadiths: 3956,
        grading: 'Generally Authentic',
        year: '824-892 CE'
      }
    ];
  }
};

/**
 * Search Hadith by theme/keyword with theme filtering
 * Provides thematic search across Hadith collections
 * 
 * @param {string} theme - Theme to search (e.g., "prayer", "fasting", "intention")
 * @returns {object} Search results organized by theme
 * @throws {object} Error object with status code
 */
const searchByTheme = async (theme) => {
  try {
    // Validate and sanitize theme query
    const sanitizedTheme = validateSearchQuery(theme, 3, 200);

    console.log(`[Hadith Service] Searching by theme: "${sanitizedTheme}"`);

    // Use the searchHadith function with theme as query
    const results = await searchHadith(sanitizedTheme);

    return {
      theme: sanitizedTheme,
      results: results.results || [],
      total: results.total || 0,
      message: results.results && results.results.length > 0 
        ? `Found ${results.results.length} hadith(s) related to "${sanitizedTheme}"`
        : `No hadiths found for theme "${sanitizedTheme}"`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    if (error.status) {
      throw error;
    }

    throw {
      status: 500,
      message: `Theme search failed: ${error.message}`
    };
  }
};

module.exports = {
  searchHadith,
  getHadithById,
  getAvailableCollections,
  searchByTheme,
  HADITH_API_URL
};
