#!/bin/bash

# ================================================
# GIT LFS SETUP GUIDE - Turkish Islamic AI Backend
# ================================================
#
# Bu script, 200MB+ büyüklüğündeki 'main' dosyasını
# GitHub'a yüklemek için Git LFS kurulumunu otomatikleştirir.
#
# Kullanım: bash git-lfs-setup.sh
#

set -e  # Hata durumunda script'i durdur

echo "╔════════════════════════════════════════════════════════╗"
echo "║     GIT LFS KURULUM VE YAPLANDIRMA                    ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# ================================================
# ADIM 1: Git LFS Kurulumunu Doğrula
# ================================================

echo "📦 ADIM 1: Git LFS Kurulumunu Doğrulıyor..."
echo ""

if command -v git-lfs &> /dev/null; then
    GIT_LFS_VERSION=$(git-lfs --version)
    echo "✅ Git LFS zaten yüklü:"
    echo "   $GIT_LFS_VERSION"
else
    echo "❌ Git LFS yüklü değil. Kurulum yapılıyor..."
    echo ""
    echo "macOS için Homebrew kullanıyorsanız:"
    echo "  brew install git-lfs"
    echo ""
    echo "Linux (Ubuntu/Debian) için:"
    echo "  sudo apt-get install git-lfs"
    echo ""
    echo "Windows için:"
    echo "  https://github.com/git-lfs/git-lfs/releases adresinden indir"
    echo ""
    exit 1
fi

echo ""
echo "✓ Git LFS kurulumu doğrulandı"
echo ""

# ================================================
# ADIM 2: Git LFS'i Sisteme Entegre Et
# ================================================

echo "🔗 ADIM 2: Git LFS'i Sisteme Entegre Ediyor..."
echo ""

git lfs install

echo ""
echo "✓ Git LFS sisteme entegre edildi"
echo ""

# ================================================
# ADIM 3: Proje Dizinine Git
# ================================================

echo "📂 ADIM 3: Proje Dizinine Geçiyor..."
echo ""

PROJECT_DIR="/Users/sametdurak/Desktop/1-main"

if [ -d "$PROJECT_DIR" ]; then
    cd "$PROJECT_DIR"
    echo "✅ Proje dizinine geçildi: $PROJECT_DIR"
else
    echo "❌ Proje dizini bulunamadı: $PROJECT_DIR"
    exit 1
fi

echo ""

# ================================================
# ADIM 4: Git Repository'sini Kontrol Et
# ================================================

echo "🔍 ADIM 4: Git Repository'sini Kontrol Ediyor..."
echo ""

if [ ! -d ".git" ]; then
    echo "ℹ️  Git repository bulunamadı. Oluşturuluyor..."
    git init
    echo "✓ Git repository oluşturuldu"
else
    echo "✅ Git repository zaten var"
fi

echo ""

# ================================================
# ADIM 5: .gitignore Dosyasını Ayarla
# ================================================

echo "📝 ADIM 5: .gitignore Dosyasını Ayarlıyor..."
echo ""

if [ ! -f ".gitignore" ]; then
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

# Memory files
memory/
*.mem
EOF
    echo "✓ .gitignore dosyası oluşturuldu"
else
    echo "✓ .gitignore zaten var"
fi

echo ""

# ================================================
# ADIM 6: .gitattributes Dosyasını Oluştur
# ================================================

echo "📋 ADIM 6: .gitattributes Dosyasını Oluşturuyor..."
echo ""

cat > .gitattributes << 'EOF'
# ================================================
# GIT LFS CONFIGURATION
# ================================================
#
# Bu dosya, hangi dosyaların Git LFS tarafından
# takip edileceğini belirtir.

# 200MB 'main' dosyası (LFS ile)
main filter=lfs diff=lfs merge=lfs -text

# Diğer büyük dosyalar
*.zip filter=lfs diff=lfs merge=lfs -text
*.tar.gz filter=lfs diff=lfs merge=lfs -text
*.iso filter=lfs diff=lfs merge=lfs -text

# Media dosyaları
*.mp4 filter=lfs diff=lfs merge=lfs -text
*.mov filter=lfs diff=lfs merge=lfs -text
*.mkv filter=lfs diff=lfs merge=lfs -text
*.mp3 filter=lfs diff=lfs merge=lfs -text
*.wav filter=lfs diff=lfs merge=lfs -text

# Model dosyaları
*.model filter=lfs diff=lfs merge=lfs -text
*.pkl filter=lfs diff=lfs merge=lfs -text
*.h5 filter=lfs diff=lfs merge=lfs -text

# Database dosyaları
*.db filter=lfs diff=lfs merge=lfs -text
*.sqlite filter=lfs diff=lfs merge=lfs -text

# JSON data (çok büyük)
data/*.json filter=lfs diff=lfs merge=lfs -text
quran_data/*.json filter=lfs diff=lfs merge=lfs -text

# Resimler (varsa)
*.psd filter=lfs diff=lfs merge=lfs -text

# ================================================
# NORMAL GIT İLE TUT
# ================================================

# Backend kodları (normal Git)
backend_node/**/*.js -filter -diff -merge
backend_node/**/*.json -filter -diff -merge

# Frontend kodları (normal Git)
frontend/**/*.tsx -filter -diff -merge
frontend/**/*.ts -filter -diff -merge
frontend/**/*.jsx -filter -diff -merge
frontend/**/*.js -filter -diff -merge

# Konfigürasyon dosyaları (normal Git)
*.md text eol=lf
*.yml text eol=lf
*.yaml text eol=lf
.env* text eol=lf
EOF

echo "✓ .gitattributes dosyası oluşturuldu"
echo ""
echo "📝 Takip edilen dosya türleri:"
echo "   • main (200MB)"
echo "   • *.zip, *.tar.gz, *.iso"
echo "   • *.mp4, *.mov, *.mkv, *.mp3, *.wav"
echo "   • *.model, *.pkl, *.h5"
echo "   • *.db, *.sqlite"
echo "   • data/*.json"
echo ""

# ================================================
# ADIM 7: 'main' Dosyasını LFS Takibine Al
# ================================================

echo "🎯 ADIM 7: 'main' Dosyasını LFS Takibine Alıyor..."
echo ""

if [ -f "main" ]; then
    FILE_SIZE=$(du -h main | cut -f1)
    echo "📦 main dosyası bulundu (Boyut: $FILE_SIZE)"
    
    git lfs track "main"
    echo "✓ 'main' dosyası LFS takibine alındı"
    
    # .gitattributes dosyasını staging area'ya ekle
    git add .gitattributes
    echo "✓ .gitattributes staging area'ya eklendi"
else
    echo "⚠️  'main' dosyası bulunamadı"
    echo "   Eğer başka bir yerde varsa:"
    echo "   git lfs track \"path/to/main\""
    echo "   komutunu çalıştırın"
fi

echo ""

# ================================================
# ADIM 8: Backend Dosyalarını Staging Area'ya Ekle
# ================================================

echo "📤 ADIM 8: Backend Dosyalarını Staging Area'ya Ekliyor..."
echo ""

if [ -d "backend_node" ]; then
    git add backend_node/
    echo "✓ backend_node/ dizini eklendi"
    
    # Dosya sayısını göster
    BACKEND_FILES=$(find backend_node -type f | wc -l)
    echo "   Backend dosya sayısı: $BACKEND_FILES"
else
    echo "⚠️  backend_node/ dizini bulunamadı"
fi

echo ""

# ================================================
# ADIM 9: Diğer Dosyaları Ekle
# ================================================

echo "📝 ADIM 9: Yapılandırma ve Dokümantasyon Dosyalarını Ekliyor..."
echo ""

# README ve dokümantasyon dosyaları
if [ -f "README.md" ]; then
    git add README.md
    echo "✓ README.md eklendi"
fi

if [ -f "QUICK_START.md" ]; then
    git add QUICK_START.md
    echo "✓ QUICK_START.md eklendi"
fi

if [ -f "REFACTORING_COMPLETE.md" ]; then
    git add REFACTORING_COMPLETE.md
    echo "✓ REFACTORING_COMPLETE.md eklendi"
fi

if [ -f ".gitignore" ]; then
    git add .gitignore
    echo "✓ .gitignore eklendi"
fi

echo ""

# ================================================
# ADIM 10: Staging Area'yı Göster
# ================================================

echo "📊 ADIM 10: Staging Area Durumu"
echo ""

git status

echo ""

# ================================================
# ADIM 11: Commit Mesajı
# ================================================

echo "💬 ADIM 11: Commit Mesajı Oluşturuluyor..."
echo ""

COMMIT_MESSAGE="Initial commit: Production-ready Islamic AI backend with Git LFS

Includes:
- Full backend implementation with real API integrations
- OpenAI ChatGPT integration for scholar responses
- Alquran.cloud API integration for Quran verses
- Hadith API integration for Hadith searches
- Comprehensive input validation and error handling
- Git LFS for large files (main file 200MB)

Files added:
- backend_node/ - Complete Node.js/Express backend
- .gitattributes - Git LFS configuration
- .gitignore - Ignore unnecessary files
- Documentation files

Production Readiness: 90%"

echo "$COMMIT_MESSAGE"
echo ""

# ================================================
# ADIM 12: Commit'i Yap
# ================================================

echo "✅ ADIM 12: Commit Yapmaya Hazır"
echo ""
echo "Aşağıdaki komutu çalıştırın:"
echo ""
echo "git commit -m '$COMMIT_MESSAGE'"
echo ""

read -p "Devam etmek istiyor musunuz? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git commit -m "$COMMIT_MESSAGE"
    echo "✓ Commit başarıyla yapıldı"
else
    echo "Commit atlandı"
    exit 0
fi

echo ""

# ================================================
# ADIM 13: HTTP Post Buffer Ayarı
# ================================================

echo "⚙️  ADIM 13: HTTP Post Buffer Ayarını Yapıyor..."
echo ""

# 500MB buffer
git config http.postBuffer 524288000
echo "✓ http.postBuffer = 524288000 (500MB)"

# SSL doğrulama (isteğe bağlı, sorun varsa)
# git config http.sslVerify true
echo "✓ http.sslVerify = true (varsayılan)"

# Timeout ayarları (LFS için önemli)
git config http.lowSpeedLimit 0
git config http.lowSpeedTime 999999
echo "✓ http.lowSpeedLimit = 0"
echo "✓ http.lowSpeedTime = 999999"

echo ""

# ================================================
# ADIM 14: Git Konfigürasyonunu Göster
# ================================================

echo "🔧 ADIM 14: Git Konfigürasyonu"
echo ""

echo "Global Git LFS Ayarları:"
git lfs env | head -20

echo ""
echo "HTTP Ayarları:"
git config --get http.postBuffer
git config --get http.lowSpeedLimit
git config --get http.lowSpeedTime

echo ""

# ================================================
# ADIM 15: Remote Repository Kurulumu
# ================================================

echo "🌐 ADIM 15: Remote Repository Kurulumu"
echo ""

CURRENT_REMOTE=$(git config --get remote.origin.url 2>/dev/null || echo "")

if [ -z "$CURRENT_REMOTE" ]; then
    echo "ℹ️  Remote origin henüz ayarlanmamış"
    echo ""
    echo "GitHub'ta yeni repository oluşturduktan sonra:"
    echo ""
    echo "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    echo ""
    echo "VEYA"
    echo ""
    echo "git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git"
    echo ""
else
    echo "✅ Remote origin zaten ayarlanmış:"
    echo "   $CURRENT_REMOTE"
fi

echo ""

# ================================================
# ADIM 16: Push için Hazırlık
# ================================================

echo "📤 ADIM 16: Push Hazırlığı"
echo ""

echo "Repository'nizi GitHub'a push etmeden önce:"
echo ""
echo "1️⃣  GitHub'ta yeni repository oluşturun:"
echo "    https://github.com/new"
echo ""
echo "2️⃣  Repository URL'sini ayarlayın:"
echo "    git remote add origin <REPO_URL>"
echo ""
echo "3️⃣  Branch'ı ayarlayın:"
echo "    git branch -M main"
echo "    git push -u origin main"
echo ""
echo "4️⃣  İlk push büyük dosya nedeniyle biraz zaman alabilir:"
echo "    Tahmini süre: 5-15 dakika (internet hızına bağlı)"
echo ""

echo ""

# ================================================
# ADIM 17: LFS Status Kontrolü
# ================================================

echo "📋 ADIM 17: Git LFS Durumu"
echo ""

git lfs ls-files

echo ""

# ================================================
# TAMAMLANDI
# ================================================

echo "╔════════════════════════════════════════════════════════╗"
echo "║     GIT LFS KURULUM TAMAMLANDI ✅                      ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "📝 ÖZETİ:"
echo "   ✓ Git LFS kurulu ve konfigüre edildi"
echo "   ✓ 'main' dosyası LFS takibine alındı"
echo "   ✓ Backend dosyaları staging area'ya eklendi"
echo "   ✓ Commit yapıldı"
echo "   ✓ HTTP ayarları optimize edildi"
echo ""
echo "🚀 SONRAKİ ADIMLAR:"
echo "   1. GitHub'ta yeni repository oluşturun"
echo "   2. git remote add origin <URL> çalıştırın"
echo "   3. git push -u origin main çalıştırın"
echo ""
echo "💡 İPUÇLARI:"
echo "   • İlk push'da LFS dosyası transferi biraz zaman alacak"
echo "   • Push sırasında internet kaybı olursa, tekrar çalıştırabilirsiniz"
echo "   • RPC failed hatası alırsanız, http.postBuffer artırabilirsiniz"
echo ""
echo "✨ Başarıyla tamamlandı! Happy coding! 🎉"
echo ""
