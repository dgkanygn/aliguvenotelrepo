<?php

class HomeOverviewController
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    /**
     * GET /home-overview
     * Genel bakış bilgisini getir.
     */
    public function show()
    {
        try {
            $stmt = $this->db->query("SELECT * FROM home_overview LIMIT 1");
            $item = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$item) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "İçerik bulunamadı."]);
                return;
            }

            // feature_list JSON formatında tutuluyor olabilir, array olarak parse edelim
            if (!empty($item['feature_list'])) {
                $item['feature_list'] = json_decode($item['feature_list'], true);
            }

            http_response_code(200);
            echo json_encode(["success" => true, "data" => $item]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }

    /**
     * PUT /home-overview/{id}
     * Sadece güncelleme.
     */
    public function update($id)
    {
        try {
            $checkStmt = $this->db->prepare("SELECT id FROM home_overview WHERE id = :id");
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();

            if (!$checkStmt->fetch()) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "İçerik bulunamadı."]);
                return;
            }

            $data = json_decode(file_get_contents("php://input"), true);
            
            $featureList = isset($data['feature_list']) ? json_encode($data['feature_list'], JSON_UNESCAPED_UNICODE) : '[]';

            $stmt = $this->db->prepare("UPDATE home_overview SET image_url = :image_url, tagline = :tagline, title = :title, summary = :summary, feature_list = :feature_list WHERE id = :id");
            $stmt->bindParam(':image_url', $data['image_url']);
            $stmt->bindParam(':tagline', $data['tagline']);
            $stmt->bindParam(':title', $data['title']);
            $stmt->bindParam(':summary', $data['summary']);
            $stmt->bindParam(':feature_list', $featureList);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            // Güncellenmiş veriyi döndür
            $stmt = $this->db->prepare("SELECT * FROM home_overview WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $updated = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!empty($updated['feature_list'])) {
                $updated['feature_list'] = json_decode($updated['feature_list'], true);
            }

            http_response_code(200);
            echo json_encode(["success" => true, "data" => $updated]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }
}
