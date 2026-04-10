<?php

class SaloonController
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    /**
     * GET /saloons
     * Tüm salonları listele (images dahil).
     */
    public function index()
    {
        try {
            $stmt = $this->db->query("SELECT * FROM saloons ORDER BY id ASC");
            $saloons = $stmt->fetchAll();

            foreach ($saloons as &$saloon) {
                $imgStmt = $this->db->prepare("SELECT * FROM saloon_images WHERE saloon_id = :saloon_id ORDER BY is_main DESC, id ASC");
                $imgStmt->bindParam(':saloon_id', $saloon['id']);
                $imgStmt->execute();
                $saloon['images'] = $imgStmt->fetchAll();

                if (!empty($saloon['amenities'])) {
                    $saloon['amenities'] = json_decode($saloon['amenities'], true);
                }
            }

            http_response_code(200);
            echo json_encode(["success" => true, "data" => $saloons]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }

    /**
     * GET /saloons/{id}
     * Tek salon getir.
     */
    public function show($id)
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM saloons WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $saloon = $stmt->fetch();

            if (!$saloon) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Salon bulunamadı."]);
                return;
            }

            // Images
            $imgStmt = $this->db->prepare("SELECT * FROM saloon_images WHERE saloon_id = :saloon_id ORDER BY is_main DESC, id ASC");
            $imgStmt->bindParam(':saloon_id', $id);
            $imgStmt->execute();
            $saloon['images'] = $imgStmt->fetchAll();

            if (!empty($saloon['amenities'])) {
                $saloon['amenities'] = json_decode($saloon['amenities'], true);
            }

            http_response_code(200);
            echo json_encode(["success" => true, "data" => $saloon]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }

    /**
     * POST /saloons
     * Yeni salon ekle.
     */
    public function store()
    {
        try {
            $data = json_decode(file_get_contents("php://input"), true);

            if (empty($data['title'])) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Salon başlığı gereklidir."]);
                return;
            }

            $stmt = $this->db->prepare("INSERT INTO saloons (title, description, amenities) VALUES (:title, :description, :amenities)");
            $amenities = isset($data['amenities']) ? json_encode($data['amenities']) : '[]';
            $stmt->bindParam(':title', $data['title']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':amenities', $amenities);
            $stmt->execute();

            $saloonId = $this->db->lastInsertId();

            // Görseller ekle
            if (!empty($data['images']) && is_array($data['images'])) {
                $imgStmt = $this->db->prepare("INSERT INTO saloon_images (saloon_id, image_url, is_main) VALUES (:saloon_id, :image_url, :is_main)");
                foreach ($data['images'] as $index => $image) {
                    $imageUrl = is_array($image) ? $image['image_url'] : $image;
                    $isMain = is_array($image) ? ($image['is_main'] ?? ($index === 0 ? 1 : 0)) : ($index === 0 ? 1 : 0);
                    $imgStmt->bindParam(':saloon_id', $saloonId);
                    $imgStmt->bindParam(':image_url', $imageUrl);
                    $imgStmt->bindParam(':is_main', $isMain);
                    $imgStmt->execute();
                }
            }

            $this->show($saloonId);
            http_response_code(201);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }

    /**
     * PUT /saloons/{id}
     * Salon güncelle.
     */
    public function update($id)
    {
        try {
            $checkStmt = $this->db->prepare("SELECT id FROM saloons WHERE id = :id");
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();

            if (!$checkStmt->fetch()) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Salon bulunamadı."]);
                return;
            }

            $data = json_decode(file_get_contents("php://input"), true);

            $stmt = $this->db->prepare("UPDATE saloons SET title = :title, description = :description, amenities = :amenities WHERE id = :id");
            $amenities = isset($data['amenities']) ? json_encode($data['amenities']) : '[]';
            $stmt->bindParam(':title', $data['title']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':amenities', $amenities);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            // Görseller güncelle
            if (isset($data['images']) && is_array($data['images'])) {
                $delStmt = $this->db->prepare("DELETE FROM saloon_images WHERE saloon_id = :saloon_id");
                $delStmt->bindParam(':saloon_id', $id);
                $delStmt->execute();

                $imgStmt = $this->db->prepare("INSERT INTO saloon_images (saloon_id, image_url, is_main) VALUES (:saloon_id, :image_url, :is_main)");
                foreach ($data['images'] as $index => $image) {
                    $imageUrl = is_array($image) ? $image['image_url'] : $image;
                    $isMain = is_array($image) ? ($image['is_main'] ?? ($index === 0 ? 1 : 0)) : ($index === 0 ? 1 : 0);
                    $imgStmt->bindParam(':saloon_id', $id);
                    $imgStmt->bindParam(':image_url', $imageUrl);
                    $imgStmt->bindParam(':is_main', $isMain);
                    $imgStmt->execute();
                }
            }

            $this->show($id);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }

    /**
     * DELETE /saloons/{id}
     * Salon sil.
     */
    public function destroy($id)
    {
        try {
            $checkStmt = $this->db->prepare("SELECT id FROM saloons WHERE id = :id");
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();

            if (!$checkStmt->fetch()) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Salon bulunamadı."]);
                return;
            }

            // Önce ilişkili görselleri sil
            $delImages = $this->db->prepare("DELETE FROM saloon_images WHERE saloon_id = :saloon_id");
            $delImages->bindParam(':saloon_id', $id);
            $delImages->execute();

            $stmt = $this->db->prepare("DELETE FROM saloons WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            http_response_code(200);
            echo json_encode(["success" => true, "message" => "Salon başarıyla silindi."]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }
}
