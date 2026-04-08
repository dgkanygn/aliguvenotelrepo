<?php

/**
 * JWT (JSON Web Token) üretir. Geçerlilik süresi default olarak 2 saattir.
 */
function createJWT($payload, $secret) {
    if (!isset($payload['exp'])) {
        $payload['exp'] = time() + (2 * 60 * 60); // 2 saat geçerli
    }

    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payloadJson = json_encode($payload);

    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payloadJson));

    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

/**
 * Admin girişi — Veritabanındaki 'admins' tablosunu kontrol eder, eşleşirse JWT üretir.
 */
function handleLogin($pdo) {
    // 1. Gelen JSON verisini al (usename, password)
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || !isset($input['username']) || !isset($input['password'])) {
        http_response_code(400);
        return [
            'success' => false,
            'message' => 'Kullanıcı adı ve şifre gereklidir.'
        ];
    }



    // 3. Veritabanından kullanıcıyı sorgula
    $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ? LIMIT 1");
    $stmt->execute([$input['username']]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($input['password'], $user['password'])) {
        http_response_code(401);
        return [
            'success' => false,
            'message' => 'Geçersiz kullanıcı adı veya şifre.'
        ];
    }

    // 4. ENV dosyasından JWT Şifresini al ve üretime başla
    $env_file = __DIR__ . '/../.env';
    $env = file_exists($env_file) ? parse_ini_file($env_file) : [];
    $jwtSecret = $env['JWT_SECRET'] ?? 'default_secret_key_dont_use_in_prod';

    $payload = [
        'id' => $user['id'],
        'username' => $user['username']
    ];

    $token = createJWT($payload, $jwtSecret);

    return [
        'success' => true,
        'data' => [
            'token' => $token,
            'expires_in' => 7200, // saniye cinsinden
            'message' => 'Giriş başarılı.'
        ]
    ];
}
