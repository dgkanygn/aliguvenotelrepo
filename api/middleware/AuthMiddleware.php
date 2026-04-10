<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware
{
    /**
     * JWT token doğrulama.
     * Geçerli bir token yoksa 401 döner ve script sonlanır.
     * Geçerli ise decoded payload döner.
     */
    public static function authenticate()
    {
        $token = '';

        // 1. Önce HttpOnly Cookie kontrolü
        if (isset($_COOKIE['auth_token']) && !empty($_COOKIE['auth_token'])) {
            $token = $_COOKIE['auth_token'];
        } else {
            // 2. Geri uyumluluk için Headers kontrolü (eski frontend vb. için)
            $headers = getallheaders();
            $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
            $token = str_replace('Bearer ', '', $authHeader);
        }

        if (empty($token)) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Token bulunamadı."]);
            exit;
        }

        try {
            $secret = $_ENV['JWT_SECRET'] ?? 'aliguvenotel_jwt_secret_key_2026_change_this';
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
            return $decoded;
        } catch (\Exception $e) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Geçersiz veya süresi dolmuş token."]);
            exit;
        }
    }
}
