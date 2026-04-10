# Proje Spesifikasyonu: PHP & MySQL Tabanlı CMS API

Bu döküman, mevcut veritabanı şeması üzerine inşa edilecek olan RESTful API'nin teknik gereksinimlerini ve rotalarını tanımlar.

## 1. Teknik Altyapı ve Mimari
* **Dil/Dil:** PHP & MySQL.
* **Mimari:** Genişletilebilir (Scalable) bir yönlendirme (routing) yapısı.
* **Güvenlik:** JWT (JSON Web Token) tabanlı yetkilendirme.
* **Response Formatı:** Tüm yanıtlar standart JSON formatında olmalıdır.

---

## 2. Kimlik Doğrulama ve Yönetim (Auth)
`admins` tablosu üzerinden gerçekleştirilecek işlemler:

| Metot | Rota | Açıklama | Güvenlik |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/login` | `username` ve `password` ile giriş, Token döner. | Public |

---

## 3. Genel (Public) Sayfa Rotaları
Tüm `/...-page` rotaları için ortak kurallar:
1.  **Page Banners:** Her istekte `page_banners` tablosu yanıtın başında gelmelidir.
2.  **Dinamik Filtre:** `page_banners` çekilirken, rotadaki `-page` eki atılarak `page_key` parametresi olarak kullanılmalıdır (Örn: `/home-page` -> `page_key = 'home'`).
3.  **Dosya Yapısı:** Bu rotaların Controller mantığı tek bir dosyada toplanabilir.

### Rota ve Tablo Eşleşmeleri (GET)
* **`/home-page`**: `home_hero`, `home_counters`, `home_founder`, `home_features`
* **`/rooms-page`**: `rooms`, `room_images`
* **`/restaurant-page`**: `restaurant_info`, `restaurant_images`
* **`/events-page`**: `saloons`, `saloon_images`
* **`/contact-page`**: `company_contacts`

---

## 4. Yönetimsel (Private) Rotalar
Bu gruptaki tüm rotalar **Token** doğrulaması gerektirir. CRUD (Create, Read, Update, Delete) operasyonlarını kapsar.

### 4.1. Dinamik İçerik Yönetimi (Tam CRUD)
Bu tablolar üzerinde veri ekleme, silme ve güncelleme yetkisi vardır.

* **Odalar:** `/rooms` (Listele/Ekle) & `/rooms/{id}` (Getir/Güncelle/Sil)
    * *İlişkili Tablo:* `room_images`
* **Salonlar:** `/saloons` (Listele/Ekle) & `/saloons/{id}` (Getir/Güncelle/Sil)
    * *İlişkili Tablo:* `saloon_images`
* **Ana Sayfa Bileşenleri:**
    * `/home-hero`
    * `/home-counters`
    * `/home-features`

### 4.2. Statik İçerik Yönetimi (Sadece Update)
Bu rotalarda yeni veri ekleme veya silme yapılamaz, sadece mevcut ID üzerinden güncelleme yapılabilir.

* **Restaurant:** `/restaurant-page` (Sadece Update rotası eklenecek)
* **Kurucu:** `/home-founder` (Sadece Update)
* **İletişim Bilgileri:** `/company-contacts` (Sadece Update)

---

## 5. Uygulama Notları
* **Resim Yönetimi:** `room_images` ve `saloon_images` gibi tablolar ana tabloya Foreign Key ile bağlıdır; silme işlemlerinde ilişkili görsellerin kontrolü yapılmalıdır.
* **Hata Yönetimi:** Yetkisiz erişimlerde `401 Unauthorized`, hatalı rotalarda `404 Not Found` ve başarılı işlemlerde `200/201` HTTP kodları kullanılmalıdır.