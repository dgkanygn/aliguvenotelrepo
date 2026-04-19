<?php

class ContactController
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    /**
     * GET /company-contacts
     * İletişim bilgilerini getir.
     */
    public function show()
    {
        try {
            $stmt = $this->db->query("SELECT * FROM company_contacts LIMIT 1");
            $item = $stmt->fetch();

            if (!$item) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "İletişim bilgisi bulunamadı."]);
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
     * PUT /company-contacts/{id}
     * Sadece güncelleme (yeni ekleme veya silme yok).
     */
    public function update($id)
    {
        try {
            $checkStmt = $this->db->prepare("SELECT id FROM company_contacts WHERE id = :id");
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();

            if (!$checkStmt->fetch()) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "İletişim bilgisi bulunamadı."]);
                return;
            }

            $data = json_decode(file_get_contents("php://input"), true);

            $stmt = $this->db->prepare(
                "UPDATE company_contacts SET 
                    address = :address, 
                    landline_phone = :landline_phone, 
                    mobile_phone = :mobile_phone, 
                    whatsapp_number = :whatsapp_number,
                    accommodation_phone = :accommodation_phone,
                    organization_phone = :organization_phone,
                    email = :email, 
                    fax = :fax, 
                    instagram = :instagram, 
                    facebook = :facebook, 
                    twitter = :twitter, 
                    linkedin = :linkedin, 
                    pinterest = :pinterest, 
                    youtube = :youtube,
                    site_description = :site_description
                WHERE id = :id"
            );

            $stmt->bindParam(':address', $data['address']);
            $stmt->bindParam(':landline_phone', $data['landline_phone']);
            $stmt->bindParam(':mobile_phone', $data['mobile_phone']);
            $stmt->bindParam(':whatsapp_number', $data['whatsapp_number']);
            $stmt->bindParam(':accommodation_phone', $data['accommodation_phone']);
            $stmt->bindParam(':organization_phone', $data['organization_phone']);
            $stmt->bindParam(':email', $data['email']);
            $stmt->bindParam(':fax', $data['fax']);
            $stmt->bindParam(':instagram', $data['instagram']);
            $stmt->bindParam(':facebook', $data['facebook']);
            $stmt->bindParam(':twitter', $data['twitter']);
            $stmt->bindParam(':linkedin', $data['linkedin']);
            $stmt->bindParam(':pinterest', $data['pinterest']);
            $stmt->bindParam(':youtube', $data['youtube']);
            $stmt->bindParam(':site_description', $data['site_description']);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            // Güncellenmiş veriyi döndür
            $stmt = $this->db->prepare("SELECT * FROM company_contacts WHERE id = :id");
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
