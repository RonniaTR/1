/**
 * ================================================
 * INPUT VALIDATORS & SANITIZERS
 * ================================================
 * 
 * Centralized validation utilities for request inputs
 * Prevents injection attacks and malformed data
 */

/**
 * Validate and sanitize query strings
 * @param {string} query - Input query to validate
 * @param {number} minLength - Minimum allowed length (default: 1)
 * @param {number} maxLength - Maximum allowed length (default: 500)
 * @returns {object} { valid: boolean, sanitized: string, error: string }
 */
const validateSearchQuery = (query, minLength = 1, maxLength = 500) => {
  if (!query) {
    return {
      valid: false,
      error: 'Search query is required'
    };
  }

  const trimmed = String(query).trim();

  if (trimmed.length < minLength) {
    return {
      valid: false,
      error: `Query must be at least ${minLength} character(s)`
    };
  }

  if (trimmed.length > maxLength) {
    return {
      valid: false,
      error: `Query must not exceed ${maxLength} characters`
    };
  }

  // Remove potentially dangerous characters
  const sanitized = trimmed
    .replace(/[<>\"'%;()&+]/g, '')
    .substring(0, maxLength);

  return {
    valid: true,
    sanitized
  };
};

/**
 * Validate numeric ID parameters
 * @param {any} id - ID to validate
 * @param {number} min - Minimum value (default: 1)
 * @param {number} max - Maximum value (default: 114 for Quran Surahs)
 * @returns {object} { valid: boolean, value: number, error: string }
 */
const validateNumericId = (id, min = 1, max = 114) => {
  if (id === undefined || id === null || id === '') {
    return {
      valid: false,
      error: 'ID is required'
    };
  }

  const numId = parseInt(id, 10);

  if (isNaN(numId)) {
    return {
      valid: false,
      error: 'ID must be a valid number'
    };
  }

  if (numId < min || numId > max) {
    return {
      valid: false,
      error: `ID must be between ${min} and ${max}`
    };
  }

  return {
    valid: true,
    value: numId
  };
};

/**
 * Validate scholar selection
 * @param {string} scholar - Scholar identifier
 * @returns {object} { valid: boolean, scholar: string, error: string }
 */
const validateScholar = (scholar) => {
  const validScholars = [
    'hanafi',
    'shafii',
    'diyanet',
    'taberi',
    'ibn_kathir',
    'academic'
  ];

  if (!scholar) {
    return {
      valid: true,
      scholar: 'academic', // Default to academic
      note: 'Using default scholar: academic'
    };
  }

  const normalized = String(scholar).toLowerCase().trim();

  if (!validScholars.includes(normalized)) {
    return {
      valid: false,
      error: `Invalid scholar. Valid options: ${validScholars.join(', ')}`
    };
  }

  return {
    valid: true,
    scholar: normalized
  };
};

/**
 * Validate JSON request body
 * @param {any} body - Request body object
 * @param {array} requiredFields - Array of required field names
 * @returns {object} { valid: boolean, errors: object }
 */
const validateRequestBody = (body, requiredFields = []) => {
  const errors = {};

  if (!body || typeof body !== 'object') {
    return {
      valid: false,
      errors: { body: 'Request body must be valid JSON' }
    };
  }

  // Check required fields
  requiredFields.forEach(field => {
    if (!(field in body) || body[field] === null || body[field] === undefined) {
      errors[field] = `${field} is required`;
    } else if (typeof body[field] === 'string' && body[field].trim() === '') {
      errors[field] = `${field} cannot be empty`;
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate language code
 * @param {string} language - Language code
 * @returns {object} { valid: boolean, language: string, error: string }
 */
const validateLanguage = (language) => {
  const supportedLanguages = ['ar', 'en', 'tr', 'ur', 'es', 'fr'];

  if (!language) {
    return {
      valid: true,
      language: 'en', // Default to English
      note: 'Using default language: English'
    };
  }

  const normalized = String(language).toLowerCase().trim();

  if (!supportedLanguages.includes(normalized)) {
    return {
      valid: false,
      error: `Invalid language. Supported: ${supportedLanguages.join(', ')}`
    };
  }

  return {
    valid: true,
    language: normalized
  };
};

/**
 * Validate Hadith collection
 * @param {string} collection - Collection identifier
 * @returns {object} { valid: boolean, collection: string, error: string }
 */
const validateCollection = (collection) => {
  const validCollections = [
    'bukhari',
    'muslim',
    'abudawood',
    'nasai',
    'ibnmajah',
    'tirmidhi'
  ];

  if (!collection) {
    return {
      valid: true,
      collection: null, // null means search all
      note: 'Searching all collections'
    };
  }

  const normalized = String(collection).toLowerCase().trim();

  if (!validCollections.includes(normalized)) {
    return {
      valid: false,
      error: `Invalid collection. Valid: ${validCollections.join(', ')}`
    };
  }

  return {
    valid: true,
    collection: normalized
  };
};

/**
 * Validate API rate limiting
 * @param {object} rateLimitStore - In-memory store { ip: { count, timestamp } }
 * @param {string} clientIp - Client IP address
 * @param {number} maxRequests - Max requests allowed (default: 100)
 * @param {number} windowMs - Time window in ms (default: 15 min)
 * @returns {object} { allowed: boolean, remaining: number }
 */
const checkRateLimit = (rateLimitStore, clientIp, maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const now = Date.now();
  const key = clientIp;

  if (!rateLimitStore[key]) {
    rateLimitStore[key] = { count: 1, timestamp: now };
    return {
      allowed: true,
      remaining: maxRequests - 1
    };
  }

  const { count, timestamp } = rateLimitStore[key];
  const elapsed = now - timestamp;

  // Reset if window has passed
  if (elapsed > windowMs) {
    rateLimitStore[key] = { count: 1, timestamp: now };
    return {
      allowed: true,
      remaining: maxRequests - 1
    };
  }

  // Check if limit exceeded
  if (count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0
    };
  }

  // Increment counter
  rateLimitStore[key].count += 1;
  return {
    allowed: true,
    remaining: maxRequests - rateLimitStore[key].count
  };
};

module.exports = {
  validateSearchQuery,
  validateNumericId,
  validateScholar,
  validateRequestBody,
  validateLanguage,
  validateCollection,
  checkRateLimit
};
