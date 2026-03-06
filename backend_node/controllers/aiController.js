/**
 * ================================================
 * AI CONTROLLER
 * ================================================
 * 
 * Request handlers for AI Scholar endpoints
 * Validates input via utils/validators.js
 * Passes errors to global errorHandler middleware
 */

const aiService = require('../services/aiService');
const { validateRequestBody, validateScholar, validateSearchQuery } = require('../utils/validators');

/**
 * Ask Islamic scholar a question
 * POST /api/ai/ask
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 * 
 * Body example:
 * {
 *   "question": "How is travel prayer performed?",
 *   "scholar": "hanafi"
 * }
 */
const askScholar = async (req, res, next) => {
  try {
    const { question, scholar = 'academic' } = req.body;

    // Validate request body structure
    validateRequestBody(req.body, ['question']);

    // Validate question exists and is not empty
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return next({
        status: 400,
        message: 'Question is required and must be a non-empty string',
        example: {
          question: 'How is travel prayer performed?',
          scholar: 'hanafi'
        }
      });
    }

    // Sanitize and validate question
    const sanitizedQuestion = validateSearchQuery(question, 5, 5000);

    // Validate scholar
    const validatedScholar = validateScholar(scholar);

    console.log(`[AI Controller] Processing question for scholar: ${validatedScholar}`);

    // Get response from AI service
    const response = await aiService.askScholar(sanitizedQuestion, validatedScholar);

    res.json({
      status: 'success',
      data: response
    });
  } catch (error) {
    // Pass error to global error handler middleware
    next({
      status: error.status || 500,
      message: error.message || 'Failed to process your question',
      endpoint: '/api/ai/ask'
    });
  }
};

/**
 * Get available Islamic scholars
 * GET /api/ai/scholars
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 * 
 * Returns list of supported scholar interpretations
 */
const getAvailableScholars = async (req, res, next) => {
  try {
    console.log('[AI Controller] Fetching available scholars');

    const scholars = aiService.getAvailableScholars();

    res.json({
      status: 'success',
      count: scholars.length,
      data: scholars
    });
  } catch (error) {
    // Pass error to global error handler middleware
    next({
      status: error.status || 500,
      message: error.message || 'Failed to fetch available scholars',
      endpoint: '/api/ai/scholars'
    });
  }
};

/**
 * Process batch questions
 * POST /api/ai/batch
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 * 
 * Body example:
 * {
 *   "questions": [
 *     { "question": "What is wudu?", "scholar": "hanafi" },
 *     { "question": "What is salah?", "scholar": "academic" }
 *   ]
 * }
 */
const processBatch = async (req, res, next) => {
  try {
    const { questions } = req.body;

    // Validate request body structure
    validateRequestBody(req.body, ['questions']);

    // Validate questions array
    if (!Array.isArray(questions) || questions.length === 0) {
      return next({
        status: 400,
        message: 'Questions must be a non-empty array',
        example: {
          questions: [
            { question: 'What is wudu?', scholar: 'hanafi' },
            { question: 'What is salah?', scholar: 'academic' }
          ]
        }
      });
    }

    // Limit batch size to prevent abuse
    if (questions.length > 10) {
      return next({
        status: 400,
        message: 'Maximum 10 questions per batch request',
        received: questions.length
      });
    }

    // Validate each question in the batch
    for (let i = 0; i < questions.length; i++) {
      const item = questions[i];
      if (!item.question || typeof item.question !== 'string' || item.question.trim().length === 0) {
        return next({
          status: 400,
          message: `Invalid question at index ${i}: question must be a non-empty string`
        });
      }
      if (!item.scholar) {
        questions[i].scholar = 'academic'; // Default scholar
      }
    }

    console.log(`[AI Controller] Processing batch of ${questions.length} questions`);

    // Get results from AI service
    const results = await aiService.processBatchQuestions(questions);

    res.json({
      status: 'success',
      count: results.length,
      data: results
    });
  } catch (error) {
    // Pass error to global error handler middleware
    next({
      status: error.status || 500,
      message: error.message || 'Batch processing failed',
      endpoint: '/api/ai/batch'
    });
  }
};

module.exports = {
  askScholar,
  getAvailableScholars,
  processBatch
};
