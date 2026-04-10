<?php

class HomeFounderController
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    /**
     * GET /home-founder
     * Kurucu bilgisini getir.
     */
    public function show()
    {
        try {
            $stmt = $this->db->query("SELECT * FROM home_founder LIMIT 1");
            $item = $stmt->fetch();

            if (!$item) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Kurucu bilgisi bulunamadı."]);
                return;
            }

            http_response_code(200);
            echo json_encode(["success" => true, "data" => $item]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }

    /**
     * PUT /home-founder/{id}
     * Sadece güncelleme (yeni ekleme veya silme yok).
     */
    public function update($id)
    {
        try {
            $checkStmt = $this->db->prepare("SELECT id FROM home_founder WHERE id = :id");
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();

            if (!$checkStmt->fetch()) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Kurucu bilgisi bulunamadı."]);
                return;
            }

            $data = json_decode(file_get_contents("php://input"), true);

            $stmt = $this->db->prepare("UPDATE home_founder SET image_url = :image_url, title = :title, content = :content, special_text = :special_text WHERE id = :id");
            $stmt->bindParam(':image_url', $data['image_url']);
            $stmt->bindParam(':title', $data['title']);
            $stmt->bindParam(':content', $data['content']);
            $stmt->bindParam(':special_text', $data['special_text']);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            // Güncellenmiş veriyi döndür
            $stmt = $this->db->prepare("SELECT * FROM home_founder WHERE id = :id");
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
