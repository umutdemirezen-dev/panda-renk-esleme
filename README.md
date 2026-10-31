# Panda Renk Eşleme – Aynı Renklere Boya!

Panda Games Studio · 2-5 yaş renk eşleme oyunu · 50 seviye (1-10 ücretsiz)
Paket adı: `com.pandagamesstudio.renkesleme` · Capacitor 7

## Klasör yapısı

```
www/index.html                  Oyunun tamamı (tek dosya)
assets/                         Uygulama ikonu ve açılış ekranı kaynakları
scripts/patch-android.js        Yatay ekran, tam ekran, sürüm numarası ayarları
.github/workflows/build.yml     APK + AAB otomatik derleme
.github/workflows/create-keystore.yml   Tek seferlik imzalama anahtarı üretimi
privacy-policy.html             Google Play için gizlilik politikası sayfası
capacitor.config.json, package.json
```

## 1) APK almak (test için)

1. Bu klasörün **içindekileri** yeni bir GitHub deposuna yükleyin (`.github` klasörü dahil).
2. Yükleme `main` dalına yapıldığında **Actions** sekmesinde "Android APK ve AAB Derle" kendiliğinden başlar (elle başlatmak için: *Run workflow*).
3. Bitince (yaklaşık 5-8 dk) çalıştırmanın altındaki **Artifacts** bölümünden `panda-renk-esleme-android` dosyasını indirin.
   - `panda-renk-esleme-debug.apk` → telefona/tablete doğrudan kurup test edin.

## 2) Play Store için imzalı AAB almak (tek seferlik kurulum)

1. **Actions → "Imzalama Anahtari Olustur (tek seferlik)" → Run workflow** çalıştırın.
2. Artifacts'tan `imzalama-anahtari-GIZLI` dosyasını indirin (1 gün saklanır). İçindeki `GITHUB-SECRETS-OKU.txt` dosyasını açın.
3. Depoda **Settings → Secrets and variables → Actions → New repository secret** ile 4 değeri ekleyin:
   `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`
4. `upload-keystore.jks` dosyasını ve şifreyi **güvenli bir yere yedekleyin**. Bu anahtar kaybolursa uygulamanın güncellemeleri yüklenemez.
5. Derlemeyi yeniden çalıştırın: artık `panda-renk-esleme-release.aab` (Play Console'a yüklenecek) ve `panda-renk-esleme-release.apk` imzalı olarak gelir.

Secrets eklenmeden önce AAB, `...-IMZASIZ.aab` adıyla gelir; bu dosya Play Console'a yüklenemez.

**Sürüm numarası:** `versionCode` her derlemede otomatik artar (Actions çalıştırma numarası). `versionName` için `package.json` içindeki `version` değerini değiştirin.

## 3) Gizlilik politikası adresi

Play Console bir gizlilik politikası URL'si ister:
1. `privacy-policy.html` içindeki `ILETISIM_EPOSTANIZ` yazan iki yeri kendi e-posta adresinizle değiştirin.
2. Depoda **Settings → Pages → Branch: main / root** seçin.
3. Adres: `https://KULLANICIADI.github.io/DEPOADI/privacy-policy.html`

## ⚠️ Yayından önce: gerçek ödeme entegrasyonu

Oyundaki "Tüm Seviyeleri Aç - 24.99 TL" satın alması şu an **simüle ediliyor** (ebeveyn sorusu doğru cevaplanınca kilitler ücretsiz açılır). Play Store'da yayınlamadan önce Google Play Billing eklentisi bağlanmalı ve Play Console'da `unlock_all_levels` kimlikli tek seferlik ürün tanımlanmalıdır. Kod, `window.PandaBilling.buy("unlock_all_levels")` / `restore(...)` köprüsünü kullanacak şekilde hazırdır.
