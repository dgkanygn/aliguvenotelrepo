<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require 'db.php';

$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Sadece /api/... formatındaki isteklere izin ver
if (strpos($path, '/api') === false) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'Gecersiz endpoint formati. Lutfen istekleri /api/[rota] formatinda yapin.'
    ]);
    exit;
}

// URL'den /api/ sonrasını al ve parçala
// Örn: /api/rooms/3 => ['rooms', '3']
$apiPath = '';
if (preg_match('#/api/(.+)#', $path, $matches)) {
    $apiPath = trim($matches[1], '/');
} elseif (isset($_GET['route'])) {
    $apiPath = trim($_GET['route'], '/');
}

$segments = $apiPath ? explode('/', $apiPath) : [];
$segmentCount = count($segments);

$response = [
    'success' => true,
    'data' => null
];

try {
    // ─── CONTROLLERS ───────────────────────────────────
    require_once 'controllers/PageController.php';
    require_once 'controllers/AuthController.php';
    require_once 'controllers/CrudController.php';
    require_once 'middleware/AuthMiddleware.php';

    // ─── AUTH ROTASI ────────────────────────────────────
    // POST /api/auth/login
    if ($segmentCount >= 2 && $segments[0] === 'auth' && $segments[1] === 'login') {
        if ($method !== 'POST') {
            http_response_code(405);
            $response = ['success' => false, 'message' => 'Sadece POST metodu kabul edilir.'];
        } else {
            $response = handleLogin($pdo);
        }
        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    // ─── SAYFA ROTALARI (Mevcut — Toplu veri getirme) ──
    // GET /api/home, /api/contact, /api/rooms, /api/restaurant, /api/event
    $pageRoutes = ['home', 'contact', 'rooms', 'restaurant', 'event'];
    if ($segmentCount === 1 && in_array($segments[0], $pageRoutes) && $method === 'GET') {
        switch ($segments[0]) {
            case 'home':
                $response['data'] = getHomeData($pdo);
                break;
            case 'contact':
                $response['data'] = getContactData($pdo);
                break;
            case 'rooms':
                $response['data'] = getRoomsData($pdo);
                break;
            case 'restaurant':
                $response['data'] = getRestaurantData($pdo);
                break;
            case 'event':
                $response['data'] = getEventData($pdo);
                break;
        }
        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    // ─── CRUD ROTALARI (Tablo başına ayrı) ──────────────
    // Desteklenen tablolar
    $crudTables = [
        'contact_info', 'event_images', 'event_space',
        'home_counters', 'home_features', 'home_founder', 'home_hero',
        'page_banners', 'restaurant_images', 'restaurant_info',
        'rooms', 'room_images'
    ];

    // URL'deki alt_çizgi (-) yerine (_) kullanımını destekle
    // Örn: /api/contact-info => contact_info
    $tableSlug = $segments[0] ?? '';
    $tableName = str_replace('-', '_', $tableSlug);

    if (in_array($tableName, $crudTables)) {
        $id = $segments[1] ?? null;

        switch ($method) {
            // GET /api/{tablo}       => Tüm kayıtlar
            // GET /api/{tablo}/{id}  => Tek kayıt
            case 'GET':
                if ($id) {
                    $response = getById($pdo, $tableName, (int)$id);
                } else {
                    $response = getAll($pdo, $tableName);
                }
                break;

            // POST /api/{tablo}      => Yeni kayıt (token gerekli)
            case 'POST':
                requireAuth();
                $response = createRecord($pdo, $tableName);
                break;

            // PUT /api/{tablo}/{id}  => Güncelle (token gerekli)
            case 'PUT':
                if (!$id) {
                    http_response_code(400);
                    $response = ['success' => false, 'message' => 'Guncellemek icin ID gereklidir.'];
                } else {
                    requireAuth();
                    $response = updateRecord($pdo, $tableName, (int)$id);
                }
                break;

            // DELETE /api/{tablo}/{id} => Sil (token gerekli)
            case 'DELETE':
                if (!$id) {
                    http_response_code(400);
                    $response = ['success' => false, 'message' => 'Silmek icin ID gereklidir.'];
                } else {
                    requireAuth();
                    $response = deleteRecord($pdo, $tableName, (int)$id);
                }
                break;

            default:
                http_response_code(405);
                $response = ['success' => false, 'message' => 'Desteklenmeyen HTTP metodu.'];
                break;
        }

        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    // ─── BULUNAMADI ─────────────────────────────────────
    http_response_code(404);
    $response = [
        'success' => false,
        'message' => 'Gecersiz veya bulunamayan rota.'
    ];

} catch (PDOException $e) {
    http_response_code(500);
    $response = [
        'success' => false,
        'message' => 'Veritabani hatasi.',
        'error_details' => $e->getMessage()
    ];
}

echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
