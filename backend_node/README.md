# Islamic AI Backend - Node.js/Express

A production-level Node.js/Express backend for Islamic AI applications. Fully compatible with React Native Expo mobile apps on local networks.

## 📋 Features

- ✅ **Quran API** - Search verses, get Surahs, fetch individual verses
- ✅ **AI Scholar System** - Ask questions from different Islamic scholar perspectives
- ✅ **Hadith API** - Search and fetch Hadith from major collections
- ✅ **User Management** - Extensible user settings and favorites
- ✅ **Mobile Compatible** - Works seamlessly with Expo apps on local WiFi
- ✅ **Production Ready** - Clean architecture, error handling, logging
- ✅ **Expandable** - Modular structure ready for new features

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set your configuration:

```bash
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=your_key_here
```

### 3. Start Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server starts at: `http://localhost:3000`

## 📱 Mobile App Configuration (Expo)

Your React Native Expo app should configure Axios like this:

```javascript
// In your Expo app's environment file or axios config:
const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosInstance;
```

### Finding Your Computer's IP Address

**On macOS/Linux:**
```bash
ipconfig getifaddr en0
# Output example: 192.168.1.100
```

**On Windows:**
```bash
ipconfig
# Look for IPv4 Address under your WiFi adapter
# Example: 192.168.1.100
```

### Set Expo Environment Variable

In your Expo app's `.env` file:

```bash
EXPO_PUBLIC_BACKEND_URL=http://192.168.1.100:3000
```

**Important:** Make sure:
1. ✅ Phone and computer are on the SAME WiFi network
2. ✅ Computer's firewall allows port 3000
3. ✅ No VPN is blocking local network access

## 📚 API Endpoints

### Base URL
- **Desktop/Simulator:** `http://localhost:3000`
- **Mobile on same WiFi:** `http://192.168.1.X:3000`

### Quran API

#### Search Verses
```
GET /api/quran/search?query=allah&language=en
```

Response:
```json
{
  "status": "success",
  "data": {
    "query": "allah",
    "results": [
      {
        "surah": 1,
        "ayah": 1,
        "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        "translation": "In the name of Allah..."
      }
    ]
  }
}
```

#### Get Surah
```
GET /api/quran/surah/1
GET /api/quran/surah/1?language=en
```

#### Get Single Verse
```
GET /api/quran/verse/1/1
GET /api/quran/verse/1/1?language=en
```

#### Get All Surahs
```
GET /api/quran/surahs
```

#### Get Supported Languages
```
GET /api/quran/editions
```

### AI Scholar System

#### Ask a Question
```
POST /api/ai/ask
Content-Type: application/json

{
  "question": "How is travel prayer performed?",
  "scholar": "hanafi"
}
```

**Supported Scholars:**
- `hanafi` - Hanafi school of jurisprudence
- `shafii` - Shafi'i school of jurisprudence
- `diyanet` - Turkish Islamic Authority perspective
- `taberi` - Classical Quranic interpretation (Al-Taberi)
- `ibn_kathir` - Classical Quranic interpretation (Ibn Kathir)
- `academic` - Modern academic Islamic studies

Response:
```json
{
  "status": "success",
  "data": {
    "scholar": "hanafi",
    "scholarName": "Hanafi School",
    "answer": "According to the Hanafi school...",
    "methodology": "logical_reasoning",
    "timestamp": "2024-03-06T10:30:00.000Z"
  }
}
```

#### Get Available Scholars
```
GET /api/ai/scholars
```

#### Batch Questions
```
POST /api/ai/batch
Content-Type: application/json

{
  "questions": [
    { "question": "What is wudu?", "scholar": "hanafi" },
    { "question": "What is salah?", "scholar": "academic" }
  ]
}
```

### Hadith API

#### Search Hadith
```
GET /api/hadith/search?query=prayer
GET /api/hadith/search?query=prayer&collection=bukhari
```

#### Get Hadith by ID
```
GET /api/hadith/bukhari_1_1
```

#### Get Collections
```
GET /api/hadith/collections
```

Returns information about Sahih Bukhari, Sahih Muslim, etc.

#### Search by Theme
```
GET /api/hadith/theme/prayer
```

### User Management

#### Get Profile
```
GET /api/user/profile
```

#### Get Settings
```
GET /api/user/settings
```

#### Update Settings
```
PUT /api/user/settings
Content-Type: application/json

{
  "language": "en",
  "theme": "dark",
  "scholar_preference": "hanafi"
}
```

#### Get Favorites
```
GET /api/user/favorites
```

#### Add Favorite
```
POST /api/user/favorites
Content-Type: application/json

{
  "type": "surah",
  "id": 1
}
```

#### Get Statistics
```
GET /api/user/stats
```

## 🏗️ Project Structure

```
backend_node/
├── server.js                 # Main Express server
├── package.json             # Dependencies
├── .env.example             # Environment template
├── .gitignore              # Git ignore rules
│
├── routes/                  # API route handlers
│   ├── quran.js            # Quran endpoints
│   ├── ai.js               # AI Scholar endpoints
│   ├── hadith.js           # Hadith endpoints
│   └── user.js             # User endpoints
│
├── controllers/             # Request handlers
│   ├── quranController.js
│   ├── aiController.js
│   └── hadithController.js
│
├── services/               # Business logic
│   ├── quranService.js     # Quran operations
│   ├── aiService.js        # AI operations
│   └── hadithService.js    # Hadith operations
│
├── middleware/             # Express middleware
│   ├── errorHandler.js     # Error handling
│   └── logger.js           # Request logging
│
└── utils/                  # Utility functions
    └── scholarStyles.js    # Scholar style definitions
```

## 🔧 Middleware

### CORS Configuration

The server is configured to accept requests from:
- `localhost:3000` (Desktop)
- `localhost:19000` & `localhost:19001` (Expo dev server)
- `192.168.x.x:*` (Local network - for Expo on device)
- `10.x.x.x:*` (Docker/Virtual networks)

### Error Handler

All errors are caught and formatted consistently:

```json
{
  "error": {
    "status": 400,
    "message": "Error description",
    "timestamp": "2024-03-06T10:30:00.000Z"
  }
}
```

### Request Logger

All requests are logged with:
- HTTP Method
- Path
- Status Code
- Duration
- Client IP
- User Agent

## 🔌 Extending the Backend

### Add New Route

1. Create new file in `routes/` folder
2. Import in `server.js`
3. Add to `app.use('/api/path', routeHandler)`

### Add New Service

1. Create service in `services/` folder
2. Implement business logic
3. Import in controller

### Connect AI Model

In `services/aiService.js`, replace placeholder with:

```javascript
const response = await axios.post(
  'https://api.openai.com/v1/chat/completions',
  {
    model: process.env.AI_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question }
    ],
    temperature: parseFloat(process.env.AI_TEMPERATURE),
    max_tokens: parseInt(process.env.AI_MAX_TOKENS)
  },
  {
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    }
  }
);

const aiAnswer = response.data.choices[0].message.content;
```

### Connect Hadith Database

In `services/hadithService.js`, integrate with:
- Hadith API: https://hadithapi.com
- Local MongoDB
- Your custom database

## 🧪 Testing Endpoints

### Using cURL

```bash
# Health check
curl http://localhost:3000/health

# Search Quran
curl "http://localhost:3000/api/quran/search?query=allah"

# Ask AI Scholar
curl -X POST http://localhost:3000/api/ai/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is prayer?",
    "scholar": "hanafi"
  }'

# Search Hadith
curl "http://localhost:3000/api/hadith/search?query=prayer"
```

### Using Postman

1. Import the endpoints above
2. Set base URL to `http://localhost:3000`
3. Test each endpoint

### From Your Expo App

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL
});

// Search Quran
const searchQuran = async (query) => {
  try {
    const response = await api.get('/api/quran/search', {
      params: { query }
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

// Ask Scholar
const askScholar = async (question, scholar) => {
  try {
    const response = await api.post('/api/ai/ask', {
      question,
      scholar
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
```

## 📊 Environment Variables

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# API Keys
OPENAI_API_KEY=sk-...

# API URLs
QURAN_API_URL=https://api.alquran.cloud
HADITH_API_URL=https://hadithapi.com

# AI Configuration
AI_MODEL=gpt-3.5-turbo
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=2000

# Frontend URL
FRONTEND_URL=http://192.168.1.100:19000
```

## 🚀 Deployment

### Deploy to Heroku

```bash
git push heroku main
heroku config:set OPENAI_API_KEY=your_key
```

### Deploy to DigitalOcean

```bash
# Connect to your droplet
ssh root@your_droplet_ip

# Clone repository
git clone your_repo.git
cd backend_node

# Install dependencies
npm install

# Set environment variables
nano .env

# Start with PM2
npm install -g pm2
pm2 start server.js --name islamic-api
```

### Deploy to AWS Lambda

Convert `server.js` to AWS Lambda handler using `serverless-http`.

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## 📝 License

MIT License - feel free to use this project commercially

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review error messages in logs

## 🙏 Acknowledgments

- Quran data from [Al Quran Cloud API](https://alquran.cloud)
- Islamic knowledge communities
- Contributors and users

---

**Happy coding! May this project help in spreading Islamic knowledge.** 🌙✨
