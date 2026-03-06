# SETUP & DEPLOYMENT GUIDE

## 📖 Complete Setup Instructions

### Prerequisites

- Node.js v14+ installed
- npm v6+ installed
- Git (optional, for version control)
- Your computer's IP address on WiFi network

## 🚀 Installation Steps

### Step 1: Navigate to Backend Directory

```bash
cd backend_node
```

### Step 2: Install Dependencies

```bash
npm install
```

Expected output:
```
added 50 packages in 2.5s
```

### Step 3: Create Environment File

```bash
cp .env.example .env
```

### Step 4: Configure Environment

Edit `.env` file with your settings:

```bash
# For macOS/Linux
nano .env

# For Windows
notepad .env
```

Update these values:

```bash
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=sk-... (leave empty for now)
```

### Step 5: Find Your Computer's IP Address

**macOS/Linux:**
```bash
ipconfig getifaddr en0
```

**Windows:**
```bash
ipconfig
```

Look for IPv4 Address (example: `192.168.1.100`)

### Step 6: Start the Server

```bash
npm start
```

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
```

### Step 7: Configure Your Expo App

In your React Native Expo app, create/edit `.env` file:

```bash
EXPO_PUBLIC_BACKEND_URL=http://192.168.1.100:3000
```

Replace `192.168.1.100` with your actual computer IP.

### Step 8: Test Connection

**From Desktop (same computer as server):**
```bash
curl http://localhost:3000/health
```

**From Mobile (on same WiFi):**
1. Get your computer's IP: `192.168.1.100`
2. In browser on phone: `http://192.168.1.100:3000`
3. Or test from Expo app using environment variable

## ✅ Verify Setup

### Test 1: Health Check

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "healthy",
  "uptime": 5.234,
  "memory": {...},
  "timestamp": "2024-03-06T10:30:00.000Z"
}
```

### Test 2: Quran Search

```bash
curl "http://localhost:3000/api/quran/search?query=allah"
```

### Test 3: AI Scholar

```bash
curl -X POST http://localhost:3000/api/ai/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is prayer?",
    "scholar": "hanafi"
  }'
```

### Test 4: From Expo App

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL
});

// Test connection
api.get('/health')
  .then(res => console.log('Connected!', res.data))
  .catch(err => console.log('Error:', err.message));
```

## 🔧 Development Workflow

### Auto-Reload on Changes

Install nodemon for development:

```bash
npm install --save-dev nodemon
```

Then run:

```bash
npm run dev
```

Server will auto-restart when you change files.

### File Structure for Development

```
backend_node/
├── server.js              # Main file - import new routes here
├── routes/                # Add new routes
├── services/              # Add business logic
├── controllers/           # Add request handlers
├── middleware/            # Add middleware
└── utils/                 # Add utilities
```

### Adding New Endpoints

1. **Create controller** in `controllers/newFeature.js`
2. **Create route** in `routes/newFeature.js`
3. **Import in server.js:**
   ```javascript
   const newFeatureRoutes = require('./routes/newFeature');
   app.use('/api/newfeature', newFeatureRoutes);
   ```

## 🌍 Deploy to Production

### Option 1: Heroku (Free Tier)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create islamic-ai-backend

# Set environment variable
heroku config:set OPENAI_API_KEY=your_key

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

Access at: `https://islamic-ai-backend.herokuapp.com`

### Option 2: DigitalOcean ($5/month)

```bash
# SSH into droplet
ssh root@your.droplet.ip

# Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone your-repo-url
cd backend_node

# Install dependencies
npm install

# Install PM2 (process manager)
npm install -g pm2

# Start server
pm2 start server.js --name islamic-api

# Save PM2 config
pm2 save

# Auto-start on reboot
pm2 startup
```

Access at: `http://your.droplet.ip:3000`

### Option 3: AWS EC2

```bash
# SSH into instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Clone and setup
git clone your-repo-url
cd backend_node
npm install

# Install Nginx as reverse proxy
sudo yum install -y nginx
sudo systemctl start nginx

# Configure Nginx to forward to port 3000
# (Configure /etc/nginx/nginx.conf)

# Start backend
npm start
```

### Option 4: Local Machine (Permanent Server)

Keep your computer running and use:

```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start server.js --name islamic-api

# Make it start on computer restart
pm2 startup
pm2 save

# View running processes
pm2 list

# View logs
pm2 logs islamic-api
```

## 🔒 Security Checklist

- [ ] Set strong `OPENAI_API_KEY`
- [ ] Use HTTPS in production
- [ ] Set `NODE_ENV=production` on server
- [ ] Configure firewall to allow port 3000
- [ ] Use environment variables (never commit secrets)
- [ ] Enable CORS only for your frontend domain
- [ ] Add rate limiting for production
- [ ] Monitor server logs regularly

## 📊 Monitoring

### Check Server Status

```bash
# View uptime
pm2 status

# View real-time logs
pm2 logs islamic-api

# View memory usage
pm2 monit
```

### Check Port Availability

```bash
# List processes using port 3000
lsof -i :3000

# Kill process on port 3000
kill -9 <PID>
```

## 🐛 Troubleshooting

### Problem: "Port 3000 already in use"

```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>

# Or change port in .env
PORT=3001
```

### Problem: "Cannot connect from mobile"

1. Check phone is on same WiFi as computer
2. Check computer IP address is correct
3. Check firewall allows port 3000
4. Check `.env` file is properly configured

```bash
# Test connection from command line
ping your-computer-ip
curl http://your-computer-ip:3000/health
```

### Problem: "CORS error in Expo app"

CORS should be configured automatically. If issues persist:

1. Check your frontend URL in `.env`
2. Restart backend server
3. Clear Expo cache: `expo start -c`

### Problem: "Cannot read environment variables"

Make sure `.env` file exists in root directory:

```bash
# Verify .env exists
ls -la | grep .env

# Verify contents
cat .env

# Reinstall dotenv
npm install dotenv
```

## 📞 Getting Help

### Debug Mode

Enable debug logging:

```bash
# macOS/Linux
DEBUG=* npm start

# Windows
set DEBUG=*
npm start
```

### Check Logs

```bash
# View server logs
tail -f logs/server.log

# Filter for errors
grep ERROR logs/server.log
```

### Test API

Use Postman or Insomnia to test endpoints:
1. Download [Postman](https://www.postman.com)
2. Create new request
3. Set URL: `http://localhost:3000/api/quran/search`
4. Add query: `query=allah`
5. Send request

## ✨ Next Steps

1. ✅ Backend is running
2. 👉 Configure your Expo frontend with backend URL
3. Start building amazing features!

## 📚 Useful Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# Install new package
npm install package-name

# Update packages
npm update

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

**Congratulations! Your backend is ready to serve your Islamic AI application.** 🎉

For more help, check the main README.md file.
