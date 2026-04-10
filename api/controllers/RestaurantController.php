<?php

class RestaurantController
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    /**
     * GET /restaurant-info
     * Restaurant bilgisini getir.
     */
    public function show()
    {
        try {
            $stmt = $this->db->query("SELECT * FROM restaurant_info LIMIT 1");
            $info = $stmt->fetch();

            $imgStmt = $this->db->query("SELECT * FROM restaurant_images ORDER BY id ASC");
            $images = $imgStmt->fetchAll();

            http_response_code(200);
            echo json_encode([
                "success" => true,
                "data" => [
                    "restaurant_info" => $info,
                    "restaurant_images" => $images
                ]
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }

    /**
     * PUT /restaurant-page/{id}
     * Sadece güncelleme (yeni ekleme veya silme yok).
     */
    public function update($id)
    {
        try {
            $checkStmt = $this->db->prepare("SELECT id FROM restaurant_info WHERE id = :id");
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();

            if (!$checkStmt->fetch()) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Restoran bilgisi bulunamadı."]);
                return;
            }

            $data = json_decode(file_get_contents("php://input"), true);

            $stmt = $this->db->prepare("UPDATE restaurant_info SET intro_text = :intro_text, warning_text = :warning_text, menu_pdf_url = :menu_pdf_url WHERE id = :id");
            $stmt->bindParam(':intro_text', $data['intro_text']);
            $stmt->bindParam(':warning_text', $data['warning_text']);
            $stmt->bindParam(':menu_pdf_url', $data['menu_pdf_url']);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            // Güncellenmiş veriyi döndür
            $stmt = $this->db->prepare("SELECT * FROM restaurant_info WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $updated = $stmt->fetch();

            http_response_code(200);
            echo json_encode(["success" => true, "data" => $updated]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }
}
