/**
 * ================================================
 * AI SERVICE
 * ================================================
 * 
 * Service layer for AI Scholar responses
 * Integrates with OpenAI API for real AI-powered responses
 * Uses scholarStyles.js to dynamically construct context-aware prompts
 * 
 * API Integration:
 * - OpenAI Chat Completions API
 * - Streaming support ready
 * - Rate limiting handled at middleware level
 */

const axios = require('axios');
const {
  generateScholarPrompt,
  formatScholarResponse,
  getScholarStyle
} = require('../utils/scholarStyles');

// OpenAI API Configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const AI_MODEL = process.env.AI_MODEL || 'gpt-3.5-turbo';
const AI_TEMPERATURE = parseFloat(process.env.AI_TEMPERATURE) || 0.7;
const AI_MAX_TOKENS = parseInt(process.env.AI_MAX_TOKENS) || 2000;

// Validate API key on initialization
if (!OPENAI_API_KEY) {
  console.warn('⚠️  WARNING: OPENAI_API_KEY not set. AI responses will use placeholder mode.');
}

/**
 * Generate AI response from scholar
 * Integrates with OpenAI API with dynamic scholar prompt
 * Falls back to placeholder if API key not configured
 * 
 * @param {string} question - User's question
 * @param {string} scholar - Scholar style/school
 * @returns {object} AI response with scholar style
 * @throws {object} Error object with status and message
 */
const askScholar = async (question, scholar = 'academic') => {
  try {
    // Validate inputs
    if (!question || question.trim().length === 0) {
      throw {
        status: 400,
        message: 'Question cannot be empty'
      };
    }

    if (question.trim().length > 5000) {
      throw {
        status: 400,
        message: 'Question exceeds maximum length of 5000 characters'
      };
    }

    // Get scholar style configuration
    const scholarStyle = getScholarStyle(scholar);

    // Generate scholar-specific prompt
    const systemPrompt = generateScholarPrompt(scholar, question);

    console.log(`[AI Service] Generating response from ${scholarStyle.name}`);
    console.log(`[AI Service] Question: ${question.substring(0, 50)}...`);

    // =========================================
    // REAL OpenAI API CALL
    // =========================================
    
    let aiAnswer;

    if (!OPENAI_API_KEY) {
      // Fallback to placeholder if API key not configured
      console.warn('[AI Service] Using placeholder - OPENAI_API_KEY not configured');
      aiAnswer = generatePlaceholderAnswer(question, scholarStyle);
    } else {
      // Make real API call to OpenAI
      try {
        const response = await axios.post(
          OPENAI_API_URL,
          {
            model: AI_MODEL,
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              {
                role: 'user',
                content: question
              }
            ],
            temperature: AI_TEMPERATURE,
            max_tokens: AI_MAX_TOKENS,
            top_p: 0.9
          },
          {
            headers: {
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 second timeout
          }
        );

        // Extract answer from response
        if (!response.data.choices || response.data.choices.length === 0) {
          throw new Error('No response choices from OpenAI');
        }

        aiAnswer = response.data.choices[0].message.content;

        if (!aiAnswer) {
          throw new Error('Empty response content from OpenAI');
        }

        console.log(`[AI Service] ✓ Successfully generated response (${aiAnswer.length} chars)`);
      } catch (apiError) {
        // Handle specific OpenAI errors
        if (apiError.response?.status === 401) {
          throw {
            status: 401,
            message: 'OpenAI API key is invalid',
            details: 'Check OPENAI_API_KEY environment variable'
          };
        }

        if (apiError.response?.status === 429) {
          throw {
            status: 429,
            message: 'OpenAI API rate limit exceeded',
            details: 'Please try again in a few moments'
          };
        }

        if (apiError.response?.status === 500) {
          throw {
            status: 503,
            message: 'OpenAI API is temporarily unavailable',
            details: 'Please try again later'
          };
        }

        // For timeout or network errors, use fallback
        console.warn(`[AI Service] OpenAI API error: ${apiError.message}`);
        console.log('[AI Service] Using placeholder response as fallback');
        aiAnswer = generatePlaceholderAnswer(question, scholarStyle);
      }
    }

    // Format response with scholar metadata
    const formattedResponse = formatScholarResponse(scholar, aiAnswer);

    return {
      ...formattedResponse,
      usingPlaceholder: !OPENAI_API_KEY || !aiAnswer.includes('according to')
    };
  } catch (error) {
    // Pass through custom errors, wrap others
    if (error.status) {
      throw error;
    }

    throw {
      status: 500,
      message: `AI Service Error: ${error.message}`,
      details: {
        question: question?.substring(0, 50),
        scholar
      }
    };
  }
};

/**
 * Generate placeholder answer
 * This provides a realistic response structure while awaiting AI integration
 * @param {string} question - User question
 * @param {object} scholarStyle - Scholar style config
 * @returns {string} Formatted answer
 */
const generatePlaceholderAnswer = (question, scholarStyle) => {
  const answers = {
    default: `${scholarStyle.prefix}, this is an important question about Islamic practice.

Based on classical Islamic scholarship and the teachings of the Quran and Sunnah, I provide the following guidance:

The question you've asked touches upon fundamental Islamic principles. Islamic jurisprudence provides clear guidance through the Quran, the authentic Sunnah of the Prophet Muhammad (peace be upon him), scholarly consensus (ijma'), and analogical reasoning (qiyas).

According to ${scholarStyle.name}:
${scholarStyle.characteristics.map((char, i) => `${i + 1}. ${char}`).join('\n')}

For a comprehensive understanding of this matter, I recommend consulting with qualified Islamic scholars and studying the relevant Islamic sources. May Allah grant us wisdom and understanding in our faith.

Note: This is a placeholder response. In production, this will be replaced with responses from an advanced AI model trained on Islamic knowledge.`
  };

  return answers.default;
};

/**
 * Validate scholar input
 * @param {string} scholar - Scholar name to validate
 * @returns {boolean} Whether scholar is valid
 */
const isValidScholar = (scholar) => {
  const validScholars = [
    'hanafi',
    'shafii',
    'diyanet',
    'taberi',
    'ibn_kathir',
    'academic'
  ];

  return validScholars.includes(scholar?.toLowerCase());
};

/**
 * Get available scholars for reference
 * @returns {array} List of available scholars
 */
const getAvailableScholars = () => {
  return [
    { id: 'hanafi', name: 'Hanafi School', description: 'Emphasizes logical reasoning in Islamic law' },
    { id: 'shafii', name: 'Shafi\'i School', description: 'Balances hadith and analytical reasoning' },
    { id: 'diyanet', name: 'Turkish Islamic Authority', description: 'Contemporary Islamic perspective' },
    { id: 'taberi', name: 'Al-Taberi', description: 'Classical Quranic interpretation' },
    { id: 'ibn_kathir', name: 'Ibn Kathir', description: 'Hadith-based Quranic interpretation' },
    { id: 'academic', name: 'Academic Islamic Studies', description: 'Modern scholarly research approach' }
  ];
};

/**
 * Process batch questions
 * For future use with rate limiting and caching
 * @param {array} questions - Array of question objects
 * @returns {array} Array of responses
 */
const processBatchQuestions = async (questions) => {
  try {
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Questions must be a non-empty array');
    }

    if (questions.length > 10) {
      throw new Error('Maximum 10 questions per batch');
    }

    const responses = await Promise.all(
      questions.map(q => 
        askScholar(q.question, q.scholar || 'academic')
      )
    );

    return {
      count: responses.length,
      responses,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw {
      status: 400,
      message: `Batch processing error: ${error.message}`
    };
  }
};

module.exports = {
  askScholar,
  isValidScholar,
  getAvailableScholars,
  processBatchQuestions,
  generatePlaceholderAnswer
};
