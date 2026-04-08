<?php

/**
 * Genel CRUD Controller
 * Tüm tablolar için ortak Create, Read, Update, Delete işlemlerini yönetir.
 */

// İzin verilen tablolar ve düzenlenebilir alanları
function getAllowedTables() {
    return [
        'contact_info' => ['address', 'landline_phone', 'mobile_phone', 'email', 'fax'],
        'event_images' => ['image_url'],
        'event_space' => ['intro_text', 'video_url', 'title', 'description', 'amenities'],
        'home_counters' => ['icon', 'count', 'name'],
        'home_features' => ['icon', 'title', 'description'],
        'home_founder' => ['image_url', 'title', 'content', 'special_text'],
        'home_hero' => ['image_url', 'title', 'description'],
        'page_banners' => ['page_key', 'top_title', 'page_title', 'image_url'],
        'restaurant_images' => ['image_url'],
        'restaurant_info' => ['intro_text', 'warning_text', 'menu_pdf_url'],
        'rooms' => ['title', 'description', 'amenities'],
        'room_images' => ['room_id', 'image_url', 'is_main'],
    ];
}

/**
 * Tablo adını doğrular.
 */
function validateTable($table) {
    $allowed = getAllowedTables();
    if (!array_key_exists($table, $allowed)) {
        http_response_code(400);
        return false;
    }
    return true;
}

/**
 * Gelen veriyi tablonun izin verilen alanlarına göre filtreler.
 */
function filterFields($table, $data) {
    $allowed = getAllowedTables();
    $allowedFields = $allowed[$table];
    $filtered = [];

    foreach ($data as $key => $value) {
        if (in_array($key, $allowedFields)) {
            $filtered[$key] = $value;
        }
    }

    return $filtered;
}

// ─── READ (GET) ────────────────────────────────────────────────

/**
 * Tablodaki tüm kayıtları getirir.
 */
function getAll($pdo, $table) {
    if (!validateTable($table)) {
        return ['success' => false, 'message' => "Gecersiz tablo: $table"];
    }

    $stmt = $pdo->query("SELECT * FROM `$table`");
    $data = $stmt->fetchAll();

    return [
        'success' => true,
        'data' => $data
    ];
}

/**
 * Tablodaki belirli bir kaydı ID'ye göre getirir.
 */
function getById($pdo, $table, $id) {
    if (!validateTable($table)) {
        return ['success' => false, 'message' => "Gecersiz tablo: $table"];
    }

    $stmt = $pdo->prepare("SELECT * FROM `$table` WHERE id = ?");
    $stmt->execute([$id]);
    $data = $stmt->fetch();

    if (!$data) {
        http_response_code(404);
        return [
            'success' => false,
            'message' => 'Kayit bulunamadi.'
        ];
    }

    return [
        'success' => true,
        'data' => $data
    ];
}

// ─── CREATE (POST) ─────────────────────────────────────────────

/**
 * Tabloya yeni kayıt ekler.
 */
function createRecord($pdo, $table) {
    if (!validateTable($table)) {
        return ['success' => false, 'message' => "Gecersiz tablo: $table"];
    }

    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        http_response_code(400);
        return [
            'success' => false,
            'message' => 'Gecersiz veya eksik veri. JSON formatinda gonderiniz.'
        ];
    }

    $filtered = filterFields($table, $input);
    if (empty($filtered)) {
        http_response_code(400);
        return [
            'success' => false,
            'message' => 'Gecerli alan bulunamadi.'
        ];
    }

    $columns = implode(', ', array_map(fn($col) => "`$col`", array_keys($filtered)));
    $placeholders = implode(', ', array_fill(0, count($filtered), '?'));

    $stmt = $pdo->prepare("INSERT INTO `$table` ($columns) VALUES ($placeholders)");
    $stmt->execute(array_values($filtered));

    $newId = $pdo->lastInsertId();

    // Yeni oluşturulan kaydı döndür
    $stmt = $pdo->prepare("SELECT * FROM `$table` WHERE id = ?");
    $stmt->execute([$newId]);
    $newRecord = $stmt->fetch();

    http_response_code(201);
    return [
        'success' => true,
        'message' => 'Kayit basariyla olusturuldu.',
        'data' => $newRecord
    ];
}

// ─── UPDATE (PUT) ──────────────────────────────────────────────

/**
 * Tablodaki mevcut bir kaydı günceller.
 */
function updateRecord($pdo, $table, $id) {
    if (!validateTable($table)) {
        return ['success' => false, 'message' => "Gecersiz tablo: $table"];
    }

    // Kaydın var olup olmadığını kontrol et
    $checkStmt = $pdo->prepare("SELECT id FROM `$table` WHERE id = ?");
    $checkStmt->execute([$id]);
    if (!$checkStmt->fetch()) {
        http_response_code(404);
        return [
            'success' => false,
            'message' => 'Guncellenecek kayit bulunamadi.'
        ];
    }

    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        http_response_code(400);
        return [
            'success' => false,
            'message' => 'Gecersiz veya eksik veri. JSON formatinda gonderiniz.'
        ];
    }

    $filtered = filterFields($table, $input);
    if (empty($filtered)) {
        http_response_code(400);
        return [
            'success' => false,
            'message' => 'Gecerli alan bulunamadi.'
        ];
    }

    $setClause = implode(', ', array_map(fn($col) => "`$col` = ?", array_keys($filtered)));
    $values = array_values($filtered);
    $values[] = $id;

    $stmt = $pdo->prepare("UPDATE `$table` SET $setClause WHERE id = ?");
    $stmt->execute($values);

    // Güncellenmiş kaydı döndür
    $stmt = $pdo->prepare("SELECT * FROM `$table` WHERE id = ?");
    $stmt->execute([$id]);
    $updatedRecord = $stmt->fetch();

    return [
        'success' => true,
        'message' => 'Kayit basariyla guncellendi.',
        'data' => $updatedRecord
    ];
}

// ─── DELETE ────────────────────────────────────────────────────

/**
 * Tablodaki bir kaydı siler.
 */
function deleteRecord($pdo, $table, $id) {
    if (!validateTable($table)) {
        return ['success' => false, 'message' => "Gecersiz tablo: $table"];
    }

    // Kaydın var olup olmadığını kontrol et
    $checkStmt = $pdo->prepare("SELECT id FROM `$table` WHERE id = ?");
    $checkStmt->execute([$id]);
    if (!$checkStmt->fetch()) {
        http_response_code(404);
        return [
            'success' => false,
            'message' => 'Silinecek kayit bulunamadi.'
        ];
    }

    $stmt = $pdo->prepare("DELETE FROM `$table` WHERE id = ?");
    $stmt->execute([$id]);

    return [
        'success' => true,
        'message' => 'Kayit basariyla silindi.'
    ];
}
