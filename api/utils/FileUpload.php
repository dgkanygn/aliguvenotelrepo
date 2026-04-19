<?php

class FileUpload
{
    private static $allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    private static $allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    // 10 MB max
    private static $maxSize = 10 * 1024 * 1024;

    /**
     * @param array $file $_FILES['input_name']
     * @param string $type 'image' or 'doc' or 'all'
     * @param string $folder Uploads altında açılacak klasör adı (örn: 'home-hero')
     * @return string|false Dönen değer URL veya false.
     * @throws Exception
     */
    public static function upload($file, $type = 'image', $folder = 'general')
    {
        if (!isset($file['error']) || is_array($file['error'])) {
            throw new \Exception('Geçersiz dosya parametreleri.');
        }

        switch ($file['error']) {
            case UPLOAD_ERR_OK:
                break;
            case UPLOAD_ERR_NO_FILE:
                return false; // Dosya yüklenmedi
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                throw new \Exception('Dosya boyutu çok büyük.');
            default:
                throw new \Exception('Bilinmeyen bir hata oluştu.');
        }

        if ($file['size'] > self::$maxSize) {
            throw new \Exception('Dosya boyutu en fazla 10MB olabilir.');
        }

        // Güvenli MIME tipi kontrolü
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']);

        $allowedTypes = [];
        if ($type === 'image') $allowedTypes = self::$allowedImageTypes;
        if ($type === 'doc') $allowedTypes = self::$allowedDocTypes;
        if ($type === 'all') $allowedTypes = array_merge(self::$allowedImageTypes, self::$allowedDocTypes);

        if (!in_array($mime, $allowedTypes, true)) {
            throw new \Exception('Geçersiz dosya formatı.');
        }

        // Orijinal dosya adını koruyarak güvenli dosya ismi oluşturulması
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        if (!$ext) {
            $ext = 'bin';
        }
        $baseName = pathinfo($file['name'], PATHINFO_FILENAME);
        
        // Türkçe karakterleri ve boşlukları güvenli karakterlere çeviriyoruz
        $search = array('ç','Ç','ğ','Ğ','ı','İ','ö','Ö','ş','Ş','ü','Ü',' ');
        $replace = array('c','C','g','G','i','I','o','O','s','S','u','U','-');
        $safeName = str_replace($search, $replace, $baseName);
        
        // Dosya isminde sadece alfa-nümerik, tire ve alt çizgi kalmasına izin veriyoruz
        $safeName = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $safeName);
        
        if (empty($safeName)) {
            $safeName = 'unnamed_file';
        }
        
        $fileName = $safeName . '.' . strtolower($ext);

        // Klasör ismini güvenli hale getir (sadece harf, rakam, tire, alt tire)
        $folder = preg_replace('/[^a-zA-Z0-9_\-]/', '', $folder);
        if (empty($folder)) {
            $folder = 'general';
        }

        $uploadDir = __DIR__ . '/../uploads/' . $folder . '/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $destination = $uploadDir . $fileName;

        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            throw new \Exception('Dosya kaydedilemedi.');
        }

        // Protokol ve URL
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        $domainName = $_SERVER['HTTP_HOST'];
        
        // Eğer siteniz alt klasördeyse (örn: /api), URL'ye bu klasörü de ekliyoruz.
        return $protocol . $domainName . '/api/uploads/' . $folder . '/' . $fileName;
    }
}
