# 🚀 Production Backend - Quick Start Guide

## Prerequisites

- Node.js 14+ installed
- OpenAI API key (get one at https://platform.openai.com/api-keys)
- npm or yarn package manager

## Setup Steps

### 1️⃣ Create Environment Configuration

Copy the `.env.example` file and configure it:

```bash
cd backend_node
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```bash
# Required
OPENAI_API_KEY=sk-...your_openai_api_key_here...

# Optional (leave defaults if unsure)
PORT=3000
NODE_ENV=development
```

### 2️⃣ Install Dependencies

```bash
cd backend_node
npm install
```

This installs:
- `express` - Web framework
- `axios` - HTTP client
- `cors` - Cross-origin requests
- `dotenv` - Environment configuration

### 3️⃣ Start the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start

# Or directly with Node
node server.js
```

### ✅ Verify Server is Running

You should see:

```
╔════════════════════════════════════════════════════════╗
║     Islamic AI Backend Server - RUNNING                ║
╚════════════════════════════════════════════════════════╝

✓ Server listening on port: 3000
✓ Environment: development

📱 MOBILE CONNECTION:
   Set EXPO_PUBLIC_BACKEND_URL=http://<YOUR_PC_IP>:3000
   Example: http://192.168.1.100:3000

🔗 ACCESS ENDPOINTS:
   Desktop: http://localhost:3000
   Local Network: http://<YOUR_PC_IP>:3000

🧪 TEST ENDPOINTS:
   Health: http://localhost:3000/health
   Quran: http://localhost:3000/api/quran/search?query=allah
   AI: POST http://localhost:3000/api/ai/ask
   Hadith: http://localhost:3000/api/hadith/search?query=prayer
```

---

## 🧪 Testing Endpoints

### Test 1: Health Check
```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "healthy",
  "uptime": 123.456,
  "memory": {...},
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Test 2: Quran Search (Real Alquran.cloud API)
```bash
curl "http://localhost:3000/api/quran/search?query=mercy&language=en"
```

Response:
```json
{
  "status": "success",
  "data": {
    "query": "mercy",
    "language": "en",
    "results": [
      {
        "surah": 2,
        "surahName": "Al-Baqarah",
        "verse": 160,
        "text": "..."
      }
    ],
    "total": 42
  }
}
```

### Test 3: Get Surah (Real Alquran.cloud API)
```bash
curl "http://localhost:3000/api/quran/surah/1"
```

### Test 4: AI Scholar (Real OpenAI API)
```bash
curl -X POST http://localhost:3000/api/ai/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "How is Salah performed?",
    "scholar": "academic"
  }'
```

Response:
```json
{
  "status": "success",
  "data": {
    "question": "How is Salah performed?",
    "scholar": "academic",
    "response": "According to academic Islamic scholarship...",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Test 5: Hadith Search (Real hadithapi.com API)
```bash
curl "http://localhost:3000/api/hadith/search?query=intention"
```

### Test 6: Available Scholars
```bash
curl http://localhost:3000/api/ai/scholars
```

Response:
```json
{
  "status": "success",
  "count": 6,
  "data": [
    { "id": "hanafi", "name": "Hanafi School" },
    { "id": "shafii", "name": "Shafi'i School" },
    // ... more scholars
  ]
}
```

---

## 📱 Mobile Expo App Connection

### Setup for Local Network Testing

1. **Get your computer's IP address:**

   **macOS/Linux:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
   
   **Windows:**
   ```bash
   ipconfig
   ```
   
   Look for an address like `192.168.1.100` or `10.0.0.5`

2. **Configure Expo App:**

   In `frontend/.env`:
   ```
   EXPO_PUBLIC_BACKEND_URL=http://192.168.1.100:3000
   ```
   (Replace 192.168.1.100 with your actual IP)

3. **Start the app:**
   ```bash
   cd frontend
   npm start
   ```

4. **Verify Connection:**
   - Backend logs should show Expo app requests
   - App should successfully call `/health` endpoint

---

## 🔧 Configuration Options

### Environment Variables

```bash
# PORT - Server port (default: 3000)
PORT=3000

# NODE_ENV - Environment mode (development/production)
NODE_ENV=development

# OPENAI_API_KEY - Your OpenAI API key (REQUIRED)
OPENAI_API_KEY=sk-...

# QURAN_API_URL - Quran API endpoint (default: https://api.alquran.cloud/v1)
QURAN_API_URL=https://api.alquran.cloud/v1

# HADITH_API_URL - Hadith API endpoint (default: https://hadithapi.com/api)
HADITH_API_URL=https://hadithapi.com/api

# AI Model configuration
AI_MODEL=gpt-3.5-turbo
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=2000
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'axios'"
**Solution**: Run `npm install` in the backend_node directory

### Issue: "OPENAI_API_KEY not found"
**Solution**: Create `.env` file in backend_node and add your OpenAI API key

### Issue: "Port 3000 is already in use"
**Solution**: 
```bash
# Use different port
PORT=3001 npm start

# Or find and kill process using port 3000
lsof -i :3000  # List process
kill -9 <PID>  # Kill it
```

### Issue: "Mobile app can't connect to backend"
**Checklist**:
- [ ] Phone and computer on same WiFi network
- [ ] Computer IP is correct in EXPO_PUBLIC_BACKEND_URL
- [ ] Backend server is running
- [ ] Firewall allows incoming connections on port 3000
- [ ] Try: `curl http://YOUR_IP:3000/health` from phone browser first

### Issue: OpenAI API returns 401 error
**Solution**: Check your API key:
- Valid key format: starts with `sk-`
- Has sufficient credits/quota
- Not expired or disabled

### Issue: Rate limiting errors from Alquran.cloud
**Solution**: The free API has rate limits. The backend caches results to minimize requests.
- Surah data cached for 24 hours
- Editions cached for 24 hours
- Use caching headers to avoid repeated calls

---

## 📊 API Status Monitoring

All endpoints return proper HTTP status codes:

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | Success | Verse found |
| 400 | Client error | Invalid input |
| 401 | Unauthorized | Invalid OpenAI key |
| 404 | Not found | Surah doesn't exist |
| 429 | Rate limited | Too many requests |
| 500 | Server error | Backend crash |
| 503 | Service unavailable | API down |

---

## 🚀 Production Deployment

### For Production:

1. **Set environment:**
   ```bash
   NODE_ENV=production
   ```

2. **Configure OPENAI_API_KEY** with your production key

3. **Run server:**
   ```bash
   npm start
   ```

4. **Monitor logs:**
   - Error responses will NOT show stack traces
   - Only essential error info is logged
   - Performance metrics are tracked

### Behind Reverse Proxy:

If using nginx/Apache:

```nginx
# nginx example
location / {
  proxy_pass http://localhost:3000;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## 📈 Performance Tips

1. **Caching**: The backend automatically caches:
   - Quran Surahs list (24 hours)
   - Quran editions (24 hours)
   - Hadith collections (24 hours)

2. **Connection Pooling**: Axios reuses HTTP connections by default

3. **Rate Limiting**: 
   - Implement rate limiting at reverse proxy level
   - Use validator's `checkRateLimit()` for per-client limits

4. **Monitoring**:
   - Watch server logs for error rates
   - Monitor API response times
   - Alert on 5xx errors

---

## 🔒 Security Checklist

- ✅ API keys stored in `.env` (never in code)
- ✅ Input validation on all endpoints
- ✅ Error messages sanitized in production
- ✅ CORS properly configured
- ✅ Timeout protection on external API calls
- ✅ Rate limiting ready to implement

---

## 📚 API Documentation

For detailed endpoint documentation, see:
- `API_ENDPOINTS.md` - Complete endpoint reference
- `REFACTORING_COMPLETE.md` - Production readiness report

---

## ❓ Questions?

Check logs for detailed error messages:

```bash
# Real-time logs (development)
npm run dev

# Shows:
# [2024-01-15T10:30:00.000Z] POST /api/ai/ask - 200 245ms
# [2024-01-15T10:30:01.000Z] GET /api/quran/search - 200 156ms
```

---

## ✨ You're All Set!

Your production-ready Islamic AI backend is running. Start building amazing features! 🎉

**Next Steps**:
1. ✅ Backend is running (you're here!)
2. ⏭️ Connect mobile Expo app
3. ⏭️ Run integration tests
4. ⏭️ Deploy to staging
5. ⏭️ Production launch

---

**Happy coding!** 🚀
