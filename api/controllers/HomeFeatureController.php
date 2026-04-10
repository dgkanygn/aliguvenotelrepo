<?php

class HomeFeatureController
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    /**
     * GET /home-features
     */
    public function index()
    {
        try {
            $stmt = $this->db->query("SELECT * FROM home_features ORDER BY id ASC");
            $data = $stmt->fetchAll();

            http_response_code(200);
            echo json_encode(["success" => true, "data" => $data]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }

    /**
     * GET /home-features/{id}
     */
    public function show($id)
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM home_features WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $item = $stmt->fetch();

            if (!$item) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Özellik bulunamadı."]);
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
     * POST /home-features
     */
    public function store()
    {
        try {
            $data = json_decode(file_get_contents("php://input"), true);

            $stmt = $this->db->prepare("INSERT INTO home_features (icon, title, description) VALUES (:icon, :title, :description)");
            $stmt->bindParam(':icon', $data['icon']);
            $stmt->bindParam(':title', $data['title']);
            $stmt->bindParam(':description', $data['description']);
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
     * PUT /home-features/{id}
     */
    public function update($id)
    {
        try {
            $checkStmt = $this->db->prepare("SELECT id FROM home_features WHERE id = :id");
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();

            if (!$checkStmt->fetch()) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Özellik bulunamadı."]);
                return;
            }

            $data = json_decode(file_get_contents("php://input"), true);

            $stmt = $this->db->prepare("UPDATE home_features SET icon = :icon, title = :title, description = :description WHERE id = :id");
            $stmt->bindParam(':icon', $data['icon']);
            $stmt->bindParam(':title', $data['title']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            $this->show($id);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }

    /**
     * DELETE /home-features/{id}
     */
    public function destroy($id)
    {
        try {
            $checkStmt = $this->db->prepare("SELECT id FROM home_features WHERE id = :id");
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();

            if (!$checkStmt->fetch()) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Özellik bulunamadı."]);
                return;
            }

            $stmt = $this->db->prepare("DELETE FROM home_features WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            http_response_code(200);
            echo json_encode(["success" => true, "message" => "Özellik başarıyla silindi."]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }
}
