<?php

class PageBannerController
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    /**
     * GET /page-banners
     */
    public function index()
    {
        try {
            $stmt = $this->db->query("SELECT * FROM page_banners ORDER BY id ASC");
            $items = $stmt->fetchAll();

            http_response_code(200);
            echo json_encode(["success" => true, "data" => $items]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }

    /**
     * GET /page-banners/{id}
     */
    public function show($id)
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM page_banners WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $item = $stmt->fetch();

            if (!$item) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Banner bulunamadı."]);
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
     * PUT /page-banners/{id}
     */
    public function update($id)
    {
        try {
            $checkStmt = $this->db->prepare("SELECT id FROM page_banners WHERE id = :id");
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();

            if (!$checkStmt->fetch()) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Banner bulunamadı."]);
                return;
            }

            $data = json_decode(file_get_contents("php://input"), true);

            $stmt = $this->db->prepare(
                "UPDATE page_banners SET 
                    top_title = :top_title, 
                    page_title = :page_title, 
                    image_url = :image_url
                WHERE id = :id"
            );

            $stmt->bindParam(':top_title', $data['top_title']);
            $stmt->bindParam(':page_title', $data['page_title']);
            $stmt->bindParam(':image_url', $data['image_url']);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            $stmt = $this->db->prepare("SELECT * FROM page_banners WHERE id = :id");
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

    // Fixed table: no create
    public function store()
    {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Bu tabloya yeni satır eklenemez."]);
    }

    // Fixed table: no delete
    public function destroy($id)
    {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Bu tablodan satır silinemez."]);
    }
}
