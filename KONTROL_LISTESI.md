# ✅ Git LFS Setup - Kontrol Listesi

## 📋 Ön Kontrol

- [ ] **Git LFS Kurulu mu?**
  ```bash
  git lfs --version
  ```
  Çıktı: `git-lfs/3.x.x` veya benzeri
  
  Yoksa kur:
  ```bash
  brew install git-lfs  # macOS
  # veya
  sudo apt-get install git-lfs  # Linux
  ```

- [ ] **İnternet Bağlantısı İyi mi?**
  - WiFi değil, Ethernet tercih edilir
  - Hızlı internet (10+ Mbps)
  - VPN kapalı (eğer sorun yaşarsan)

- [ ] **GitHub Hesabı Var mı?**
  - https://github.com/login adresinde giriş yap
  - Yeni repository oluşturmaya hazır ol

- [ ] **Terminal Erişimi Var mı?**
  - Terminal/CMD penceresi aç
  - Cd komutu çalışıyor

---

## 🛠️ Setup Kontrol Listesi

### ADIM 1: Git LFS Kurulumu
- [ ] `git lfs install` komutunu çalıştır
- [ ] Çıktı: `Git LFS initialized.`

### ADIM 2: Proje Dizini
- [ ] `cd /Users/sametdurak/Desktop/1-main`
- [ ] `ls -la | grep main` dosyayı görüyorsun
- [ ] `du -h main` boyutu 200MB+ gösteriyor

### ADIM 3: Git Repository
- [ ] `git init` yapıldı (eğer yoksa)
- [ ] `git config user.name "Your Name"` yapıldı
- [ ] `git config user.email "your@email.com"` yapıldı

### ADIM 4: .gitattributes
- [ ] Dosya oluşturuldu: `.gitattributes`
- [ ] İçinde `main filter=lfs diff=lfs merge=lfs -text` satırı var
- [ ] `cat .gitattributes | head -5` ile kontrol ettim

### ADIM 5: Main Dosyasını LFS'ye Al
- [ ] `git lfs track "main"` komutu çalıştırıldı
- [ ] `git lfs ls-files` çıktısında `main` görünüyor
- [ ] `git add .gitattributes` yapıldı

### ADIM 6: .gitignore
- [ ] `.gitignore` dosyası oluşturuldu
- [ ] `backend_node/node_modules/` ve benzeri ayarlar var
- [ ] `git add .gitignore` yapıldı

### ADIM 7: Backend Dosyaları
- [ ] `git add backend_node/` yapıldı
- [ ] `git add QUICK_START.md REFACTORING_COMPLETE.md README.md` yapıldı
- [ ] `git status` staging area'da dosyaları gösteriyor

### ADIM 8: Commit
- [ ] `git commit -m "Initial commit: ..."` yapıldı
- [ ] Commit başarılı oldu (output gösterildi)
- [ ] `git log --oneline` yeni commit'i gösteriyor

### ADIM 9: HTTP Buffer Ayarı
- [ ] `git config http.postBuffer 524288000` yapıldı
- [ ] `git config http.postBuffer` çıktısı `524288000`

### ADIM 10: Timeout Ayarları
- [ ] `git config http.lowSpeedLimit 0` yapıldı
- [ ] `git config http.lowSpeedTime 999999` yapıldı
- [ ] `git config --list | grep http` 3 ayarı gösteriyor

---

## 🌐 GitHub Hazırlığı

- [ ] **Repository Oluşturuldu**
  - GitHub'ta yeni repository oluşturdum
  - URL: `https://github.com/USERNAME/REPONAME.git`
  - Repository boş (README veya başka dosya yok)

- [ ] **Remote Ayarlandı**
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
  ```
  - [ ] Komut hatasız çalıştı
  - [ ] `git remote -v` iki satır gösteriyor (fetch ve push)

- [ ] **Branch Ayarlandı**
  ```bash
  git branch -M main
  ```
  - [ ] Komut hatasız çalıştı
  - [ ] `git branch` `main` gösteriyor

---

## 📤 Push Hazırlığı

### Push'tan Hemen Önce
- [ ] İnternet bağlantısı test edildi
  ```bash
  ping github.com
  ```

- [ ] Dosyaların hiçbiri değiştirilmedi
  ```bash
  git status
  # Çıktı: nothing to commit, working tree clean
  ```

- [ ] LFS ayarları doğru
  ```bash
  git lfs env
  # Endpoint https://github.com ile başlıyor
  ```

### Push'u Başlat
- [ ] Terminal ekranını silme:
  ```bash
  git push -u origin main
  ```

- [ ] Push sırasında:
  - [ ] "Uploading LFS objects" görünüyor
  - [ ] İlerleme çubuğu hareket ediyor
  - [ ] Timeout/Error yok (ilk 5-10 dakika sessiz kalabilir)

- [ ] Push tamamlandı:
  ```
  ✓ Uploading LFS objects: 100% (1/1), 201 MB | 5.2 MB/s
  ✓ Total 35 (delta 8), reused 0 (delta 0)
  ✓ Branch 'main' set up to track remote branch 'main' from 'origin'.
  ```

---

## ✅ Push Sonrası Kontrol

### Lokal Kontrol
- [ ] `git log --oneline -1`
  - Output: Commit mesajı görünüyor
  - Referans: `(HEAD -> main, origin/main)`

- [ ] `git status`
  - Output: `nothing to commit`

- [ ] `git lfs ls-files`
  - Output: `main` gösterilirken, `pointer` bilgisi

### GitHub Web Kontrol
- [ ] https://github.com/YOUR_USERNAME/YOUR_REPO adresine git
- [ ] Commit mesajı görünüyor
- [ ] `main` dosyası listeleniyor
- [ ] `main` dosyasının yanında **"Git LFS"** yazısı var

- [ ] Tüm dosyalar listelenmiş:
  - [ ] `backend_node/` dizini
  - [ ] `.gitattributes` dosyası
  - [ ] `.gitignore` dosyası
  - [ ] `QUICK_START.md` dosyası
  - [ ] Diğer dokümantasyon

- [ ] İnternet tarayıcısında dosyaları aç:
  - [ ] `main` dosyasına tıkla
  - [ ] İçeriğini görüyorsun (binary dosya değil)
  - [ ] Backend kodu görülüyor (JavaScript dosyaları)

---

## 🆘 Sorun Durumunda Kontrol

### Push Hatasına Maruz Kaldıysan

1. **Terminal Çıktısını Oku**
   - [ ] Hata mesajı ne diyors?
   - [ ] HTTP 413? → Buffer artır
   - [ ] SSL Error? → SSH'a geç
   - [ ] Timeout? → Tekrar çalıştır

2. **Buffer Sorunu (HTTP 413)**
   ```bash
   git config http.postBuffer 1073741824
   git push -u origin main --verbose
   ```
   - [ ] Komutlar çalıştırıldı
   - [ ] Progress görünüyor
   - [ ] Tamamlanıyor

3. **SSL Sorunu**
   ```bash
   git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
   - [ ] SSH anahtarı oluşturuldu (gerekirse)
   - [ ] GitHub'ta public key eklendi
   - [ ] Push başarılı

4. **Timeout Sorunu**
   ```bash
   git push -u origin main
   ```
   - [ ] Tekrar push ettim
   - [ ] İlerleme gösteriyor
   - [ ] Tamamlanıyor

---

## 📊 Nihai Doğrulama

### Lokal Git Durumu
```bash
# Bu komutu çalıştır:
echo "=== Git Status ===" && \
git status && \
echo -e "\n=== Git Log ===" && \
git log --oneline -1 && \
echo -e "\n=== LFS Files ===" && \
git lfs ls-files && \
echo -e "\n=== Remote ===" && \
git remote -v && \
echo -e "\n=== HTTP Config ===" && \
git config --list | grep http
```

**Beklenen Çıktı:**
```
=== Git Status ===
On branch main
nothing to commit, working tree clean

=== Git Log ===
a1b2c3d (HEAD -> main, origin/main) Initial commit: Production-ready Islamic AI backend with Git LFS

=== LFS Files ===
main (filter=lfs diff=lfs merge=lfs -text)

=== Remote ===
origin  https://github.com/YOUR_USERNAME/YOUR_REPO.git (fetch)
origin  https://github.com/YOUR_USERNAME/YOUR_REPO.git (push)

=== HTTP Config ===
http.postBuffer=524288000
http.lowSpeedLimit=0
http.lowSpeedTime=999999
```

### GitHub Web Durumu
```
✓ Repository açılabiliyor
✓ Main dosyası görünüyor
✓ Main dosyasının yanında "Git LFS" yazısı
✓ Backend dosyaları listelenmiş
✓ Dokümantasyon dosyaları var
✓ Commit sayısı 1
```

---

## 🎉 Başarı!

Eğer tüm kontrol listesi ✅ işaretlendiyse:

### Sahip Olduğun:
- ✅ 200MB dosya GitHub'da (sınır aşılmadı)
- ✅ Production-ready backend sürümlendi
- ✅ Team üyeleri klonlayabilir
- ✅ Backup ve recovery var
- ✅ Versiyon kontrolü var
- ✅ CI/CD hazırlığı var

### Sonraki Adımlar:
1. [ ] Takım üyelerine repository'yi paylaş
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd YOUR_REPO
   git lfs pull
   npm install
   npm start
   ```

2. [ ] Branch stratejisi oluştur (main, develop, feature branches)

3. [ ] CI/CD pipeline kurulum (GitHub Actions)

4. [ ] Deployment yapılandır

---

## 📞 Hızlı Referans

### Çalışmayan Komut?
```bash
# En baştan başla
git lfs install --force
rm -rf .git/objects/pack/*
git push -u origin main
```

### Hala Sorunu Var?
1. Bu dosyayı tekrar oku
2. Terminal çıktısını oku
3. [GIT_LFS_KURULUM.md](GIT_LFS_KURULUM.md) sorun giderme bölümüne bak

### Acil Yardım
```bash
# Hızlı durum kontrolü
git remote -v
git config http.postBuffer
git lfs ls-files
git status
```

---

## 🎯 Beklenen Zaman

| Aşama | Süre |
|-------|------|
| Kontrol ve Kurulum | 5 dakika |
| Dosya Staging ve Commit | 2 dakika |
| Push | 10-30 dakika |
| Doğrulama | 1 dakika |
| **TOPLAM** | **~30 dakika** |

---

## 💾 Yedek Çıkışlar

Push sırasında çıktıyı kaydet (sorun giderme için):

```bash
# Çıktıyı dosyaya kaydet
git push -u origin main 2>&1 | tee push-output.log

# Daha sonra review et
cat push-output.log
```

---

## ✨ Tebrikler!

Eğer buraya kadar geldiysen, setup başarılı demek! 🎉

**Başarılar projenle! Happy coding! 🚀**

---

*Hazırlandı: Mart 6, 2026*
*Sürüm: 1.0*
*Dil: Türkçe*
