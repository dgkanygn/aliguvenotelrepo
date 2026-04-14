<?php

/**
 * Ali Güven Otel CMS API
 * Ana giriş noktası
 */

// CORS headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Preflight request handling
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Composer autoload
require_once __DIR__ . '/vendor/autoload.php';

// Ortama göre .env dosyasını seç (Localhost için .env.development, uzak sunucu için .env.production)
$host = $_SERVER['HTTP_HOST'] ?? '';
$isLocalhost = (strpos($host, 'localhost') !== false || strpos($host, '127.0.0.1') !== false);
$envFile = $isLocalhost ? '.env.development' : '.env.production';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__, $envFile);
$dotenv->safeLoad();

// Config ve dosyalar
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/middleware/AuthMiddleware.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/PageController.php';
require_once __DIR__ . '/controllers/RoomController.php';
require_once __DIR__ . '/controllers/SaloonController.php';
require_once __DIR__ . '/controllers/HomeHeroController.php';
require_once __DIR__ . '/controllers/HomeCounterController.php';
require_once __DIR__ . '/controllers/HomeFeatureController.php';
require_once __DIR__ . '/controllers/HomeFounderController.php';
require_once __DIR__ . '/controllers/RestaurantController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/NavigationController.php';
require_once __DIR__ . '/controllers/HomeOverviewController.php';
require_once __DIR__ . '/controllers/PageBannerController.php';
require_once __DIR__ . '/controllers/UploadController.php';
require_once __DIR__ . '/routes/Router.php';

// DB bağlantısı
$database = new Database();
$db = $database->getConnection();

// URL ve Method parsing
$requestMethod = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];

// Base path çıkar (alt dizinde çalışıyorsa)
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
$uri = parse_url($requestUri, PHP_URL_PATH);

if ($scriptName !== '/' && $scriptName !== '\\') {
    $uri = substr($uri, strlen($scriptName));
}

$uri = '/' . trim($uri, '/');

// URI parçala
$uriParts = explode('/', trim($uri, '/'));

// "api" prefix'i varsa yoksay
if (isset($uriParts[0]) && $uriParts[0] === 'api') {
    array_shift($uriParts);
}

$resource = $uriParts[0] ?? '';
$subResource = $uriParts[1] ?? null;
$resourceId = ($subResource && is_numeric($subResource)) ? (int)$subResource : null;

// Routing
try {
    $router = new Router($db, $requestMethod, $resource, $subResource, $resourceId);
    $router->dispatch();
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Beklenmeyen sunucu hatası: " . $e->getMessage()]);
}
