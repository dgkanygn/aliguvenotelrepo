<?php

class NavigationController
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function getMenus()
    {
        try {
            // Odaları id ve title ile çek
            $queryRooms = "SELECT id, title FROM rooms ORDER BY id ASC";
            $stmtRooms = $this->db->prepare($queryRooms);
            $stmtRooms->execute();
            $rooms = $stmtRooms->fetchAll(PDO::FETCH_ASSOC);

            // Salonları id, title ve category_keys ile çek
            $querySaloons = "SELECT id, title, category_keys FROM saloons ORDER BY id ASC";
            $stmtSaloons = $this->db->prepare($querySaloons);
            $stmtSaloons->execute();
            $saloons = $stmtSaloons->fetchAll(PDO::FETCH_ASSOC);

            foreach ($saloons as &$saloon) {
                if (!empty($saloon['category_keys'])) {
                    $saloon['category_keys'] = json_decode($saloon['category_keys'], true);
                }
            }

            // Site logosunu çek
            $queryLogo = "SELECT site_logo FROM company_contacts LIMIT 1";
            $stmtLogo = $this->db->prepare($queryLogo);
            $stmtLogo->execute();
            $logoData = $stmtLogo->fetch(PDO::FETCH_ASSOC);

            http_response_code(200);
            echo json_encode([
                "success" => true,
                "data" => [
                    "rooms" => $rooms,
                    "saloons" => $saloons,
                    "site_logo" => $logoData['site_logo'] ?? null
                ]
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Veritabanı hatası: " . $e->getMessage()], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }
    }
}
