-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 07 Nis 2026, 21:46:39
-- Sunucu sürümü: 10.4.32-MariaDB
-- PHP Sürümü: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `aliguvenotel`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `contact_info`
--

CREATE TABLE `contact_info` (
  `id` int(11) NOT NULL,
  `address` text DEFAULT NULL,
  `landline_phone` varchar(50) DEFAULT NULL,
  `mobile_phone` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `fax` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `contact_info`
--

INSERT INTO `contact_info` (`id`, `address`, `landline_phone`, `mobile_phone`, `email`, `fax`) VALUES
(1, 'Uluönder Mahallesi Şehit Rüstem Demirbaş Sk No:8 26190 Tepebaşı/Eskişehir', '0 (222) 330 03 26', '0 553 209 47 57', 'bilgi@aliguvenuygulamaoteli.com', '0 (222) 330 05 06');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `event_images`
--

CREATE TABLE `event_images` (
  `id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `event_images`
--

INSERT INTO `event_images` (`id`, `image_url`) VALUES
(1, 'https://aliguvenotel.vercel.app/assets/images/room_1.jpg'),
(2, 'https://aliguvenotel.vercel.app/assets/images/room_2.jpg'),
(3, 'https://aliguvenotel.vercel.app/assets/images/restaurant.jpg');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `event_space`
--

CREATE TABLE `event_space` (
  `id` int(11) NOT NULL,
  `intro_text` text DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `amenities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`amenities`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `event_space`
--

INSERT INTO `event_space` (`id`, `intro_text`, `video_url`, `title`, `description`, `amenities`) VALUES
(1, 'En özel günlerinizi ölümsüzleştirmek için Ali Güven Uygulama Oteli''nin profesyonel organizasyon ekibi ve şık salonları ile yanınızdayız.', 'https://www.youtube.com/watch?v=pnDDWq4T4Fk', 'Küçük Salon - 130 Kişilik', 'Salonumuz 130 kişilik misafir kapasitesinde olup, çeşitli organizasyonlarınıza ev sahipliği yapabilmektedir. Nişan töreni-kına gecesi-Mevlid-i şerifleriniz için uygun ses sistemi düzeni ve dekorasyonu ile donatılmıştır.', '["Profesyonel Ses Sistemi", "Özel Dekorasyon Seçenekleri", "Nişan & Kına İçin İdeal", "130 Kişilik Kapasite"]');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `home_counters`
--

CREATE TABLE `home_counters` (
  `id` int(11) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `home_counters`
--

INSERT INTO `home_counters` (`id`, `icon`, `count`, `name`) VALUES
(1, 'bed', 30, 'Oda'),
(2, 'utensils', 100, 'Kişilik Restoran'),
(3, 'sun', 100, 'Kişilik Teras'),
(4, 'graduation-cap', 250, 'Kişilik Okul Salonu'),
(5, 'briefcase', 150, 'Kişilik Otel Salonu'),
(6, 'trees', 30, 'Açık Hava Salon');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `home_features`
--

CREATE TABLE `home_features` (
  `id` int(11) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `home_features`
--

INSERT INTO `home_features` (`id`, `icon`, `title`, `description`) VALUES
(1, 'sparkles', 'Genç ve Dinamik Kadro', 'Turizm öğrencilerimizin enerjisi ve profesyonel eğitmenlerimizin gözetimiyle samimi bir hizmet.'),
(2, 'map-pin', 'Stratejik Lokasyon', 'Şehrin önemli noktalarına yakın, sakin ve huzurlu bir Tepebaşı deneyimi.'),
(3, 'heart-handshake', 'Samimi Misafirperverlik', 'Bir uygulama otelinden beklediğiniz sıcaklıkta, bütçe dostu konaklama çözümleri.');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `home_founder`
--

CREATE TABLE `home_founder` (
  `id` int(11) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `special_text` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `home_founder`
--

INSERT INTO `home_founder` (`id`, `image_url`, `title`, `content`, `special_text`) VALUES
(1, 'https://aliguvenotel.vercel.app/assets/images/ali_guven.png', 'Ali Güven Kimdir?', 'Okulumuza adını veren Ali Güven 01.01.1931 tarihinde Eskişehir’in Mahmudiye ilçesinin Şevkiye köyünde doğdu. Uzun yıllar çiftçilik yaptıktan sonra ticaret hayatına atıldı. Disiplinli ve özverili çalışmaları sayesinde iş dünyasındaki yerini aldı. Hayırsever bir iş adamı olarak tanındı ve hayatını bu şekilde sürdürdü. <br><br> Ülke kalkınmasında eğitimin önemini her fırsatta dile getiren Ali Güven, sağlığında birçok eğitim kurumuna bağışta bulunmuştur. En büyük isteği ise yüzlerce öğrencinin eğitim göreceği bir okul yaptırmaktır. 26.01.1993 tarihinde hayata veda etmiştir.', 'Oğlu Cafer Güven babasının bu isteğini yerine getirmek için 16.08.2004 tarihinde Ali Güven Otelcilik ve Turizm Meslek Lisesi Uygulama Otelini yaptırmıştır.');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `home_hero`
--

CREATE TABLE `home_hero` (
  `id` int(11) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `home_hero`
--

INSERT INTO `home_hero` (`id`, `image_url`, `title`, `description`) VALUES
(1, 'https://aliguvenotel.vercel.app/assets/images/saloon_2.jpg', 'Şehrin Kalbinde Huzurlu Bir Mola', 'Eskişehir''in misafirperverliğini Ali Güven Uygulama Oteli''nde keşfedin. Modern konfor ve kusursuz hizmet anlayışıyla sizi bekliyoruz.'),
(2, 'https://aliguvenotel.vercel.app/assets/images/saloon_2.jpg', 'Geleceğin Turizmcileriyle Tanışın', 'Genç yeteneklerin enerjisi ve profesyonel eğitmenlerin tecrübesiyle harmanlanmış, samimi bir konaklama deneyimine davetlisiniz.'),
(3, 'https://aliguvenotel.vercel.app/assets/images/saloon_2.jpg', 'Eskişehir Yolculuğunuz Burada Başlar', 'Tepebaşı''nın merkezinde, ulaşım kolaylığı ve ev sıcaklığındaki odalarımızla seyahatlerinizi keyfe dönüştürüyoruz.');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `page_banners`
--

CREATE TABLE `page_banners` (
  `id` int(11) NOT NULL,
  `page_key` varchar(50) NOT NULL,
  `top_title` varchar(255) DEFAULT NULL,
  `page_title` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `page_banners`
--

INSERT INTO `page_banners` (`id`, `page_key`, `top_title`, `page_title`, `image_url`) VALUES
(1, 'rooms', 'Konaklama', 'Oda ve Süitlerimiz', 'https://aliguvenotel.vercel.app/assets/images/room_1.jpg'),
(2, 'room-detail', 'Oda Detayı', 'Konforlu Konaklama', 'https://aliguvenotel.vercel.app/assets/images/room_1.jpg'),
(3, 'restaurant', 'Gastronomi', 'Restoranımız', 'https://aliguvenotel.vercel.app/assets/images/restaurant.jpg'),
(4, 'events', 'Organizasyon', 'Düğün & Davet', 'https://aliguvenotel.vercel.app/assets/images/saloon_1.jpg'),
(5, 'contact', 'Bize Ulaşın', 'İletişim', 'https://aliguvenotel.vercel.app/assets/images/room_1.jpg');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `restaurant_images`
--

CREATE TABLE `restaurant_images` (
  `id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `restaurant_images`
--

INSERT INTO `restaurant_images` (`id`, `image_url`) VALUES
(1, 'https://aliguvenotel.vercel.app/assets/images/room_1.jpg'),
(2, 'https://aliguvenotel.vercel.app/assets/images/room_2.jpg'),
(3, 'https://aliguvenotel.vercel.app/assets/images/restaurant.jpg');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `restaurant_info`
--

CREATE TABLE `restaurant_info` (
  `id` int(11) NOT NULL,
  `intro_text` text DEFAULT NULL,
  `warning_text` text DEFAULT NULL,
  `menu_pdf_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `restaurant_info`
--

INSERT INTO `restaurant_info` (`id`, `intro_text`, `warning_text`, `menu_pdf_url`) VALUES
(1, 'Restoranımız tüm misafirlerimize hizmet vermektedir. Haftanın tüm günleri açık büfe kahvaltı servisimiz, hafta içi ise aylık oluşturduğumuz özel menülerimizle öğle yemeği hizmeti vermekteyiz. Gruplar ve özel davetler için menü içeriğini belirleyerek akşam yemeği servisimiz de bulunmaktadır.', 'Servis saatlerimiz 11.30 & 13.30 arasındadır ve menülerimizde değişiklik olabilir.', 'https://aliguvenotel.vercel.app/assets/files/nisan-ayi-menu.pdf');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `amenities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`amenities`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `rooms`
--

INSERT INTO `rooms` (`id`, `title`, `description`, `amenities`) VALUES
(1, 'Standart Oda', 'Konforlu ve ekonomik bir konaklama deneyimi sunan standart odalarımız...', '["TV", "Ücretsiz Wi-Fi", "7/24 Sıcak Su", "Saç Kurutma Makinesi", "Minibar"]'),
(2, 'Süit Oda', 'Daha geniş bir yaşam alanı ve ekstra konfor arayan misafirlerimiz için...', '["Oturma Grubu", "Klima", "Geniş Balkon", "Smart TV", "Ücretsiz Wi-Fi", "Kettle Seti"]');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `room_images`
--

CREATE TABLE `room_images` (
  `id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_main` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `room_images`
--

INSERT INTO `room_images` (`id`, `room_id`, `image_url`, `is_main`) VALUES
(1, 1, 'https://aliguvenotel.vercel.app/assets/images/room_1.jpg', 1),
(2, 1, 'https://aliguvenotel.vercel.app/assets/images/room_2.jpg', 0),
(3, 1, 'https://aliguvenotel.vercel.app/assets/images/restaurant.jpg', 0),
(4, 2, 'https://aliguvenotel.vercel.app/assets/images/room_1.jpg', 1),
(5, 2, 'https://aliguvenotel.vercel.app/assets/images/room_2.jpg', 0),
(6, 2, 'https://aliguvenotel.vercel.app/assets/images/restaurant.jpg', 0);

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `contact_info`
--
ALTER TABLE `contact_info`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `event_images`
--
ALTER TABLE `event_images`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `event_space`
--
ALTER TABLE `event_space`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `home_counters`
--
ALTER TABLE `home_counters`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `home_features`
--
ALTER TABLE `home_features`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `home_founder`
--
ALTER TABLE `home_founder`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `home_hero`
--
ALTER TABLE `home_hero`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `page_banners`
--
ALTER TABLE `page_banners`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `page_key` (`page_key`);

--
-- Tablo için indeksler `restaurant_images`
--
ALTER TABLE `restaurant_images`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `restaurant_info`
--
ALTER TABLE `restaurant_info`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `room_images`
--
ALTER TABLE `room_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `contact_info`
--
ALTER TABLE `contact_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tablo için AUTO_INCREMENT değeri `event_images`
--
ALTER TABLE `event_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `event_space`
--
ALTER TABLE `event_space`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tablo için AUTO_INCREMENT değeri `home_counters`
--
ALTER TABLE `home_counters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Tablo için AUTO_INCREMENT değeri `home_features`
--
ALTER TABLE `home_features`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `home_founder`
--
ALTER TABLE `home_founder`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tablo için AUTO_INCREMENT değeri `home_hero`
--
ALTER TABLE `home_hero`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `page_banners`
--
ALTER TABLE `page_banners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Tablo için AUTO_INCREMENT değeri `restaurant_images`
--
ALTER TABLE `restaurant_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `restaurant_info`
--
ALTER TABLE `restaurant_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tablo için AUTO_INCREMENT değeri `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Tablo için AUTO_INCREMENT değeri `room_images`
--
ALTER TABLE `room_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `room_images`
--
ALTER TABLE `room_images`
  ADD CONSTRAINT `room_images_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
