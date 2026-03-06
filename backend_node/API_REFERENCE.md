# API QUICK REFERENCE

## Base URLs

- **Desktop:** `http://localhost:3000`
- **Mobile:** `http://192.168.1.X:3000`

## Response Format

All responses follow this format:

```json
{
  "status": "success|error",
  "data": { /* response data */ },
  "error": { /* error details if status is error */ }
}
```

## ================================
## QURAN API
## ================================

### 1. Search Verses

**Endpoint:** `GET /api/quran/search?query=word&language=en`

**Query Parameters:**
- `query` (required): Search term
- `language` (optional): en, ar, tr, ur, es, fr (default: en)

**Example:**
```
GET /api/quran/search?query=prayer&language=en
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "query": "prayer",
    "results": [
      {
        "surah": 2,
        "ayah": 238,
        "text": "...",
        "translation": "..."
      }
    ]
  }
}
```

### 2. Get Full Surah

**Endpoint:** `GET /api/quran/surah/:id?language=en`

**Path Parameters:**
- `id` (required): Surah number 1-114

**Example:**
```
GET /api/quran/surah/1
GET /api/quran/surah/2?language=ar
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "surah": 1,
    "name": "الفاتحة",
    "englishName": "Al-Fatiha",
    "numberOfAyahs": 7,
    "revelationType": "Meccan",
    "verses": [...]
  }
}
```

### 3. Get Single Verse

**Endpoint:** `GET /api/quran/verse/:surah/:verse?language=en`

**Path Parameters:**
- `surah` (required): Surah number
- `verse` (required): Verse number

**Example:**
```
GET /api/quran/verse/1/1
GET /api/quran/verse/2/255?language=tr
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "surah": 1,
    "surahName": "Al-Fatiha",
    "verse": 1,
    "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
  }
}
```

### 4. Get All Surahs Metadata

**Endpoint:** `GET /api/quran/surahs`

**Response:**
```json
{
  "status": "success",
  "count": 114,
  "data": [
    {
      "number": 1,
      "name": "الفاتحة",
      "englishName": "Al-Fatiha",
      "numberOfAyahs": 7,
      "revelationType": "Meccan"
    }
  ]
}
```

### 5. Get Supported Languages

**Endpoint:** `GET /api/quran/editions`

**Response:**
```json
{
  "status": "success",
  "data": {
    "ar": { "name": "Arabic", "edition": "quran-uthmani" },
    "en": { "name": "English", "edition": "en.asad" },
    "tr": { "name": "Turkish", "edition": "tr.diyanet" }
  }
}
```

---

## ================================
## AI SCHOLAR SYSTEM
## ================================

### 1. Ask Scholar a Question

**Endpoint:** `POST /api/ai/ask`

**Request Body:**
```json
{
  "question": "How is travel prayer performed?",
  "scholar": "hanafi"
}
```

**Scholar Options:**
- `hanafi` - Hanafi School
- `shafii` - Shafi'i School
- `diyanet` - Turkish Islamic Authority
- `taberi` - Al-Taberi (Classical Tafsir)
- `ibn_kathir` - Ibn Kathir (Classical Tafsir)
- `academic` - Academic Islamic Studies

**Response:**
```json
{
  "status": "success",
  "data": {
    "scholar": "hanafi",
    "scholarName": "Hanafi School",
    "answer": "According to the Hanafi school of Islamic jurisprudence...",
    "methodology": "logical_reasoning",
    "timestamp": "2024-03-06T10:30:00Z"
  }
}
```

### 2. Get Available Scholars

**Endpoint:** `GET /api/ai/scholars`

**Response:**
```json
{
  "status": "success",
  "count": 6,
  "data": [
    {
      "id": "hanafi",
      "name": "Hanafi School",
      "description": "Emphasizes logical reasoning in Islamic law"
    }
  ]
}
```

### 3. Batch Ask Questions

**Endpoint:** `POST /api/ai/batch`

**Request Body:**
```json
{
  "questions": [
    { "question": "What is wudu?", "scholar": "hanafi" },
    { "question": "What is salah?", "scholar": "academic" }
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "count": 2,
    "responses": [...]
  }
}
```

---

## ================================
## HADITH API
## ================================

### 1. Search Hadith

**Endpoint:** `GET /api/hadith/search?query=prayer&collection=bukhari`

**Query Parameters:**
- `query` (required): Search term
- `collection` (optional): bukhari, muslim, etc.

**Response:**
```json
{
  "status": "success",
  "data": {
    "query": "prayer",
    "results": [
      {
        "id": "bukhari_1_1",
        "collection": "Sahih Bukhari",
        "text": "..."
      }
    ]
  }
}
```

### 2. Get Hadith by ID

**Endpoint:** `GET /api/hadith/:id`

**Example:**
```
GET /api/hadith/bukhari_1_1
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "bukhari_1_1",
    "collection": "Sahih Al-Bukhari",
    "hadithNumber": 1,
    "englishText": "Actions are according to intentions...",
    "grading": "Sahih (Authentic)"
  }
}
```

### 3. Get Collections

**Endpoint:** `GET /api/hadith/collections`

**Response:**
```json
{
  "status": "success",
  "count": 6,
  "data": [
    {
      "id": "bukhari",
      "name": "Sahih Al-Bukhari",
      "author": "Muhammad ibn Ismail Al-Bukhari",
      "hadiths": 7563,
      "grading": "Most Authentic (Sahih)"
    }
  ]
}
```

### 4. Search by Theme

**Endpoint:** `GET /api/hadith/theme/:theme`

**Example:**
```
GET /api/hadith/theme/prayer
GET /api/hadith/theme/fasting
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "theme": "prayer",
    "results": [...]
  }
}
```

---

## ================================
## USER MANAGEMENT
## ================================

### 1. Get Profile

**Endpoint:** `GET /api/user/profile`

### 2. Get Settings

**Endpoint:** `GET /api/user/settings`

### 3. Update Settings

**Endpoint:** `PUT /api/user/settings`

**Body:**
```json
{
  "language": "en",
  "theme": "dark",
  "scholar_preference": "hanafi"
}
```

### 4. Get Favorites

**Endpoint:** `GET /api/user/favorites`

### 5. Add Favorite

**Endpoint:** `POST /api/user/favorites`

**Body:**
```json
{
  "type": "surah",
  "id": 1
}
```

### 6. Get Statistics

**Endpoint:** `GET /api/user/stats`

---

## ================================
## ERROR RESPONSES
## ================================

### 400 - Bad Request

```json
{
  "error": {
    "status": 400,
    "message": "Search query is required",
    "timestamp": "2024-03-06T10:30:00Z"
  }
}
```

### 404 - Not Found

```json
{
  "error": "Endpoint not found",
  "path": "/api/invalid/path",
  "method": "GET"
}
```

### 500 - Server Error

```json
{
  "error": {
    "status": 500,
    "message": "Internal Server Error",
    "timestamp": "2024-03-06T10:30:00Z"
  }
}
```

---

## ================================
## cURL EXAMPLES
## ================================

### Search Quran
```bash
curl "http://localhost:3000/api/quran/search?query=allah"
```

### Get Surah
```bash
curl http://localhost:3000/api/quran/surah/1
```

### Ask Scholar
```bash
curl -X POST http://localhost:3000/api/ai/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is prayer?",
    "scholar": "hanafi"
  }'
```

### Search Hadith
```bash
curl "http://localhost:3000/api/hadith/search?query=prayer"
```

### Health Check
```bash
curl http://localhost:3000/health
```

---

## ================================
## JAVASCRIPT/AXIOS EXAMPLES
## ================================

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000'
});

// Search Quran
const searchQuran = (query) => 
  api.get('/api/quran/search', { params: { query } });

// Get Surah
const getSurah = (surahId) => 
  api.get(`/api/quran/surah/${surahId}`);

// Get Verse
const getVerse = (surahId, verseId) => 
  api.get(`/api/quran/verse/${surahId}/${verseId}`);

// Ask Scholar
const askScholar = (question, scholar) => 
  api.post('/api/ai/ask', { question, scholar });

// Get Scholars
const getScholars = () => 
  api.get('/api/ai/scholars');

// Search Hadith
const searchHadith = (query) => 
  api.get('/api/hadith/search', { params: { query } });

// Get Hadith
const getHadith = (hadithId) => 
  api.get(`/api/hadith/${hadithId}`);

// Usage
searchQuran('prayer').then(res => console.log(res.data));
```

---

## ================================
## REACT NATIVE EXPO SETUP
## ================================

### Install Axios

```bash
npx expo install axios
```

### Create API Client

```javascript
// services/api.js
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
```

### Use in Components

```javascript
import { useEffect, useState } from 'react';
import api from '../services/api';

export function QuranScreen() {
  const [verses, setVerses] = useState([]);
  
  useEffect(() => {
    const searchQuran = async () => {
      try {
        const response = await api.get('/api/quran/search', {
          params: { query: 'allah' }
        });
        setVerses(response.data.data.results);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    searchQuran();
  }, []);
  
  return (
    // Render verses
  );
}
```

---

**For more details, see README.md and SETUP.md files.**
