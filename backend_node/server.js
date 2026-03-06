/**
 * ================================================
 * ISLAMIC AI BACKEND - Main Server
 * ================================================
 * 
 * Production-level Express.js backend for Islamic AI application
 * Fully compatible with React Native Expo mobile apps on local network
 * 
 * EXPO MOBILE CONNECTION:
 * ========================
 * The React Native Expo app should use:
 * 
 *   EXPO_PUBLIC_BACKEND_URL=http://192.168.1.X:3000
 * 
 * Where:
 *   - 192.168.1.X = Your computer's IP address on the WiFi network
 *   - 3000 = Port this backend runs on
 * 
 * IMPORTANT: The mobile phone and your computer MUST be on the same WiFi network!
 * 
 * Example:
 *   Computer: 192.168.1.100
 *   Phone: 192.168.1.101
 *   Same WiFi: "MyHome WiFi"
 *   
 *   In Expo app .env file:
 *   EXPO_PUBLIC_BACKEND_URL=http://192.168.1.100:3000
 *   
 *   Axios in app will use:
 *   axios.create({
 *     baseURL: process.env.EXPO_PUBLIC_BACKEND_URL
 *   })
 * 
 * START SERVER:
 * =============
 * npm install      # Install dependencies
 * npm start        # Start server on port 3000
 * npm run dev      # Start with nodemon for development
 * 
 * ACCESS SERVER:
 * ==============
 * Desktop/Simulator: http://localhost:3000
 * Mobile on same WiFi: http://192.168.1.X:3000
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

// Import routes
const quranRoutes = require('./routes/quran');
const aiRoutes = require('./routes/ai');
const hadithRoutes = require('./routes/hadith');
const userRoutes = require('./routes/user');

// ================================================
// ENVIRONMENT VARIABLE VALIDATION
// ================================================

/**
 * Validate required environment variables before startup
 * Logs warnings for optional variables
 */
const validateEnvironment = () => {
  const errors = [];
  const warnings = [];

  // Required environment variables
  const requiredVars = {
    'OPENAI_API_KEY': 'Required for AI Scholar features'
  };

  // Optional environment variables with defaults
  const optionalVars = {
    'PORT': '3000',
    'NODE_ENV': 'development',
    'QURAN_API_URL': 'https://api.alquran.cloud/v1',
    'HADITH_API_URL': 'https://hadithapi.com/api',
    'AI_MODEL': 'gpt-3.5-turbo',
    'AI_TEMPERATURE': '0.7',
    'AI_MAX_TOKENS': '2000'
  };

  // Check required variables
  for (const [varName, description] of Object.entries(requiredVars)) {
    if (!process.env[varName]) {
      errors.push(`  ❌ ${varName}: ${description}`);
    }
  }

  // Check optional variables and warn if missing
  for (const [varName, defaultValue] of Object.entries(optionalVars)) {
    if (!process.env[varName]) {
      warnings.push(`  ⚠️  ${varName}: Using default value '${defaultValue}'`);
    }
  }

  // Log validation results
  if (errors.length > 0) {
    console.error('\n❌ ENVIRONMENT CONFIGURATION ERROR:');
    console.error('The following required environment variables are missing:\n');
    errors.forEach(err => console.error(err));
    console.error('\n📝 Solution: Create a .env file in the backend_node directory with:');
    console.error('   OPENAI_API_KEY=your_openai_api_key_here\n');
    process.exit(1);
  }

  if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('\n⚠️  OPTIONAL ENVIRONMENT VARIABLES NOT SET:');
    warnings.forEach(warn => console.warn(warn));
    console.warn('');
  }

  // Log configured variables (hide sensitive values)
  console.log('\n✓ Environment Configuration Validated:');
  console.log(`  • NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  • OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? '✓ Configured' : '✗ Missing'}`);
  console.log(`  • QURAN_API_URL: ${process.env.QURAN_API_URL || 'https://api.alquran.cloud/v1'}`);
  console.log(`  • HADITH_API_URL: ${process.env.HADITH_API_URL || 'https://hadithapi.com/api'}`);
};

// Run validation
validateEnvironment();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ================================================
// MIDDLEWARE SETUP
// ================================================

// CORS Configuration - Allow mobile app on local network
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:19000',    // Expo dev server
    'http://localhost:19001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:19000',
    // Allow all 192.168.x.x addresses for local network development
    /^http:\/\/192\.168\.\d+\.\d+:\d+$/,
    // Allow all 10.x.x.x addresses for Docker/Virtual networks
    /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/,
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 3600
}));

// Parse JSON request bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use(logger);

// ================================================
// HEALTH CHECK ENDPOINT
// ================================================

/**
 * Health check endpoint
 * Use this to verify the server is running
 * Useful for debugging connection issues
 */
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Islamic AI Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      quran: '/api/quran',
      ai: '/api/ai',
      hadith: '/api/hadith',
      user: '/api/user'
    }
  });
});

// Health check endpoint for Expo app
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// ================================================
// API ROUTES
// ================================================

// Quran API Routes
app.use('/api/quran', quranRoutes);

// AI Scholar System Routes
app.use('/api/ai', aiRoutes);

// Hadith API Routes
app.use('/api/hadith', hadithRoutes);

// User Management Routes
app.use('/api/user', userRoutes);

// ================================================
// 404 NOT FOUND HANDLER
// ================================================

app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    availableEndpoints: {
      quran: 'GET /api/quran/search?query=word',
      quranSurah: 'GET /api/quran/surah/:id',
      quranVerse: 'GET /api/quran/verse/:surah/:verse',
      aiAsk: 'POST /api/ai/ask',
      hadithSearch: 'GET /api/hadith/search?query=prayer'
    }
  });
});

// ================================================
// ERROR HANDLING MIDDLEWARE
// ================================================

app.use(errorHandler);

// ================================================
// START SERVER
// ================================================

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║     Islamic AI Backend Server - RUNNING                ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`\n✓ Server listening on port: ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n📱 MOBILE CONNECTION:`);
  console.log(`   Set EXPO_PUBLIC_BACKEND_URL=http://<YOUR_PC_IP>:${PORT}`);
  console.log(`   Example: http://192.168.1.100:${PORT}`);
  console.log(`\n🔗 ACCESS ENDPOINTS:`);
  console.log(`   Desktop: http://localhost:${PORT}`);
  console.log(`   Local Network: http://<YOUR_PC_IP>:${PORT}`);
  console.log(`\n🧪 TEST ENDPOINTS:`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Quran: http://localhost:${PORT}/api/quran/search?query=allah`);
  console.log(`   AI: POST http://localhost:${PORT}/api/ai/ask`);
  console.log(`   Hadith: http://localhost:${PORT}/api/hadith/search?query=prayer`);
  console.log('\n');
});

// Handle uncaught exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

module.exports = app;
