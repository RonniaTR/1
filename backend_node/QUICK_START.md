# 🚀 GETTING STARTED - 5 MINUTE QUICK START

## ⚡ The Fastest Way to Get Running

### Step 1: Open Terminal (30 seconds)

```bash
# Navigate to the project
cd /Users/sametdurak/Desktop/1-main/backend_node

# Or from anywhere:
cd <path-to>/backend_node
```

### Step 2: Install Packages (1-2 minutes)

```bash
npm install
```

You'll see:
```
added 50 packages in 2.5s
```

### Step 3: Configure (30 seconds)

```bash
# Copy environment template
cp .env.example .env

# Open and review (optional)
cat .env
```

Your `.env` is ready to use! ✅

### Step 4: Start Server (30 seconds)

```bash
npm start
```

You'll see:
```
╔════════════════════════════════════════════════════════╗
║     Islamic AI Backend Server - RUNNING                ║
╚════════════════════════════════════════════════════════╝

✓ Server listening on port: 3000
✓ Environment: development

📱 MOBILE CONNECTION:
   Set EXPO_PUBLIC_BACKEND_URL=http://192.168.1.100:3000
```

### Step 5: Test It Works (1 minute)

**In a new terminal:**

```bash
# Health check
curl http://localhost:3000/health

# Search Quran
curl "http://localhost:3000/api/quran/search?query=allah"

# Ask Scholar
curl -X POST http://localhost:3000/api/ai/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"What is prayer?","scholar":"hanafi"}'
```

All working? ✅ **You're done! Backend is running!**

---

## 📱 Connect Your Expo App (2 minutes)

### 1. Find Your Computer's IP

```bash
# macOS/Linux
ipconfig getifaddr en0

# Windows
ipconfig
```

Example output: `192.168.1.100`

### 2. Update Expo App `.env`

In your React Native Expo app directory, create `.env`:

```bash
EXPO_PUBLIC_BACKEND_URL=http://192.168.1.100:3000
```

Replace `192.168.1.100` with your actual IP.

### 3. Use in Your Expo App

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL
});

// Example: Search Quran
const response = await api.get('/api/quran/search', {
  params: { query: 'allah' }
});

console.log(response.data);
```

### 4. Run Your Expo App

```bash
npx expo start
```

Scan QR code on your phone!

---

## 🧪 Quick API Tests

### Copy & Paste These Commands

#### Test 1: Health Check
```bash
curl http://localhost:3000/health
```

#### Test 2: Search Quran
```bash
curl "http://localhost:3000/api/quran/search?query=prayer&language=en"
```

#### Test 3: Get Surah
```bash
curl http://localhost:3000/api/quran/surah/1
```

#### Test 4: Ask AI Scholar
```bash
curl -X POST http://localhost:3000/api/ai/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is fasting?",
    "scholar": "hanafi"
  }'
```

#### Test 5: Search Hadith
```bash
curl "http://localhost:3000/api/hadith/search?query=intention"
```

#### Test 6: Get Scholars
```bash
curl http://localhost:3000/api/ai/scholars
```

---

## 🎯 Key Endpoints to Know

### Quran Search
```
GET http://localhost:3000/api/quran/search?query=allah
```

### AI Scholar
```
POST http://localhost:3000/api/ai/ask
Body: {"question": "...", "scholar": "hanafi"}
```

### Hadith Search
```
GET http://localhost:3000/api/hadith/search?query=prayer
```

### Available Scholars
```
GET http://localhost:3000/api/ai/scholars
```

---

## 🔧 Development Mode with Auto-Reload

```bash
npm run dev
```

Now code changes auto-reload! 🔄

---

## 📚 Read Next

| What You Want | File to Read |
|---|---|
| Full overview | README.md |
| All endpoints | API_REFERENCE.md |
| Setup guide | SETUP.md |
| Mobile integration | EXPO_INTEGRATION.md |
| Project structure | PROJECT_STRUCTURE.md |
| Deployment | DEPLOYMENT_SUMMARY.md |

---

## 🆘 Common Issues

### "Port 3000 already in use"
```bash
# Change port in .env
PORT=3001
```

### "Cannot connect from mobile"
1. Check phone is on same WiFi as computer
2. Check your IP is correct: `ipconfig getifaddr en0`
3. Check firewall allows port 3000

### "CORS error"
1. Restart backend: Kill process and run again
2. Clear Expo cache: `npx expo start -c`

### "Cannot read environment variables"
```bash
# Make sure .env exists
ls -la .env

# If missing, create it
cp .env.example .env
```

---

## 📱 Scholar Options to Try

Try these in your AI requests:

```json
{
  "question": "What is prayer?",
  "scholar": "hanafi"
}
```

Replace `"hanafi"` with:
- `"hanafi"` - Hanafi School
- `"shafii"` - Shafi'i School  
- `"diyanet"` - Turkish Islamic Authority
- `"taberi"` - Classical Tafsir (Al-Taberi)
- `"ibn_kathir"` - Classical Tafsir (Ibn Kathir)
- `"academic"` - Academic Islamic Studies

---

## 🎁 What You Have

✅ Complete REST API
✅ Quran search & verses
✅ AI Scholar system
✅ Hadith database integration points
✅ User management structure
✅ Production-ready code
✅ Comprehensive documentation
✅ Mobile app integration
✅ Multiple deployment options

---

## 🚀 You're All Set!

Your backend is:
- ✅ Running
- ✅ Tested
- ✅ Connected to mobile
- ✅ Ready to deploy

**Start building amazing features!** 🎉

---

## 📞 Need Help?

1. **Installation issues** → See SETUP.md
2. **API questions** → See API_REFERENCE.md
3. **Mobile integration** → See EXPO_INTEGRATION.md
4. **Deployment** → See DEPLOYMENT_SUMMARY.md
5. **Architecture** → See PROJECT_STRUCTURE.md

---

## 💡 Pro Tips

### Tip 1: Use Postman for Testing
Import endpoints and test with nice UI.

### Tip 2: Check Logs
Backend logs show request details for debugging.

### Tip 3: Test Before Mobile
Use cURL/Postman to verify endpoints first.

### Tip 4: Keep Terminal Open
Run backend in one terminal, work in another.

### Tip 5: Bookmark Your IP
You'll use `192.168.1.X:3000` often in development.

---

## 🎓 Learn More

Each file includes detailed comments explaining:
- How things work
- Why they're designed that way
- How to extend them
- Best practices

Explore the code! It's a great learning resource. 📖

---

## ✨ Next: Connect Your App

```typescript
// In your Expo app
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL
});

// Use it!
api.get('/api/quran/search', {
  params: { query: 'prayer' }
}).then(response => {
  console.log(response.data);
});
```

---

**That's it! Your backend is ready to power your Islamic AI app.** 🌙✨

**Happy coding!** 🚀
