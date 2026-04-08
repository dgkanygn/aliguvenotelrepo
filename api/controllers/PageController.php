<?php

function getHomeData($pdo) {
    $data = [];
    
    // Hero Alanları
    $stmt = $pdo->query("SELECT * FROM home_hero");
    $data['hero'] = $stmt->fetchAll();
    
    // Sayaçlar
    $stmt = $pdo->query("SELECT * FROM home_counters");
    $data['counters'] = $stmt->fetchAll();
    
    // Kurucu Bilgisi
    $stmt = $pdo->query("SELECT * FROM home_founder LIMIT 1");
    $data['founder'] = $stmt->fetch();
    
    // Özellikler
    $stmt = $pdo->query("SELECT * FROM home_features");
    $data['features'] = $stmt->fetchAll();

    return $data;
}

function getContactData($pdo) {
    $data = [];
    
    // Sayfanın Banner'ı (İlk olarak çekilir)
    $stmt = $pdo->query("SELECT * FROM page_banners WHERE page_key = 'contact' LIMIT 1");
    $data['banner'] = $stmt->fetch();
    
    // İletişim Bilgileri
    $stmt = $pdo->query("SELECT * FROM contact_info LIMIT 1");
    $data['info'] = $stmt->fetch();
    
    return $data;
}

function getRoomsData($pdo) {
    $data = [];
    
    $stmt = $pdo->query("SELECT * FROM page_banners WHERE page_key = 'rooms' LIMIT 1");
    $data['banner'] = $stmt->fetch();
    
    $stmt = $pdo->query("SELECT * FROM rooms");
    $data['rooms'] = $stmt->fetchAll();
    
    $stmt = $pdo->query("SELECT * FROM room_images");
    $data['room_images'] = $stmt->fetchAll();
    
    return $data;
}

function getRestaurantData($pdo) {
    $data = [];
    
    $stmt = $pdo->query("SELECT * FROM page_banners WHERE page_key = 'restaurant' LIMIT 1");
    $data['banner'] = $stmt->fetch();
    
    $stmt = $pdo->query("SELECT * FROM restaurant_info");
    $data['restaurant_info'] = $stmt->fetchAll();
    
    $stmt = $pdo->query("SELECT * FROM restaurant_images");
    $data['restaurant_images'] = $stmt->fetchAll();
    
    return $data;
}

function getEventData($pdo) {
    $data = [];
    
    $stmt = $pdo->query("SELECT * FROM page_banners WHERE page_key = 'events' LIMIT 1");
    $data['banner'] = $stmt->fetch();
    
    $stmt = $pdo->query("SELECT * FROM event_space");
    $data['event_space'] = $stmt->fetchAll();
    
    $stmt = $pdo->query("SELECT * FROM event_images");
    $data['event_images'] = $stmt->fetchAll();
    
    return $data;
}
