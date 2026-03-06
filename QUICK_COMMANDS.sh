#!/bin/bash

# ================================================
# GIT LFS - HIZLI KOMUT REFERENSI
# ================================================
# Bu dosya kopyalayıp yapıştırmaya uygun komutları içerir
# Terminale bir seferde veya satır satır çalıştırabilirsiniz

echo "╔════════════════════════════════════════════════════════╗"
echo "║     GIT LFS - HIZLI KOMUT REFERENSI                   ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# ================================================
# 1. GIT LFS KURULUMU
# ================================================

echo "📦 1. GIT LFS KURULUMU"
echo "=================================================="
echo ""
echo "$ git lfs install"
echo ""
echo "Çıktı:"
echo "Git LFS initialized."
echo ""

# ================================================
# 2. .GITATTRIBUTES DOSYASINI OLUŞTUR
# ================================================

echo "📝 2. .GITATTRIBUTES DOSYASINI OLUŞTUR"
echo "=================================================="
echo ""
echo "cat > .gitattributes << 'EOF'
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
backend_node/**/*.js -filter -diff -merge
backend_node/**/*.json -filter -diff -merge
frontend/**/*.tsx -filter -diff -merge
frontend/**/*.ts -filter -diff -merge
*.md text eol=lf
*.yml text eol=lf
*.yaml text eol=lf
EOF"
echo ""

# ================================================
# 3. MAIN DOSYASINI LFS TAKIBINE AL
# ================================================

echo "🎯 3. MAIN DOSYASINI LFS TAKIBINE AL"
echo "=================================================="
echo ""
echo "# Dosya boyutunu kontrol et"
echo "$ ls -lh main"
echo ""
echo "# LFS takibine al"
echo "$ git lfs track \"main\""
echo ""
echo "# Doğrula"
echo "$ git lfs ls-files"
echo ""

# ================================================
# 4. STAGING AREA'YA EKLE
# ================================================

echo "📤 4. STAGING AREA'YA EKLE"
echo "=================================================="
echo ""
echo "$ git add .gitattributes"
echo "$ git add backend_node/"
echo "$ git add .gitignore"
echo "$ git add QUICK_START.md REFACTORING_COMPLETE.md README.md"
echo ""
echo "# Durumu kontrol et"
echo "$ git status"
echo ""

# ================================================
# 5. COMMIT YAP
# ================================================

echo "💬 5. COMMIT YAP"
echo "=================================================="
echo ""
echo "git commit -m \"Initial commit: Production-ready Islamic AI backend with Git LFS\""
echo ""

# ================================================
# 6. HTTP BUFFER AYARLA
# ================================================

echo "⚙️  6. HTTP BUFFER AYARLA (ÖNEMLİ!)"
echo "=================================================="
echo ""
echo "# 500MB buffer ayarla"
echo "$ git config http.postBuffer 524288000"
echo ""
echo "# Doğrula"
echo "$ git config http.postBuffer"
echo ""
echo "# Çıktı:"
echo "524288000"
echo ""

# ================================================
# 7. TIMEOUT AYARLARINI YAPILANDIR
# ================================================

echo "⏱️  7. TIMEOUT AYARLARINI YAPILANDIR"
echo "=================================================="
echo ""
echo "$ git config http.lowSpeedLimit 0"
echo "$ git config http.lowSpeedTime 999999"
echo ""
echo "# Doğrula"
echo "$ git config --list | grep http"
echo ""

# ================================================
# 8. REMOTE REPOSITORY'NI AYARLA
# ================================================

echo "🌐 8. REMOTE REPOSITORY'NI AYARLA"
echo "=================================================="
echo ""
echo "# HTTPS (önerilen)"
echo "$ git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
echo ""
echo "# Veya SSH"
echo "$ git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git"
echo ""
echo "# Doğrula"
echo "$ git remote -v"
echo ""

# ================================================
# 9. BRANCH'I AYARLA
# ================================================

echo "🌳 9. BRANCH'I AYARLA"
echo "=================================================="
echo ""
echo "$ git branch -M main"
echo ""
echo "# Doğrula"
echo "$ git branch"
echo ""

# ================================================
# 10. PUSH ET
# ================================================

echo "📤 10. PUSH ET"
echo "=================================================="
echo ""
echo "# İlk push (upstream'i ayarla)"
echo "$ git push -u origin main"
echo ""
echo "# VEYA verbose mode'da (debug için)"
echo "$ git push -u origin main --verbose"
echo ""
echo "# VEYA LFS optimizasyonu ile"
echo "$ GIT_CURL_VERBOSE=0 git push -u origin main"
echo ""

# ================================================
# LFS STATUS KOMUTLARI
# ================================================

echo "📊 LFS STATUS KOMUTLARI"
echo "=================================================="
echo ""
echo "# LFS tarafından takip edilen dosyalar"
echo "$ git lfs ls-files"
echo ""
echo "# LFS environment bilgisi"
echo "$ git lfs env"
echo ""
echo "# LFS cache boyutu"
echo "$ du -sh .git/lfs/objects"
echo ""

# ================================================
# SORUN GIDERME KOMUTLARI
# ================================================

echo "🔧 SORUN GIDERME KOMUTLARI"
echo "=================================================="
echo ""
echo "# Buffer'ı 1GB'a çıkar (çok büyük dosyalar için)"
echo "$ git config http.postBuffer 1073741824"
echo ""
echo "# SSL verify'i kapat (güvenlik riski!)"
echo "$ git config http.sslVerify false"
echo ""
echo "# Veya SSH'a geç"
echo "$ git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO.git"
echo ""
echo "# Git cache'i temizle"
echo "$ rm -rf .git/objects/pack/*"
echo ""
echo "# LFS kurulumunu yenile"
echo "$ git lfs install --force"
echo ""
echo "# Henüz push edilmeyen commits"
echo "$ git log origin/main..main"
echo ""

# ================================================
# KOPYALAYIP YAPIŞTURABILECEK KOMUT BLOKLARI
# ================================================

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║     KOPYALAYIP YAPIŞTURMAYA HAZIR KOMUT BLOKLARI       ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

echo "🚀 BLOK 1: HIZLI SETUP (COPY-PASTE)"
echo "=================================================="
cat << 'EOF'
# Terminale kopyalayıp yapıştır:
git lfs install
git lfs track "main"
git add .gitattributes
git add backend_node/ .gitignore QUICK_START.md REFACTORING_COMPLETE.md README.md
git commit -m "Initial commit: Production-ready Islamic AI backend with Git LFS"
git config http.postBuffer 524288000
git config http.lowSpeedLimit 0
git config http.lowSpeedTime 999999
EOF
echo ""

echo "🌐 BLOK 2: REMOTE SETUP (Birini seç)"
echo "=================================================="
cat << 'EOF'
# HTTPS kullanıyorsanız:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main

# VEYA SSH kullanıyorsanız:
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
EOF
echo ""

echo "🆘 BLOK 3: EĞER PUSH BAŞARISIZ OLURSA"
echo "=================================================="
cat << 'EOF'
# Buffer'ı artır
git config http.postBuffer 1073741824

# Tekrar push et
git push -u origin main --verbose

# Hala başarısız olursa SSH'a geç
git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
EOF
echo ""

# ================================================
# KONTROL KOMUTLARI
# ================================================

echo ""
echo "✅ TAMAMLAMA SONRASI KONTROL KOMUTLARI"
echo "=================================================="
echo ""
echo "# Push'un başarılı olup olmadığını kontrol et"
echo "$ git log --oneline | head -5"
echo ""
echo "# Remote branch'ı kontrol et"
echo "$ git branch -vv"
echo ""
echo "# GitHub'ta dosyaları görüntüle"
echo "Tarayıcıda: https://github.com/YOUR_USERNAME/YOUR_REPO"
echo ""

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║     TÜM KOMUTLAR HAZIR! BAŞARILAR! 🎉                 ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
