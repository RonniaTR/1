/**
 * ================================================
 * QURAN SERVICE
 * ================================================
 * 
 * Service layer for Quran operations
 * Handles API calls to Al Quran Cloud API
 * Implements caching and error handling
 * 
 * API: https://alquran.cloud/api
 * Documentation: https://alquran.cloud
 */

const axios = require('axios');

// API Configuration
const QURAN_API_URL = process.env.QURAN_API_URL || 'https://api.alquran.cloud/v1';
const API_TIMEOUT = 10000; // 10 second timeout

// Simple in-memory cache to reduce API calls
const cache = {
  surahs: null,
  surahsTimestamp: null,
  cacheDuration: 24 * 60 * 60 * 1000 // 24 hours
};

// Supported languages for Quran text
const SUPPORTED_LANGUAGES = {
  ar: { name: 'Arabic', edition: 'quran-uthmani' },
  en: { name: 'English', edition: 'en.asad' },
  tr: { name: 'Turkish', edition: 'tr.diyanet' },
  ur: { name: 'Urdu', edition: 'ur.junagarhi' },
  es: { name: 'Spanish', edition: 'es.cordoba' },
  fr: { name: 'French', edition: 'fr.hamidullah' }
};

/**
 * Search verses in Quran
 * Searches across all surahs for matching keywords
 * Note: Free API doesn't have built-in search, so we fetch surahs and filter locally
 * 
 * @param {string} query - Search query
 * @param {string} language - Language code (default: 'en')
 * @returns {array} Array of matching verses
 * @throws {object} Error object with status and message
 */
const searchVerses = async (query, language = 'en') => {
  try {
    if (!query || query.trim().length === 0) {
      throw {
        status: 400,
        message: 'Query cannot be empty'
      };
    }

    if (query.trim().length > 500) {
      throw {
        status: 400,
        message: 'Query exceeds maximum length of 500 characters'
      };
    }

    const searchTerm = query.trim().toLowerCase();
    const edition = SUPPORTED_LANGUAGES[language]?.edition || 'en.asad';

    console.log(`[Quran Service] Searching for: "${query}" in ${language}`);

    // Get all Surahs (uses cache)
    const surahs = await getAllSurahs();

    // Search through verses locally
    const results = [];
    let totalMatches = 0;

    for (const surah of surahs) {
      // Fetch verses for this surah
      try {
        const surahResponse = await axios.get(
          `${QURAN_API_URL}/surah/${surah.number}`,
          { timeout: API_TIMEOUT }
        );

        if (surahResponse.data.code === 200) {
          const ayahs = surahResponse.data.data.ayahs;

          // Search in this surah's verses
          ayahs.forEach(ayah => {
            // Search in Arabic text
            if (ayah.text && ayah.text.toLowerCase().includes(searchTerm)) {
              results.push({
                surah: surah.number,
                surahName: surah.name,
                surahNameEnglish: surah.englishName,
                ayah: ayah.numberInSurah,
                text: ayah.text,
                numberInQuran: ayah.number
              });
              totalMatches++;
            }
          });
        }
      } catch (err) {
        // Log error but continue searching other surahs
        console.warn(`[Quran Service] Failed to fetch surah ${surah.number}: ${err.message}`);
      }

      // Limit to first 50 matches to avoid overwhelming response
      if (totalMatches >= 50) {
        break;
      }
    }

    console.log(`[Quran Service] Found ${results.length} matches for "${query}"`);

    return {
      query,
      language,
      edition,
      results: results.slice(0, 20), // Return first 20
      total: results.length,
      totalSearched: surahs.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    if (error.status) {
      throw error;
    }

    throw {
      status: 500,
      message: `Quran search error: ${error.message}`,
      details: { query }
    };
  }
};

/**
 * Get full Surah
 * Returns all verses of a specific Surah
 * 
 * @param {number} surahId - Surah number (1-114)
 * @param {string} language - Language code
 * @returns {object} Surah with all verses
 * @throws {object} Error object
 */
const getSurah = async (surahId, language = 'en') => {
  try {
    // Validate surah ID
    const id = parseInt(surahId, 10);
    if (isNaN(id) || id < 1 || id > 114) {
      throw {
        status: 400,
        message: 'Surah ID must be between 1 and 114'
      };
    }

    console.log(`[Quran Service] Fetching Surah ${id} in ${language}`);

    // Call the Quran API
    const response = await axios.get(
      `${QURAN_API_URL}/surah/${id}`,
      { timeout: API_TIMEOUT }
    );

    if (response.data.code !== 200) {
      throw {
        status: 404,
        message: 'Surah not found'
      };
    }

    const surahData = response.data.data;

    // Transform response for consistency
    return {
      surah: surahData.number,
      name: surahData.name,
      englishName: surahData.englishName,
      englishNameTranslation: surahData.englishNameTranslation,
      numberOfAyahs: surahData.numberOfAyahs,
      revelationType: surahData.revelationType,
      verses: surahData.ayahs.map(ayah => ({
        ayah: ayah.numberInSurah,
        text: ayah.text,
        numberInQuran: ayah.number,
        juz: ayah.juz || null,
        page: ayah.page || null
      })),
      fetchedAt: new Date().toISOString()
    };
  } catch (error) {
    if (error.status) {
      throw error;
    }

    if (error.response?.status === 404) {
      throw {
        status: 404,
        message: 'Surah not found'
      };
    }

    throw {
      status: 500,
      message: `Failed to fetch Surah: ${error.message}`,
      details: { surahId }
    };
  }
};

/**
 * Get single verse
 * Returns a specific verse
 * 
 * @param {number} surahId - Surah number
 * @param {number} verseId - Verse number within the Surah
 * @param {string} language - Language code
 * @returns {object} Verse details
 * @throws {object} Error object
 */
const getVerse = async (surahId, verseId, language = 'en') => {
  try {
    const surah = parseInt(surahId, 10);
    const verse = parseInt(verseId, 10);

    if (isNaN(surah) || surah < 1 || surah > 114) {
      throw {
        status: 400,
        message: 'Surah ID must be between 1 and 114'
      };
    }

    if (isNaN(verse) || verse < 1) {
      throw {
        status: 400,
        message: 'Verse ID must be a positive number'
      };
    }

    console.log(`[Quran Service] Fetching Surah ${surah}, Verse ${verse}`);

    // Call the Quran API for specific verse
    const response = await axios.get(
      `${QURAN_API_URL}/ayah/${surah}:${verse}`,
      { timeout: API_TIMEOUT }
    );

    if (response.data.code !== 200) {
      throw {
        status: 404,
        message: 'Verse not found'
      };
    }

    const ayah = response.data.data;

    return {
      surah: ayah.surah.number,
      surahName: ayah.surah.name,
      surahEnglish: ayah.surah.englishName,
      surahEnglishTranslation: ayah.surah.englishNameTranslation,
      verse: ayah.numberInSurah,
      text: ayah.text,
      numberInQuran: ayah.number,
      juz: ayah.juz,
      manzil: ayah.manzil,
      page: ayah.page,
      ruku: ayah.ruku,
      hizbQuarter: ayah.hizbQuarter,
      sajdah: ayah.sajdah || false,
      fetchedAt: new Date().toISOString()
    };
  } catch (error) {
    if (error.status) {
      throw error;
    }

    if (error.response?.status === 404) {
      throw {
        status: 404,
        message: 'Verse not found'
      };
    }

    throw {
      status: 500,
      message: `Failed to fetch verse: ${error.message}`,
      details: { surahId, verseId }
    };
  }
};

/**
 * Get all Surahs metadata
 * Returns information about all 114 Surahs
 * Uses in-memory cache to reduce API calls
 * 
 * @returns {array} Array of Surahs with metadata
 * @throws {object} Error object
 */
const getAllSurahs = async () => {
  try {
    // Check cache first
    const now = Date.now();
    if (cache.surahs && cache.surahsTimestamp && (now - cache.surahsTimestamp) < cache.cacheDuration) {
      console.log('[Quran Service] Returning cached Surahs');
      return cache.surahs;
    }

    console.log('[Quran Service] Fetching all Surahs metadata');

    const response = await axios.get(
      `${QURAN_API_URL}/quran`,
      { timeout: API_TIMEOUT }
    );

    if (response.data.code !== 200) {
      throw {
        status: 500,
        message: 'Failed to fetch Surahs'
      };
    }

    // Cache the surahs
    const surahs = response.data.data.surahs.references.map(surah => ({
      number: surah.number,
      name: surah.name,
      englishName: surah.englishName,
      englishNameTranslation: surah.englishNameTranslation,
      numberOfAyahs: surah.numberOfAyahs,
      revelationType: surah.revelationType
    }));

    cache.surahs = surahs;
    cache.surahsTimestamp = now;

    return surahs;
  } catch (error) {
    if (error.status) {
      throw error;
    }

    throw {
      status: 500,
      message: `Failed to fetch Surahs: ${error.message}`
    };
  }
};

/**
 * Get supported Quran editions/translations
 * Returns available language editions: Arabic, English, Spanish, Turkish
 * Uses caching to reduce API calls
 * 
 * @returns {array} Array of available editions with metadata
 * @throws {object} Error object
 */
const getSupportedEditions = async () => {
  try {
    // Check cache first
    const now = Date.now();
    if (cache.editions && cache.editionsTimestamp && (now - cache.editionsTimestamp) < cache.cacheDuration) {
      console.log('[Quran Service] Returning cached editions');
      return cache.editions;
    }

    console.log('[Quran Service] Fetching supported editions');

    const response = await axios.get(
      `${QURAN_API_URL}/edition`,
      { timeout: API_TIMEOUT }
    );

    if (response.data.code !== 200) {
      throw {
        status: 500,
        message: 'Failed to fetch editions'
      };
    }

    // Filter to supported editions: Arabic original, English, Spanish, Turkish
    const supportedIdentifiers = [
      'ar.alafasy',      // Arabic recitation
      'en.pickthall',    // English translation
      'es.cordoba',      // Spanish translation
      'tr.ates'          // Turkish translation
    ];

    const editions = response.data.data
      .filter(edition => supportedIdentifiers.includes(edition.identifier))
      .map(edition => ({
        identifier: edition.identifier,
        language: edition.language,
        name: edition.name,
        englishName: edition.englishName,
        format: edition.format,
        type: edition.type
      }));

    // Cache the editions
    cache.editions = editions;
    cache.editionsTimestamp = now;

    return editions;
  } catch (error) {
    if (error.status) {
      throw error;
    }

    throw {
      status: 500,
      message: `Failed to fetch editions: ${error.message}`
    };
  }
};

module.exports = {
  searchVerses,
  getSurah,
  getVerse,
  getAllSurahs,
  getSupportedEditions,
  QURAN_API_URL
};
