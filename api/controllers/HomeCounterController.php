<?php

class HomeCounterController
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    /**
     * GET /home-counters
     */
    public function index()
    {
        try {
            $stmt = $this->db->query("SELECT * FROM home_counters ORDER BY id ASC");
            $data = $stmt->fetchAll();

            http_response_code(200);
            echo json_encode(["success" => true, "data" => $data]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }

    /**
     * GET /home-counters/{id}
     */
    public function show($id)
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM home_counters WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $item = $stmt->fetch();

            if (!$item) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Sayaç bulunamadı."]);
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
     * POST /home-counters
     */
    public function store()
    {
        try {
            $data = json_decode(file_get_contents("php://input"), true);

            $stmt = $this->db->prepare("INSERT INTO home_counters (icon, count, name) VALUES (:icon, :count, :name)");
            $stmt->bindParam(':icon', $data['icon']);
            $stmt->bindParam(':count', $data['count']);
            $stmt->bindParam(':name', $data['name']);
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
     * PUT /home-counters/{id}
     */
    public function update($id)
    {
        try {
            $checkStmt = $this->db->prepare("SELECT id FROM home_counters WHERE id = :id");
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();

            if (!$checkStmt->fetch()) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Sayaç bulunamadı."]);
                return;
            }

            $data = json_decode(file_get_contents("php://input"), true);

            $stmt = $this->db->prepare("UPDATE home_counters SET icon = :icon, count = :count, name = :name WHERE id = :id");
            $stmt->bindParam(':icon', $data['icon']);
            $stmt->bindParam(':count', $data['count']);
            $stmt->bindParam(':name', $data['name']);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            $this->show($id);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }

    /**
     * DELETE /home-counters/{id}
     */
    public function destroy($id)
    {
        try {
            $checkStmt = $this->db->prepare("SELECT id FROM home_counters WHERE id = :id");
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();

            if (!$checkStmt->fetch()) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Sayaç bulunamadı."]);
                return;
            }

            $stmt = $this->db->prepare("DELETE FROM home_counters WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            http_response_code(200);
            echo json_encode(["success" => true, "message" => "Sayaç başarıyla silindi."]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }
}
