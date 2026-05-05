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
            
            if ($info && isset($info['sample_menu']) && is_string($info['sample_menu'])) {
                $info['sample_menu'] = json_decode($info['sample_menu'], true);
            }

            // menu_pdf_url alanlarını JSON olarak decode et
            if ($info && isset($info['menu_pdf_url']) && is_string($info['menu_pdf_url'])) {
                $decoded = json_decode($info['menu_pdf_url'], true);
                if ($decoded !== null) {
                    $info['menu_pdf_url'] = $decoded;
                } else {
                    // Eski format (düz URL) için geriye uyumluluk
                    $info['menu_pdf_url'] = ['title' => '', 'url' => $info['menu_pdf_url']];
                }
            }
            if ($info && isset($info['menu_pdf_url_2']) && is_string($info['menu_pdf_url_2'])) {
                $decoded = json_decode($info['menu_pdf_url_2'], true);
                if ($decoded !== null) {
                    $info['menu_pdf_url_2'] = $decoded;
                } else {
                    $info['menu_pdf_url_2'] = ['title' => '', 'url' => $info['menu_pdf_url_2']];
                }
            }

            $imgStmt = $this->db->query("SELECT * FROM restaurant_images ORDER BY sort_order ASC, id ASC");
            $images = $imgStmt->fetchAll();

            http_response_code(200);
            echo json_encode([
                "success" => true,
                "data" => [
                    "restaurant_info" => $info,
                    "restaurant_images" => $images
                ]
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
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

            // menu_pdf_url alanlarını JSON string olarak kaydet
            $menuPdfUrl1 = null;
            if (isset($data['menu_pdf_url'])) {
                $menuPdfUrl1 = is_array($data['menu_pdf_url'])
                    ? json_encode($data['menu_pdf_url'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
                    : $data['menu_pdf_url'];
            }
            $menuPdfUrl2 = null;
            if (isset($data['menu_pdf_url_2'])) {
                $menuPdfUrl2 = is_array($data['menu_pdf_url_2'])
                    ? json_encode($data['menu_pdf_url_2'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
                    : $data['menu_pdf_url_2'];
            }

            $stmt = $this->db->prepare("UPDATE restaurant_info SET intro_text = :intro_text, warning_text = :warning_text, menu_pdf_url = :menu_pdf_url, menu_pdf_url_2 = :menu_pdf_url_2, sample_menu = :sample_menu WHERE id = :id");
            $stmt->bindParam(':intro_text', $data['intro_text']);
            $stmt->bindParam(':warning_text', $data['warning_text']);
            $stmt->bindParam(':menu_pdf_url', $menuPdfUrl1);
            $stmt->bindParam(':menu_pdf_url_2', $menuPdfUrl2);
            
            $sample_menu = null;
            if (isset($data['sample_menu'])) {
                $sample_menu = is_array($data['sample_menu']) || is_object($data['sample_menu']) 
                    ? json_encode($data['sample_menu'], JSON_UNESCAPED_UNICODE) 
                    : $data['sample_menu'];
            }
            $stmt->bindParam(':sample_menu', $sample_menu);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            if (isset($data['restaurant_images']) && is_array($data['restaurant_images'])) {
                // Mevcut resimleri sil
                $this->db->query("DELETE FROM restaurant_images");
                
                // Yeni resimleri ekle
                if (!empty($data['restaurant_images'])) {
                    $insertStmt = $this->db->prepare("INSERT INTO restaurant_images (image_url, sort_order) VALUES (:url, :sort_order)");
                    foreach ($data['restaurant_images'] as $index => $imgObj) {
                        $url = isset($imgObj['image_url']) ? $imgObj['image_url'] : (isset($imgObj['url']) ? $imgObj['url'] : $imgObj);
                        $sortOrder = is_array($imgObj) ? ($imgObj['sort_order'] ?? $index) : $index;
                        $insertStmt->bindParam(':url', $url);
                        $insertStmt->bindParam(':sort_order', $sortOrder);
                        $insertStmt->execute();
                    }
                }
            }

            // Güncellenmiş veriyi döndür
            $stmt = $this->db->prepare("SELECT * FROM restaurant_info WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $updatedInfo = $stmt->fetch();
            
            if ($updatedInfo && isset($updatedInfo['sample_menu']) && is_string($updatedInfo['sample_menu'])) {
                $updatedInfo['sample_menu'] = json_decode($updatedInfo['sample_menu'], true);
            }

            // menu_pdf_url alanlarını JSON olarak decode et
            if ($updatedInfo && isset($updatedInfo['menu_pdf_url']) && is_string($updatedInfo['menu_pdf_url'])) {
                $decoded = json_decode($updatedInfo['menu_pdf_url'], true);
                if ($decoded !== null) {
                    $updatedInfo['menu_pdf_url'] = $decoded;
                } else {
                    $updatedInfo['menu_pdf_url'] = ['title' => '', 'url' => $updatedInfo['menu_pdf_url']];
                }
            }
            if ($updatedInfo && isset($updatedInfo['menu_pdf_url_2']) && is_string($updatedInfo['menu_pdf_url_2'])) {
                $decoded = json_decode($updatedInfo['menu_pdf_url_2'], true);
                if ($decoded !== null) {
                    $updatedInfo['menu_pdf_url_2'] = $decoded;
                } else {
                    $updatedInfo['menu_pdf_url_2'] = ['title' => '', 'url' => $updatedInfo['menu_pdf_url_2']];
                }
            }

            $imgStmt = $this->db->query("SELECT * FROM restaurant_images ORDER BY sort_order ASC, id ASC");
            $updatedImages = $imgStmt->fetchAll();

            http_response_code(200);
            echo json_encode([
                "success" => true, 
                "data" => [
                    "restaurant_info" => $updatedInfo,
                    "restaurant_images" => $updatedImages
                ]
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }
}
