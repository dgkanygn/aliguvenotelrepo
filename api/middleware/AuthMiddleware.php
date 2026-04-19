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

        if (empty($_ENV['JWT_SECRET'])) { die("Secret anahtarı sunucuda yüklenemedi!"); }

        $authHeader = '';
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = trim($_SERVER['HTTP_AUTHORIZATION']);
        } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $authHeader = trim($_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
        } elseif (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            if (isset($requestHeaders['Authorization'])) {
                $authHeader = trim($requestHeaders['Authorization']);
            }
        } elseif (function_exists('getallheaders')) {
            $requestHeaders = getallheaders();
            if (isset($requestHeaders['Authorization'])) {
                $authHeader = trim($requestHeaders['Authorization']);
            }
        }

        $token = trim(str_ireplace('Bearer ', '', $authHeader));

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
