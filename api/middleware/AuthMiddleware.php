<?php

/**
 * Authorization header'dan Bearer token'ı çıkarır.
 */
function getBearerToken() {
    $headers = '';

    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $headers = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        if (isset($requestHeaders['Authorization'])) {
            $headers = $requestHeaders['Authorization'];
        }
    }

    if (!empty($headers) && preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
        return $matches[1];
    }

    return null;
}

/**
 * JWT tokenını doğrular ve süresinin geçip geçmediğini (exp) kontrol eder.
 */
function verifyJWT($token, $secret) {
    if (!$token) return false;

    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;

    list($header, $payload, $signatureProvided) = $parts;

    $signature = hash_hmac('sha256', $header . "." . $payload, $secret, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

    // İmza doğrulaması
    if (!hash_equals($base64UrlSignature, $signatureProvided)) {
        return false; // Token tahrif edilmiş
    }

    // Token içeriğini kontrol et
    $payloadObj = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $payload)));
    if (!$payloadObj) return false;

    // Süre dolmuş mu kontrolü
    if (isset($payloadObj->exp) && $payloadObj->exp < time()) {
        return false; // Token süresi dolmuş
    }

    return $payloadObj;
}

/**
 * Route isteklerinde Yetki doğrulama middleware fonkiyonu. 
 * Token boşsa, imzası hatalıysa veya süresi geçmişse reddeder.
 */
function requireAuth() {
    $token = getBearerToken();
    if (!$token) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Erişim engellendi: Token bulunamadı.']);
        exit;
    }

    $env_file = __DIR__ . '/../.env';
    $env = file_exists($env_file) ? parse_ini_file($env_file) : [];
    $jwtSecret = $env['JWT_SECRET'] ?? 'default_secret_key_dont_use_in_prod';

    $payload = verifyJWT($token, $jwtSecret);

    if (!$payload) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Yetkisiz erişim: Token geçersiz veya süresi dolmuş.']);
        exit;
    }

    return $payload; // Devam eden işlemler için payload dönebilir.
}
