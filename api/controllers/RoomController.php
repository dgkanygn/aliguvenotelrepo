<?php

class RoomController
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    /**
     * GET /rooms
     * Tüm odaları listele (images dahil).
     */
    public function index()
    {
        try {
            $stmt = $this->db->query("SELECT * FROM rooms ORDER BY sort_order ASC, id ASC");
            $rooms = $stmt->fetchAll();

            foreach ($rooms as &$room) {
                $imgStmt = $this->db->prepare("SELECT * FROM room_images WHERE room_id = :room_id ORDER BY sort_order ASC, is_main DESC, id ASC");
                $imgStmt->bindParam(':room_id', $room['id']);
                $imgStmt->execute();
                $room['images'] = $imgStmt->fetchAll();

                if (!empty($room['amenities'])) {
                    $room['amenities'] = json_decode($room['amenities'], true);
                }
            }

            http_response_code(200);
            echo json_encode(["success" => true, "data" => $rooms]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }

    /**
     * GET /rooms/{id}
     * Tek oda getir.
     */
    public function show($id)
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM rooms WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $room = $stmt->fetch();

            if (!$room) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Oda bulunamadı."]);
                return;
            }

            // Images
            $imgStmt = $this->db->prepare("SELECT * FROM room_images WHERE room_id = :room_id ORDER BY sort_order ASC, is_main DESC, id ASC");
            $imgStmt->bindParam(':room_id', $id);
            $imgStmt->execute();
            $room['images'] = $imgStmt->fetchAll();

            if (!empty($room['amenities'])) {
                $room['amenities'] = json_decode($room['amenities'], true);
            }

            http_response_code(200);
            echo json_encode(["success" => true, "data" => $room]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }

    /**
     * POST /rooms
     * Yeni oda ekle.
     */
    public function store()
    {
        try {
            $data = json_decode(file_get_contents("php://input"), true);

            if (empty($data['title'])) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Oda başlığı gereklidir."]);
                return;
            }

            $stmt = $this->db->prepare("INSERT INTO rooms (title, description, amenities, sort_order) VALUES (:title, :description, :amenities, :sort_order)");
            $amenities = isset($data['amenities']) ? json_encode($data['amenities']) : '[]';
            $sortOrder = isset($data['sort_order']) ? (int)$data['sort_order'] : 0;
            $stmt->bindParam(':title', $data['title']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':amenities', $amenities);
            $stmt->bindParam(':sort_order', $sortOrder);
            $stmt->execute();

            $roomId = $this->db->lastInsertId();

            // Görseller ekle
            if (!empty($data['images']) && is_array($data['images'])) {
                $imgStmt = $this->db->prepare("INSERT INTO room_images (room_id, image_url, is_main, sort_order) VALUES (:room_id, :image_url, :is_main, :sort_order)");
                foreach ($data['images'] as $index => $image) {
                    $imageUrl = is_array($image) ? $image['image_url'] : $image;
                    $isMain = is_array($image) ? ($image['is_main'] ?? ($index === 0 ? 1 : 0)) : ($index === 0 ? 1 : 0);
                    $sortOrder = is_array($image) ? ($image['sort_order'] ?? $index) : $index;
                    $imgStmt->bindParam(':room_id', $roomId);
                    $imgStmt->bindParam(':image_url', $imageUrl);
                    $imgStmt->bindParam(':is_main', $isMain);
                    $imgStmt->bindParam(':sort_order', $sortOrder);
                    $imgStmt->execute();
                }
            }

            // Oluşturulan odayı döndür
            $this->show($roomId);
            http_response_code(201);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }

    /**
     * PUT /rooms/{id}
     * Oda güncelle.
     */
    public function update($id)
    {
        try {
            // Mevcut oda kontrolü
            $checkStmt = $this->db->prepare("SELECT id FROM rooms WHERE id = :id");
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();

            if (!$checkStmt->fetch()) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Oda bulunamadı."]);
                return;
            }

            $data = json_decode(file_get_contents("php://input"), true);

            $stmt = $this->db->prepare("UPDATE rooms SET title = :title, description = :description, amenities = :amenities, sort_order = :sort_order WHERE id = :id");
            $amenities = isset($data['amenities']) ? json_encode($data['amenities']) : '[]';
            $sortOrder = isset($data['sort_order']) ? (int)$data['sort_order'] : 0;
            $stmt->bindParam(':title', $data['title']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':amenities', $amenities);
            $stmt->bindParam(':sort_order', $sortOrder);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            // Görseller güncelle (eski sil, yeni ekle)
            if (isset($data['images']) && is_array($data['images'])) {
                $delStmt = $this->db->prepare("DELETE FROM room_images WHERE room_id = :room_id");
                $delStmt->bindParam(':room_id', $id);
                $delStmt->execute();

                $imgStmt = $this->db->prepare("INSERT INTO room_images (room_id, image_url, is_main, sort_order) VALUES (:room_id, :image_url, :is_main, :sort_order)");
                foreach ($data['images'] as $index => $image) {
                    $imageUrl = is_array($image) ? $image['image_url'] : $image;
                    $isMain = is_array($image) ? ($image['is_main'] ?? ($index === 0 ? 1 : 0)) : ($index === 0 ? 1 : 0);
                    $sortOrder = is_array($image) ? ($image['sort_order'] ?? $index) : $index;
                    $imgStmt->bindParam(':room_id', $id);
                    $imgStmt->bindParam(':image_url', $imageUrl);
                    $imgStmt->bindParam(':is_main', $isMain);
                    $imgStmt->bindParam(':sort_order', $sortOrder);
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
     * DELETE /rooms/{id}
     * Oda sil (ilişkili görseller CASCADE ile silinir).
     */
    public function destroy($id)
    {
        try {
            $checkStmt = $this->db->prepare("SELECT id FROM rooms WHERE id = :id");
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();

            if (!$checkStmt->fetch()) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Oda bulunamadı."]);
                return;
            }

            $stmt = $this->db->prepare("DELETE FROM rooms WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            http_response_code(200);
            echo json_encode(["success" => true, "message" => "Oda başarıyla silindi."]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }
}
