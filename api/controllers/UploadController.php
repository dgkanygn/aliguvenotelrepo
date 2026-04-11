<?php

class UploadController
{
    /**
     * POST /upload
     */
    public function store()
    {
        try {
            require_once __DIR__ . '/../utils/FileUpload.php';

            if (!isset($_FILES['file']) && !isset($_FILES['files'])) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Dosya bulunamadı. Lütfen 'file' veya 'files[]' anahtarı ile gönderin."]);
                return;
            }

            // Gelen folder bilgisi (yoksa general olur)
            $folder = isset($_POST['folder']) ? $_POST['folder'] : 'general';

            $uploadedUrls = [];

            // Çoklu yükleme desteği (files[])
            if (isset($_FILES['files']) && is_array($_FILES['files']['name'])) {
                $files = $_FILES['files'];
                $count = count($files['name']);
                for ($i = 0; $i < $count; $i++) {
                    if ($files['error'][$i] !== UPLOAD_ERR_NO_FILE) {
                        $singleFile = [
                            'name' => $files['name'][$i],
                            'type' => $files['type'][$i],
                            'tmp_name' => $files['tmp_name'][$i],
                            'error' => $files['error'][$i],
                            'size' => $files['size'][$i],
                        ];
                        $url = FileUpload::upload($singleFile, 'all', $folder);
                        if ($url) {
                            $uploadedUrls[] = $url;
                        }
                    }
                }
            }

            // Tekil yükleme (file)
            if (isset($_FILES['file'])) {
                if (is_array($_FILES['file']['name'])) {
                    // Kazara file[] olarak gönderildiyse
                    $files = $_FILES['file'];
                    $count = count($files['name']);
                    for ($i = 0; $i < $count; $i++) {
                        if ($files['error'][$i] !== UPLOAD_ERR_NO_FILE) {
                            $singleFile = [
                                'name' => $files['name'][$i],
                                'type' => $files['type'][$i],
                                'tmp_name' => $files['tmp_name'][$i],
                                'error' => $files['error'][$i],
                                'size' => $files['size'][$i],
                            ];
                            $url = FileUpload::upload($singleFile, 'all', $folder);
                            if ($url) {
                                $uploadedUrls[] = $url;
                            }
                        }
                    }
                } else {
                    if ($_FILES['file']['error'] !== UPLOAD_ERR_NO_FILE) {
                        $url = FileUpload::upload($_FILES['file'], 'all', $folder);
                        if ($url) {
                            $uploadedUrls[] = $url;
                        }
                    }
                }
            }

            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Dosyalar başarıyla yüklendi.",
                "data" => $uploadedUrls
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }
}
