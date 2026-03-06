# EXPO APP INTEGRATION GUIDE

This guide explains how to connect your React Native Expo app to the Islamic AI backend.

## 📱 Prerequisites

- Backend running on local network: `http://192.168.1.X:3000`
- Expo app on same WiFi network as backend server
- Axios package installed in your Expo app

## 🔧 Step 1: Install Axios

In your Expo app directory:

```bash
npx expo install axios
```

## 📝 Step 2: Create Environment Configuration

### Create `.env` file in app root

```bash
EXPO_PUBLIC_BACKEND_URL=http://192.168.1.100:3000
```

Replace `192.168.1.100` with your actual computer IP address.

### Update `app.json`

Make sure your app is configured for Expo:

```json
{
  "expo": {
    "name": "Islamic AI App",
    "slug": "islamic-ai-app",
    "scheme": "myapp",
    "platforms": ["ios", "android", "web"],
    "plugins": []
  }
}
```

## 🛠️ Step 3: Create API Service

Create file: `services/api.ts` (or `.js`)

```typescript
import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor
    this.api.interceptors.request.use(
      async (config) => {
        // You can add authentication token here later
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized
        }
        return Promise.reject(error);
      }
    );
  }

  // ==================== QURAN ====================

  searchQuran(query: string, language = 'en') {
    return this.api.get('/api/quran/search', {
      params: { query, language },
    });
  }

  getSurah(surahId: number, language = 'en') {
    return this.api.get(`/api/quran/surah/${surahId}`, {
      params: { language },
    });
  }

  getVerse(surahId: number, verseId: number, language = 'en') {
    return this.api.get(`/api/quran/verse/${surahId}/${verseId}`, {
      params: { language },
    });
  }

  getAllSurahs() {
    return this.api.get('/api/quran/surahs');
  }

  getSupportedEditions() {
    return this.api.get('/api/quran/editions');
  }

  // ==================== AI SCHOLAR ====================

  askScholar(question: string, scholar = 'academic') {
    return this.api.post('/api/ai/ask', {
      question,
      scholar,
    });
  }

  getAvailableScholars() {
    return this.api.get('/api/ai/scholars');
  }

  processBatchQuestions(questions: Array<{ question: string; scholar?: string }>) {
    return this.api.post('/api/ai/batch', { questions });
  }

  // ==================== HADITH ====================

  searchHadith(query: string, collection?: string) {
    return this.api.get('/api/hadith/search', {
      params: { query, collection },
    });
  }

  getHadith(hadithId: string) {
    return this.api.get(`/api/hadith/${hadithId}`);
  }

  getHadithCollections() {
    return this.api.get('/api/hadith/collections');
  }

  searchHadithByTheme(theme: string) {
    return this.api.get(`/api/hadith/theme/${theme}`);
  }

  // ==================== USER ====================

  getUserProfile() {
    return this.api.get('/api/user/profile');
  }

  getUserSettings() {
    return this.api.get('/api/user/settings');
  }

  updateUserSettings(settings: any) {
    return this.api.put('/api/user/settings', settings);
  }

  getUserFavorites() {
    return this.api.get('/api/user/favorites');
  }

  addFavorite(favorite: any) {
    return this.api.post('/api/user/favorites', favorite);
  }

  getUserStats() {
    return this.api.get('/api/user/stats');
  }

  // ==================== UTILITY ====================

  checkHealth() {
    return this.api.get('/health');
  }
}

export default new ApiService();
```

## 💾 Step 4: Create a Hook for API Calls

Create file: `hooks/useApi.ts`

```typescript
import { useState, useCallback } from 'react';
import api from '../services/api';

export function useApi<T>(
  apiCall: () => Promise<any>,
  immediate = true
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall();
      setData(response.data.data);
    } catch (err: any) {
      const message = err.response?.data?.error?.message || err.message;
      setError(message);
      console.error('API Error:', message);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  React.useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, execute };
}
```

## 📱 Step 5: Use in Your Components

### Example: Quran Screen

```typescript
import { View, Text, FlatList, TextInput } from 'react-native';
import { useState } from 'react';
import api from '../services/api';
import { useApi } from '../hooks/useApi';

export function QuranScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [verses, setVerses] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await api.searchQuran(searchQuery);
      setVerses(response.data.data.results);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="Search Quran..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        style={{
          borderBottomWidth: 1,
          paddingVertical: 8,
          marginBottom: 16,
        }}
      />

      <FlatList
        data={verses}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 12, padding: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>
              Surah {item.surah}, Verse {item.ayah}
            </Text>
            <Text>{item.text}</Text>
            <Text style={{ marginTop: 4, color: '#666' }}>
              {item.translation}
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => `${item.surah}-${item.ayah}-${index}`}
      />
    </View>
  );
}
```

### Example: AI Scholar Screen

```typescript
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import api from '../services/api';

export function AiChatScreen() {
  const [question, setQuestion] = useState('');
  const [scholar, setScholar] = useState('academic');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      const response = await api.askScholar(question, scholar);
      setAnswer(response.data.data.answer);
    } catch (error) {
      console.error('Error:', error);
      setAnswer('Error getting response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {/* Scholar Selector */}
      <Text style={{ marginBottom: 8, fontWeight: 'bold' }}>Choose Scholar:</Text>
      <View style={{ marginBottom: 16 }}>
        {['hanafi', 'shafii', 'diyanet', 'academic'].map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setScholar(s)}
            style={{
              padding: 10,
              backgroundColor: scholar === s ? '#007AFF' : '#ddd',
              borderRadius: 8,
              marginBottom: 8,
            }}
          >
            <Text style={{ color: scholar === s ? 'white' : 'black' }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Question Input */}
      <TextInput
        placeholder="Ask a question about Islam..."
        value={question}
        onChangeText={setQuestion}
        multiline
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          minHeight: 80,
          marginBottom: 12,
        }}
      />

      {/* Ask Button */}
      <TouchableOpacity
        onPress={handleAsk}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#ccc' : '#007AFF',
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          {loading ? 'Loading...' : 'Ask Scholar'}
        </Text>
      </TouchableOpacity>

      {/* Answer Display */}
      {answer && (
        <View style={{ padding: 12, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Response:</Text>
          <Text>{answer}</Text>
        </View>
      )}
    </ScrollView>
  );
}
```

## 🔌 Step 6: Find Your Computer's IP

### Before Running Your App

**macOS/Linux:**
```bash
ipconfig getifaddr en0
# Output: 192.168.1.100
```

**Windows:**
```bash
ipconfig
# Look for "IPv4 Address" under your WiFi adapter
# Example: 192.168.1.100
```

### Update `.env` File

```bash
EXPO_PUBLIC_BACKEND_URL=http://192.168.1.100:3000
```

## ✅ Step 7: Test Connection

### Run Your Expo App

```bash
npx expo start
```

### On Your Device

1. **iOS:** Scan QR code with Camera app
2. **Android:** Scan QR code with Expo app
3. **Web:** Press `w` in terminal

### Verify Connection

In your app's first screen, add a health check:

```typescript
import { useEffect } from 'react';
import api from './services/api';

export default function App() {
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await api.checkHealth();
        console.log('✅ Backend connected:', response.data);
      } catch (error) {
        console.error('❌ Backend connection failed:', error.message);
      }
    };

    checkBackend();
  }, []);

  return (
    // Your app UI
  );
}
```

## 🔧 Troubleshooting

### Issue: "Cannot connect to backend"

**Solution:**
1. Check both devices on same WiFi
2. Verify computer IP is correct
3. Check backend is running: `npm start`
4. Check firewall allows port 3000
5. Test with: `curl http://YOUR_IP:3000/health`

### Issue: "Backend URL is undefined"

**Solution:**
1. Make sure `.env` file exists
2. Reload Expo: Press `r` in terminal or `Cmd+R` on device
3. Verify EXPO_PUBLIC prefix is used

### Issue: "CORS error"

**Solution:**
1. Backend has CORS enabled by default
2. Restart backend server
3. Clear Expo cache: `npx expo start -c`

### Issue: "Request timeout"

**Solution:**
1. Increase timeout in API service (currently 15s)
2. Check network connection
3. Check backend server logs

## 📚 Full Example Repository Structure

```
expo-app/
├── app/
│   ├── (tabs)/
│   │   ├── quran.tsx
│   │   ├── ai-chat.tsx
│   │   └── hadith.tsx
│   └── index.tsx
├── services/
│   └── api.ts
├── hooks/
│   └── useApi.ts
├── contexts/
│   └── AppContext.tsx
├── .env
├── app.json
├── package.json
└── tsconfig.json
```

## 🚀 Production Deployment

When deploying to production:

1. Update backend to production server URL
2. Use HTTPS instead of HTTP
3. Update `.env` file:
   ```bash
   EXPO_PUBLIC_BACKEND_URL=https://api.yourdomain.com
   ```
4. Build production app:
   ```bash
   eas build --platform ios --auto-submit
   eas build --platform android
   ```

## 📖 Additional Resources

- [Expo Documentation](https://docs.expo.dev)
- [Axios Documentation](https://axios-http.com)
- [React Native API](https://reactnative.dev/docs/api)

## 🎉 You're Ready!

Your Expo app is now connected to the Islamic AI backend. Start building amazing features!

For questions, check:
- `README.md` - Backend overview
- `API_REFERENCE.md` - All available endpoints
- `SETUP.md` - Backend setup guide
