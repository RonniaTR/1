# 🚀 Git LFS Kurulum Rehberi - Adım Adım Komutlar

## 📋 İçindekiler
1. [Ön Koşullar](#ön-koşullar)
2. [Kurulum Adımları](#kurulum-adımları)
3. [Sorun Giderme](#sorun-giderme)
4. [Sıkça Sorulan Sorular](#sıkça-sorulan-sorular)

---

## 🔍 Ön Koşullar

### Git LFS Kurulu mu?
```bash
git lfs --version
```

**Eğer kurulu değilse:**

**macOS (Homebrew):**
```bash
brew install git-lfs
```

**Ubuntu/Debian:**
```bash
sudo apt-get install git-lfs
```

**Windows:**
- https://github.com/git-lfs/git-lfs/releases adresinden indir ve kur
- Veya: `choco install git-lfs` (Chocolatey kullanıyorsanız)

---

## 🛠️ Kurulum Adımları

### ADIM 1: Git LFS'i Sisteme Entegre Et

```bash
git lfs install
```

**Çıktı:**
```
Git LFS initialized.
```

---

### ADIM 2: Proje Dizinine Git

```bash
cd /Users/sametdurak/Desktop/1-main
```

---

### ADIM 3: Git Repository'sini Başlat (Eğer Yoksa)

```bash
# Kontrol et
ls -la | grep ".git"

# Yoksa oluştur
git init
```

---

### ADIM 4: .gitattributes Dosyasını Oluştur

```bash
# .gitattributes dosyasını oluştur
cat > .gitattributes << 'EOF'
# Git LFS Configuration
main filter=lfs diff=lfs merge=lfs -text
*.zip filter=lfs diff=lfs merge=lfs -text
*.tar.gz filter=lfs diff=lfs merge=lfs -text
*.iso filter=lfs diff=lfs merge=lfs -text
*.mp4 filter=lfs diff=lfs merge=lfs -text
*.mov filter=lfs diff=lfs merge=lfs -text
*.mkv filter=lfs diff=lfs merge=lfs -text
*.mp3 filter=lfs diff=lfs merge=lfs -text
*.wav filter=lfs diff=lfs merge=lfs -text
*.model filter=lfs diff=lfs merge=lfs -text
*.pkl filter=lfs diff=lfs merge=lfs -text
*.h5 filter=lfs diff=lfs merge=lfs -text
*.db filter=lfs diff=lfs merge=lfs -text
*.sqlite filter=lfs diff=lfs merge=lfs -text
data/*.json filter=lfs diff=lfs merge=lfs -text
quran_data/*.json filter=lfs diff=lfs merge=lfs -text

# Kod dosyaları (normal Git)
backend_node/**/*.js -filter -diff -merge
backend_node/**/*.json -filter -diff -merge
frontend/**/*.tsx -filter -diff -merge
frontend/**/*.ts -filter -diff -merge

# Metin dosyaları
*.md text eol=lf
*.yml text eol=lf
*.yaml text eol=lf
EOF
```

---

### ADIM 5: 'main' Dosyasını LFS Takibine Al

```bash
# 'main' dosyasının boyutunu kontrol et
ls -lh main

# LFS takibine al
git lfs track "main"

# Doğrula
git lfs ls-files
```

**Beklenen Çıktı:**
```
main (filter=lfs diff=lfs merge=lfs -text)
```

---

### ADIM 6: .gitignore Dosyasını Oluştur

```bash
cat > .gitignore << 'EOF'
# Backend
backend_node/node_modules/
backend_node/npm-debug.log*
backend_node/.env
backend_node/.env.local

# Frontend
frontend/node_modules/
frontend/.expo/
frontend/dist/

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes

# IDE
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log
logs/

# Memory
memory/
*.mem
EOF
```

---

### ADIM 7: Tüm Dosyaları Staging Area'ya Ekle

```bash
# .gitattributes dosyasını ekle
git add .gitattributes

# Backend dosyalarını ekle
git add backend_node/

# .gitignore ekle
git add .gitignore

# Dokümantasyon dosyalarını ekle
git add QUICK_START.md REFACTORING_COMPLETE.md README.md

# Staging durumunu kontrol et
git status
```

---

### ADIM 8: Commit Yap

```bash
git commit -m "Initial commit: Production-ready Islamic AI backend with Git LFS

Includes:
- Full backend implementation with real API integrations
- OpenAI ChatGPT integration
- Alquran.cloud API integration
- Hadith API integration
- Comprehensive input validation and error handling
- Git LFS for large files (main file 200MB+)

Production Readiness: 90%"
```

---

### ADIM 9: HTTP Post Buffer'ı Ayarla (ÖNEMLİ!)

Bu adım, 200MB+ dosyaları push ederken "RPC failed" hatası almamak için **çok önemlidir**.

```bash
# 500MB buffer (200MB dosya için)
git config http.postBuffer 524288000

# Doğrula
git config http.postBuffer
```

**Beklenen Çıktı:**
```
524288000
```

---

### ADIM 10: Timeout Ayarlarını Yapılandır

```bash
# Düşük hız limitini devre dışı bırak
git config http.lowSpeedLimit 0

# Timeout'u artır (999999 saniye = 11 gün!)
git config http.lowSpeedTime 999999

# Doğrula
git config --list | grep http
```

---

### ADIM 11: Remote Repository'sini Ayarla

**Eğer remote henüz ayarlanmamışsa:**

```bash
# HTTPS (önerilen başlamak için)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# VEYA SSH (daha hızlı, setup gerekir)
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git

# Doğrula
git remote -v
```

**Eğer remote zaten ayarlanmışsa:**

```bash
# Mevcut remote'yi görüntüle
git remote -v

# Değiştirmek için
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

---

### ADIM 12: Branch'ı Ayarla

```bash
# Main branch'a geç (veya oluştur)
git branch -M main

# Doğrula
git branch
```

---

### ADIM 13: Push Et

```bash
# İlk push (upstream'i ayarla)
git push -u origin main

# Veya daha hızlı push için LFS optimization
GIT_CURL_VERBOSE=0 git push -u origin main
```

**VEYA başarısız olursa retry ile:**

```bash
git push -u origin main --verbose
```

---

## 📊 Durumu Kontrol Et

### Git LFS Status

```bash
# LFS tarafından takip edilen dosyaları göster
git lfs ls-files

# LFS environment bilgisi
git lfs env

# LFS cache boyutu
du -sh .git/lfs/objects
```

### Push Status

```bash
# Henüz push edilmeyen commits
git log origin/main..main

# Beklemede olan değişiklikler
git status
```

---

## ⚠️ Sorun Giderme

### Problem 1: "RPC failed: HTTP 413"

**Sebep:** Upload buffer çok küçük

**Çözüm:**
```bash
# Buffer'ı 500MB'a çıkar
git config http.postBuffer 524288000

# Veya 1GB'a çıkar (çok büyük dosyalar için)
git config http.postBuffer 1073741824
```

---

### Problem 2: "fatal: unable to access" SSL hatası

**Sebep:** SSL sertifikası doğrulaması sorunu

**Çözüm (geçici):**
```bash
git config http.sslVerify false
```

**Veya SSH kullan:**
```bash
git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

### Problem 3: "Transfer timed out"

**Sebep:** İnternet bağlantısı koptu veya çok yavaş

**Çözüm:**
```bash
# Timeout'u artır
git config http.lowSpeedLimit 0
git config http.lowSpeedTime 999999

# Tekrar push et
git push -u origin main
```

---

### Problem 4: LFS dosyası iki kez upload ediliyor

**Sebep:** .gitattributes dosyası commit'ten sonra değiştirildi

**Çözüm:**
```bash
# 'main' dosyasını LFS'den kaldır
git lfs untrack "main"

# .gitattributes dosyasını sıfırla
git checkout .gitattributes

# Tekrar ekle
git lfs track "main"
git add .gitattributes

# Yeni commit yap
git commit -m "Fix: Re-add main to LFS tracking"
git push -u origin main
```

---

### Problem 5: "main dosyası çok büyük" uyarısı

**Sebep:** Git henüz LFS tracking'i tanımamış

**Çözüm:**
```bash
# Git cache'i temizle
rm -rf .git/objects/pack/*

# LFS kurulumunu tekrar yap
git lfs install --force

# Tekrar push et
git push -u origin main
```

---

## 🚀 Hızlı Referans - Tüm Komutlar

```bash
# 1. LFS Kurulumu
git lfs install

# 2. Proje dizinine git
cd /Users/sametdurak/Desktop/1-main

# 3. .gitattributes oluştur (yukarıda verilen cat komutu)

# 4. LFS tracking'i etkinleştir
git lfs track "main"

# 5. Staging area'ya ekle
git add .gitattributes backend_node/ .gitignore QUICK_START.md REFACTORING_COMPLETE.md README.md

# 6. Commit yap
git commit -m "Initial commit: Production-ready Islamic AI backend with Git LFS"

# 7. HTTP ayarlarını yapılandır
git config http.postBuffer 524288000
git config http.lowSpeedLimit 0
git config http.lowSpeedTime 999999

# 8. Remote ayarla
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 9. Branch ayarla
git branch -M main

# 10. Push et
git push -u origin main
```

---

## 📈 Beklenen Zaman Süresi

| Adım | Zaman | Notlar |
|------|-------|--------|
| LFS Kurulumu | 1-2 dakika | Homebrew yavaş olabilir |
| Komut Çalıştırma | 1-2 dakika | Dosyaları staging'e ekleme |
| Commit Yapma | < 1 dakika | Lokal işlem |
| İlk Push | 5-30 dakika | Internet hızına bağlı |

**Toplam**: ~15-40 dakika (internet hızına göre değişir)

---

## 💡 İPUÇLARI

✅ **DO'S:**
- İlk push'dan önce .gitattributes dosyasının doğru olduğundan emin ol
- HTTP buffer'ı 200MB'ın üzerine çıkar
- İnternet bağlantısı güçlüken push et
- Büyük dosyaları LFS'ye taşı, kod dosyalarını Git'te tut

❌ **DON'TS:**
- LFS kurulu olmadan 100MB+ dosyaları push etme
- .gitattributes dosyasını commit'ten sonra değiştirme (sorun yaratabilir)
- Timeout ayarlarını çok düşüğe ayarlama
- HTTP ve SSH'ı aynı anda mix etme

---

## 🎯 Başarı Kriteri

Push tamamlandığında şu görülecektir:

```
Uploading LFS objects: 100% (1/1), 201 MB | 5.2 MB/s
Counting objects: 35, done.
Delta compression using up to 8 threads
Compressing objects: 100% (28/28), done.
Writing objects: 100% (35/35), 201.5 MB | 4.8 MB/s, done.
Total 35 (delta 8), reused 0 (delta 0)
To https://github.com/YOUR_USERNAME/YOUR_REPO.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## 📞 Daha Fazla Yardım

GitHub LFS Dokümantasyon:
https://git-lfs.github.com/

Git LFS Sorun Giderme:
https://github.com/git-lfs/git-lfs/wiki/Troubleshooting

---

## ✨ Başarılar!

Bu rehberi takip ederek 200MB+ dosyalarınızı GitHub'a başarıyla yükleyebilirsiniz. 🚀

**Herhangi bir sorun olursa, terminal çıktısını dikkatle okuyun - genellikle problemin çözümü orada yazıyor!**
