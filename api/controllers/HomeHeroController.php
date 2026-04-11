<?php

class HomeHeroController
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    /**
     * GET /home-hero
     */
    public function index()
    {
        try {
            $stmt = $this->db->query("SELECT * FROM home_hero ORDER BY id ASC");
            $data = $stmt->fetchAll();

            http_response_code(200);
            echo json_encode(["success" => true, "data" => $data]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }

    /**
     * GET /home-hero/{id}
     */
    public function show($id)
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM home_hero WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $item = $stmt->fetch();

            if (!$item) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Hero bulunamadı."]);
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
     * POST /home-hero
     */
    public function store()
    {
        try {
            $data = json_decode(file_get_contents("php://input"), true) ?? [];

            $imageUrl = $data['image_url'] ?? null;
            $title = $data['title'] ?? null;
            $description = $data['description'] ?? null;

            $stmt = $this->db->prepare("INSERT INTO home_hero (image_url, title, description) VALUES (:image_url, :title, :description)");
            $stmt->bindParam(':image_url', $imageUrl);
            $stmt->bindParam(':title', $title);
            $stmt->bindParam(':description', $description);
            $stmt->execute();

            $newId = $this->db->lastInsertId();

            http_response_code(201);
            $this->show($newId);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }

    /**
     * PUT|POST /home-hero/{id}
     */
    public function update($id)
    {
        try {
            $checkStmt = $this->db->prepare("SELECT * FROM home_hero WHERE id = :id");
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();
            $oldItem = $checkStmt->fetch(PDO::FETCH_ASSOC);

            if (!$oldItem) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Hero bulunamadı."]);
                return;
            }

            $data = json_decode(file_get_contents("php://input"), true) ?? [];

            $imageUrl = $data['image_url'] ?? $oldItem['image_url'];
            $title = $data['title'] ?? $oldItem['title'];
            $description = $data['description'] ?? $oldItem['description'];

            $stmt = $this->db->prepare("UPDATE home_hero SET image_url = :image_url, title = :title, description = :description WHERE id = :id");
            $stmt->bindParam(':image_url', $imageUrl);
            $stmt->bindParam(':title', $title);
            $stmt->bindParam(':description', $description);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            $this->show($id);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }

    /**
     * DELETE /home-hero/{id}
     */
    public function destroy($id)
    {
        try {
            $checkStmt = $this->db->prepare("SELECT id FROM home_hero WHERE id = :id");
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();

            if (!$checkStmt->fetch()) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Hero bulunamadı."]);
                return;
            }

            $stmt = $this->db->prepare("DELETE FROM home_hero WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            http_response_code(200);
            echo json_encode(["success" => true, "message" => "Hero başarıyla silindi."]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }
}
