<?php

class PageController
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    /**
     * Ortak page_banners çekme fonksiyonu.
     * Rota adından '-page' kısmını çıkararak page_key oluşturur.
     */
    private function getPageBanners($pageKey)
    {
        $stmt = $this->db->prepare("SELECT * FROM page_banners WHERE page_key = :page_key");
        $stmt->bindParam(':page_key', $pageKey);
        $stmt->execute();
        return $stmt->fetch() ?: null;
    }

    /**
     * GET /home-page
     * Tablolar: home_hero, home_counters, home_founder, home_features
     */
    public function homePage()
    {
        try {
            $banner = $this->getPageBanners('home');

            // home_hero
            $stmt = $this->db->query("SELECT * FROM home_hero ORDER BY id ASC");
            $homeHero = $stmt->fetchAll();

            // home_overview
            $stmt = $this->db->query("SELECT * FROM home_overview LIMIT 1");
            $homeOverview = $stmt->fetch(\PDO::FETCH_ASSOC) ?: null;
            if ($homeOverview && !empty($homeOverview['feature_list'])) {
                $homeOverview['feature_list'] = json_decode($homeOverview['feature_list'], true);
            }

            // home_counters
            $stmt = $this->db->query("SELECT * FROM home_counters ORDER BY id ASC");
            $homeCounters = $stmt->fetchAll();

            // home_founder
            $stmt = $this->db->query("SELECT * FROM home_founder LIMIT 1");
            $homeFounder = $stmt->fetch() ?: null;

            // home_features
            $stmt = $this->db->query("SELECT * FROM home_features ORDER BY id ASC");
            $homeFeatures = $stmt->fetchAll();

            http_response_code(200);
            echo json_encode([
                "success" => true,
                "data" => [
                    "page_banner" => $banner,
                    "home_hero" => $homeHero,
                    "home_overview" => $homeOverview,
                    "home_counters" => $homeCounters,
                    "home_founder" => $homeFounder,
                    "home_features" => $homeFeatures
                ]
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }
    }

    /**
     * GET /rooms-page
     * Tablolar: rooms, room_images
     */
    public function roomsPage()
    {
        try {
            $banner = $this->getPageBanners('rooms');

            // rooms with their images
            $stmt = $this->db->query("SELECT * FROM rooms ORDER BY id ASC");
            $rooms = $stmt->fetchAll();

            foreach ($rooms as &$room) {
                $imgStmt = $this->db->prepare("SELECT * FROM room_images WHERE room_id = :room_id ORDER BY is_main DESC, id ASC");
                $imgStmt->bindParam(':room_id', $room['id']);
                $imgStmt->execute();
                $room['images'] = $imgStmt->fetchAll();

                // amenities JSON parse
                if (!empty($room['amenities'])) {
                    $room['amenities'] = json_decode($room['amenities'], true);
                }
            }

            http_response_code(200);
            echo json_encode([
                "success" => true,
                "data" => [
                    "page_banner" => $banner,
                    "rooms" => $rooms
                ]
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }
    }

    /**
     * GET /restaurant-page
     * Tablolar: restaurant_info, restaurant_images
     */
    public function restaurantPage()
    {
        try {
            $banner = $this->getPageBanners('restaurant');

            // restaurant_info
            $stmt = $this->db->query("SELECT * FROM restaurant_info LIMIT 1");
            $restaurantInfo = $stmt->fetch() ?: null;

            // restaurant_images
            $stmt = $this->db->query("SELECT * FROM restaurant_images ORDER BY id ASC");
            $restaurantImages = $stmt->fetchAll();

            http_response_code(200);
            echo json_encode([
                "success" => true,
                "data" => [
                    "page_banner" => $banner,
                    "restaurant_info" => $restaurantInfo,
                    "restaurant_images" => $restaurantImages
                ]
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }
    }

    /**
     * GET /events-page
     * Tablolar: saloons, saloon_images
     */
    public function eventsPage()
    {
        try {
            $banner = $this->getPageBanners('events');

            // saloons with their images
            $stmt = $this->db->query("SELECT * FROM saloons WHERE category_keys LIKE '%\"events\"%' ORDER BY id ASC");
            $saloons = $stmt->fetchAll();

            foreach ($saloons as &$saloon) {
                $imgStmt = $this->db->prepare("SELECT * FROM saloon_images WHERE saloon_id = :saloon_id ORDER BY is_main DESC, id ASC");
                $imgStmt->bindParam(':saloon_id', $saloon['id']);
                $imgStmt->execute();
                $saloon['images'] = $imgStmt->fetchAll();

                // amenities ve category_keys JSON parse
                if (!empty($saloon['amenities'])) {
                    $saloon['amenities'] = json_decode($saloon['amenities'], true);
                }
                if (!empty($saloon['category_keys'])) {
                    $saloon['category_keys'] = json_decode($saloon['category_keys'], true);
                }
            }

            http_response_code(200);
            echo json_encode([
                "success" => true,
                "data" => [
                    "page_banner" => $banner,
                    "saloons" => $saloons
                ]
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }
    }

    /**
     * GET /meetings-page
     * Tablolar: saloons, saloon_images
     */
    public function meetingsPage()
    {
        try {
            $banner = $this->getPageBanners('meetings');

            // saloons with their images
            $stmt = $this->db->query("SELECT * FROM saloons WHERE category_keys LIKE '%\"meetings\"%' ORDER BY id ASC");
            $saloons = $stmt->fetchAll();

            foreach ($saloons as &$saloon) {
                $imgStmt = $this->db->prepare("SELECT * FROM saloon_images WHERE saloon_id = :saloon_id ORDER BY is_main DESC, id ASC");
                $imgStmt->bindParam(':saloon_id', $saloon['id']);
                $imgStmt->execute();
                $saloon['images'] = $imgStmt->fetchAll();

                // amenities ve category_keys JSON parse
                if (!empty($saloon['amenities'])) {
                    $saloon['amenities'] = json_decode($saloon['amenities'], true);
                }
                if (!empty($saloon['category_keys'])) {
                    $saloon['category_keys'] = json_decode($saloon['category_keys'], true);
                }
            }

            http_response_code(200);
            echo json_encode([
                "success" => true,
                "data" => [
                    "page_banner" => $banner,
                    "saloons" => $saloons
                ]
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }
    }

    /**
     * GET /contact-page
     * Tablolar: company_contacts
     */
    public function contactPage()
    {
        try {
            $banner = $this->getPageBanners('contact');

            // company_contacts
            $stmt = $this->db->query("SELECT * FROM company_contacts LIMIT 1");
            $contacts = $stmt->fetch() ?: null;

            http_response_code(200);
            echo json_encode([
                "success" => true,
                "data" => [
                    "page_banner" => $banner,
                    "company_contacts" => $contacts
                ]
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }
    }
}
