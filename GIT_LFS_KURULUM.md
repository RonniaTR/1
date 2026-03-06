# 📚 Git LFS Setup - Eksiksiz Kurulum Rehberi

## 🎯 Hedef

200MB+ büyüklüğündeki `main` dosyasını ve tüm backend kodlarını GitHub'a başarıyla yüklemek.

**GitHub Sınırı**: 100MB (bir dosyada)  
**Sizin Dosya Boyutu**: 200MB  
**Çözüm**: Git LFS (Large File Storage)

---

## ⚡ 5 Dakika - Hızlı Start

### 1. Terminal'i Aç

```bash
cd /Users/sametdurak/Desktop/1-main
```

### 2. Otomatik Setup Script'ini Çalıştır

```bash
bash git-lfs-setup.sh
```

**VEYA Adım Adım Yapacaksanız:**

```bash
# 1. LFS Kurulumu
git lfs install

# 2. Main dosyasını LFS'ye al
git lfs track "main"
git add .gitattributes

# 3. Dosyaları staging'e ekle
git add backend_node/ .gitignore QUICK_START.md REFACTORING_COMPLETE.md README.md

# 4. Commit yap
git commit -m "Initial commit: Production-ready Islamic AI backend with Git LFS"

# 5. HTTP ayarlarını yap
git config http.postBuffer 524288000
git config http.lowSpeedLimit 0
git config http.lowSpeedTime 999999

# 6. Remote ayarla
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main

# 7. Push et
git push -u origin main
```

---

## 📋 Detaylı Adım Adım Kılavuz

### ADIM 1: Git LFS Kurulumu

#### Kontrol Et
```bash
git lfs --version
```

#### Yoksa Kur

**macOS:**
```bash
brew install git-lfs
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install git-lfs
```

**Windows:**
- İndir: https://github.com/git-lfs/git-lfs/releases
- Çalıştır ve kur

---

### ADIM 2: Git LFS'i Sistem Seviyesinde Konfigüre Et

```bash
git lfs install
```

**Çıktı:**
```
Git LFS initialized.
```

---

### ADIM 3: Proje Dizinine Git

```bash
cd /Users/sametdurak/Desktop/1-main
ls -la
```

**Görmesi gereken dosyalar:**
- `main` (200MB+)
- `backend_node/` (dizin)
- `frontend/` (dizin)
- `README.md`

---

### ADIM 4: Git Repository'sini Kontrol Et/Oluştur

```bash
# Kontrol et
ls -la | grep ".git"

# Yoksa oluştur
git init

# User ayarla (ilk kez ise)
git config user.name "Your Name"
git config user.email "your@email.com"
```

---

### ADIM 5: .gitattributes Dosyasını Oluştur

```bash
cat > .gitattributes << 'EOF'
# ================================================
# GIT LFS CONFIGURATION
# ================================================

# 200MB main file
main filter=lfs diff=lfs merge=lfs -text

# Diğer büyük dosya türleri
*.zip filter=lfs diff=lfs merge=lfs -text
*.tar.gz filter=lfs diff=lfs merge=lfs -text
*.iso filter=lfs diff=lfs merge=lfs -text

# Media files
*.mp4 filter=lfs diff=lfs merge=lfs -text
*.mov filter=lfs diff=lfs merge=lfs -text
*.mkv filter=lfs diff=lfs merge=lfs -text
*.mp3 filter=lfs diff=lfs merge=lfs -text
*.wav filter=lfs diff=lfs merge=lfs -text

# Model files
*.model filter=lfs diff=lfs merge=lfs -text
*.pkl filter=lfs diff=lfs merge=lfs -text
*.h5 filter=lfs diff=lfs merge=lfs -text

# Database files
*.db filter=lfs diff=lfs merge=lfs -text
*.sqlite filter=lfs diff=lfs merge=lfs -text

# JSON data files
data/*.json filter=lfs diff=lfs merge=lfs -text
quran_data/*.json filter=lfs diff=lfs merge=lfs -text

# ================================================
# KOD DOSYALARI - Normal Git ile tut
# ================================================

backend_node/**/*.js -filter -diff -merge
backend_node/**/*.json -filter -diff -merge
frontend/**/*.tsx -filter -diff -merge
frontend/**/*.ts -filter -diff -merge

# Text files
*.md text eol=lf
*.yml text eol=lf
*.yaml text eol=lf
.env* text eol=lf
EOF

# Doğrula
cat .gitattributes
```

---

### ADIM 6: Main Dosyasını LFS Takibine Al

```bash
# Dosya boyutunu kontrol et
du -h main

# LFS tracking'i etkinleştir
git lfs track "main"

# Doğrula - bu çıkmalı: main (filter=lfs diff=lfs merge=lfs -text)
git lfs ls-files
```

---

### ADIM 7: .gitignore Dosyasını Oluştur

```bash
cat > .gitignore << 'EOF'
# Backend dependencies
backend_node/node_modules/
backend_node/npm-debug.log*
backend_node/.env
backend_node/.env.local

# Frontend dependencies
frontend/node_modules/
frontend/.expo/
frontend/dist/

# OS files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db

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

### ADIM 8: Tüm Dosyaları Staging Area'ya Ekle

```bash
# .gitattributes ekle (ÖNEMLİ!)
git add .gitattributes

# Backend dosyaları ekle
git add backend_node/

# .gitignore ekle
git add .gitignore

# Dokümantasyon dosyaları ekle
git add QUICK_START.md REFACTORING_COMPLETE.md README.md

# Durumu kontrol et
git status
```

**Beklenen Çıktı:**
```
On branch master

No commits yet

Changes to be committed:
  new file:   .gitattributes
  new file:   .gitignore
  new file:   QUICK_START.md
  new file:   REFACTORING_COMPLETE.md
  new file:   README.md
  new file:   backend_node/...
```

---

### ADIM 9: Commit Yap

```bash
git commit -m "Initial commit: Production-ready Islamic AI backend with Git LFS

Includes:
- Full backend implementation with real API integrations
- OpenAI ChatGPT integration for scholar responses
- Alquran.cloud API integration for Quran verses
- Hadith API integration for Hadith searches
- Comprehensive input validation and error handling
- Git LFS for large files (main file 200MB+)

Production Readiness: 90%"
```

---

### ADIM 10: HTTP Post Buffer'ı Ayarla (ÖNEMLİ!)

Bu adım yapılmazsa "RPC failed" hatası alabilirsiniz!

```bash
# 500MB buffer ayarla (200MB dosya için)
git config http.postBuffer 524288000

# Doğrula
git config http.postBuffer

# Çıktı: 524288000
```

**Alternatif boyutlar:**
- 200MB: `git config http.postBuffer 209715200`
- 500MB: `git config http.postBuffer 524288000` ✅ **Önerilen**
- 1GB: `git config http.postBuffer 1073741824`

---

### ADIM 11: Timeout Ayarlarını Yapılandır

```bash
# Düşük hız limitini kaldır
git config http.lowSpeedLimit 0

# Timeout'u çok yüksek ayarla (11 gün!)
git config http.lowSpeedTime 999999

# Doğrula
git config --list | grep http
```

**Beklenen Çıktı:**
```
http.postBuffer=524288000
http.lowSpeedLimit=0
http.lowSpeedTime=999999
```

---

### ADIM 12: Remote Repository'sini Ayarla

**Önce GitHub'ta yeni repository oluşturun:**
1. https://github.com/new adresine git
2. Repository adını gir (örn: "islamic-ai-backend")
3. "Create repository" tuşuna bas
4. URL'yi kopyala

```bash
# HTTPS kullanıyorsanız (önerilen başlamak için):
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# VEYA SSH kullanıyorsanız (daha hızlı):
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git

# Doğrula
git remote -v
```

**Beklenen Çıktı:**
```
origin  https://github.com/YOUR_USERNAME/YOUR_REPO.git (fetch)
origin  https://github.com/YOUR_USERNAME/YOUR_REPO.git (push)
```

---

### ADIM 13: Branch Adını Ayarla

```bash
# main branch'a geç
git branch -M main

# Doğrula
git branch
```

**Beklenen Çıktı:**
```
* main
```

---

### ADIM 14: İlk Push'u Yap

```bash
# Push et (upstream'i ayarla)
git push -u origin main
```

**Bu adım biraz zaman alabilir (5-30 dakika) çünkü:**
- 200MB LFS dosyası yükleniyor
- Tüm backend dosyaları yükleniyor
- İnternet hızına bağlı

**Push sırasında görebileceğiniz:**
```
Uploading LFS objects:  50% (1/2), 100 MB | 5.2 MB/s
```

---

### ADIM 15: Push Başarısı Kontrolü

```bash
# Eğer push tamamlanmışsa, bu komutu çalıştır
git log --oneline -5

# veya GitHub'ta URL'sini açıp kontrol et
# https://github.com/YOUR_USERNAME/YOUR_REPO
```

---

## 🆘 Sorun Giderme

### Problem 1: "error: RPC failed; HTTP 413"

**Sebep:** Upload buffer çok küçük

**Çözüm:**
```bash
# Buffer'ı 1GB'a çıkar
git config http.postBuffer 1073741824

# Tekrar push et
git push -u origin main
```

---

### Problem 2: "fatal: unable to access ... SSL: certificate problem"

**Çözüm 1 - SSH kullan (önerilen):**
```bash
# Git SSH anahtarı oluştur (henüz yoksa)
ssh-keygen -t ed25519 -C "your@email.com"

# Public key'i GitHub'a ekle
# https://github.com/settings/keys

# Remote'u SSH'a değiştir
git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO.git

# Tekrar push et
git push -u origin main
```

**Çözüm 2 - SSL verify'i devre dışı bırak (güvenlik riski!):**
```bash
git config http.sslVerify false
git push -u origin main
```

---

### Problem 3: "fatal: The remote end hung up unexpectedly"

**Sebep:** İnternet bağlantısı koptu

**Çözüm:**
```bash
# Timeout ayarlarını kontrol et
git config http.lowSpeedTime

# Tekrar push et
git push -u origin main
```

---

### Problem 4: "main dosyası çok büyük" uyarısı

**Sebep:** Git henüz LFS tracking'i apply etmedi

**Çözüm:**
```bash
# LFS kurulumunu yenile
git lfs install --force

# Cache'i temizle
rm -rf .git/objects/pack/*

# Tekrar push et
git push -u origin main
```

---

### Problem 5: Push başladı ama ortada kaldı

**Çözüm:**
```bash
# Yeniden push et (Git devam etmeyi destekler)
git push -u origin main --verbose

# Eğer hala başarısız olursa:
git reset --soft HEAD~1  # Son commit'i geri al
git status  # Değişiklikleri kontrol et
# Dosyaları tekrar staging'e ekle ve yeniden push et
```

---

## ✅ Başarı Kontrolleri

Push tamamlandığında aşağıdakileri kontrol et:

### 1. Terminal Çıktısı
```bash
# Başarılı push görmeli:
git push -u origin main
```

Çıktı:
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

### 2. GitHub Web Interface
- https://github.com/YOUR_USERNAME/YOUR_REPO adresine git
- `main` dosyasının yanında "Git LFS" yazması gerekir
- Tüm dosyaların orada olması gerekir

### 3. Local Git
```bash
# Push'tan sonra
git log --oneline

# Beklenen çıktı:
# a1b2c3d (HEAD -> main, origin/main) Initial commit: Production-ready Islamic AI backend with Git LFS
```

---

## 📊 Beklenen Zaman Süresi

| Adım | Süre | Not |
|------|------|-----|
| LFS Kurulumu | 2-5 dakika | İlk kez |
| Komutları Çalıştırma | 2-3 dakika | Otomatik |
| Commit Yapma | <1 dakika | Lokal |
| İlk Push | 10-30 dakika | İnternet hızına bağlı |
| **TOPLAM** | **20-40 dakika** | Ortalama |

---

## 💡 En İyi Uygulamalar

✅ **YAPMAN GEREKENLER:**
- [ ] Push'tan önce http.postBuffer ayarla
- [ ] .gitattributes dosyasını commit'in bir parçası yap
- [ ] İyi internet bağlantısı olduğu zaman push et
- [ ] SSH yerine HTTPS ile başlayarak başarı sağla
- [ ] Push başarısız olursa SSH'a geç

❌ **YAPMA:**
- [ ] LFS kurulu olmadan 100MB+ dosyaları push etme
- [ ] .gitattributes'ı .gitignore'a ekle
- [ ] Timeout ayarlarını çok düşüğe ayarlama
- [ ] HTTP ve SSH'ı aynı anda karıştırma

---

## 📞 Yardımcı Linkler

- [Git LFS Resmi Sitesi](https://git-lfs.github.com/)
- [GitHub LFS Dokümantasyon](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage)
- [Git LFS Sorun Giderme](https://github.com/git-lfs/git-lfs/wiki/Troubleshooting)

---

## ✨ Bitti!

Tamamladıktan sonra:

1. ✅ 200MB+ dosya GitHub'a yüklendi
2. ✅ Tüm backend kodları güvende
3. ✅ 100MB limit sorun değil
4. ✅ Proje GitHub'da live

**Tebrikler! 🎉**

---

## 📝 Notlar

- Bu rehberi okumanız 15-20 dakika sürer
- Komutları çalıştırmanız 20-40 dakika sürer
- Push sırasında internet kaybı olursa endişelenmeyin, tekrar çalıştırabilirsiniz
- Sorular olursa terminal çıktısını dikkatle oku - genellikle çözüm orada!

**Başarılar! Happy coding! 🚀**
