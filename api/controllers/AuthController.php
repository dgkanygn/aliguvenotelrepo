<?php

use Firebase\JWT\JWT;

class AuthController
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    /**
     * POST /auth/login
     * username ve password ile giriş, JWT token döner.
     */
    public function handleLogin()
    {
        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data['username']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Kullanıcı adı ve şifre gereklidir."]);
            return;
        }

        $username = trim($data['username']);
        $password = $data['password'];

        try {
            $stmt = $this->db->prepare("SELECT id, username, password FROM admins WHERE username = :username LIMIT 1");
            $stmt->bindParam(':username', $username);
            $stmt->execute();
            $admin = $stmt->fetch();

            if (!$admin) {
                http_response_code(401);
                echo json_encode(["success" => false, "message" => "Geçersiz kullanıcı adı veya şifre."]);
                return;
            }

            if (!password_verify($password, $admin['password'])) {
                http_response_code(401);
                echo json_encode(["success" => false, "message" => "Geçersiz kullanıcı adı veya şifre."]);
                return;
            }

            $secret = $_ENV['JWT_SECRET'] ?? 'aliguvenotel_jwt_secret_key_2026_change_this';
            $payload = [
                'iss' => 'aliguvenotel',
                'iat' => time(),
                'exp' => time() + (60 * 60 * 24), // 24 saat
                // 'exp' => time() + (60 * 2), // 2 dakika
                // 'exp' => time() + 60, // 1 dakika
                'sub' => $admin['id'],
                'username' => $admin['username']
            ];

            $token = JWT::encode($payload, $secret, 'HS256');

            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Giriş başarılı.",
                "token" => $token
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }
    public function handleMe()
    {
        $decoded = AuthMiddleware::authenticate();
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "user" => [
                "id" => $decoded->sub,
                "username" => $decoded->username
            ]
        ]);
    }

    /**
     * POST /auth/refresh
     * Mevcut token'ı alır, geçerliyse (veya son 7 gün içinde expire olduysa) yeni token üretir.
     * Kullanıcının ruhu bile duymadan token yenilenir.
     */
    public function handleRefresh()
    {
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
            return;
        }

        $secret = $_ENV['JWT_SECRET'] ?? 'aliguvenotel_jwt_secret_key_2026_change_this';

        try {
            // Önce normal decode dene (token hala geçerliyse)
            $decoded = JWT::decode($token, new \Firebase\JWT\Key($secret, 'HS256'));
        } catch (\Firebase\JWT\ExpiredException $e) {
            // Token expire olmuşsa, grace period içinde mi kontrol et
            // JWT'yi manuel decode et (signature doğrulanmış ama expire olmuş)
            $parts = explode('.', $token);
            if (count($parts) !== 3) {
                http_response_code(401);
                echo json_encode(["success" => false, "message" => "Geçersiz token formatı."]);
                return;
            }

            $payload = json_decode(base64_decode(strtr($parts[1], '-_', '+/')), false);
            if (!$payload || !isset($payload->exp)) {
                http_response_code(401);
                echo json_encode(["success" => false, "message" => "Token payload okunamadı."]);
                return;
            }

            // Signature'ı doğrula (expire kontrolünü geçici olarak kaldırarak)
            try {
                JWT::$leeway = 60 * 60 * 24 * 7; // 7 gün grace period
                $decoded = JWT::decode($token, new \Firebase\JWT\Key($secret, 'HS256'));
                JWT::$leeway = 0; // Sıfırla
            } catch (\Exception $innerEx) {
                JWT::$leeway = 0;
                http_response_code(401);
                echo json_encode(["success" => false, "message" => "Token yenilenemez, lütfen tekrar giriş yapın."]);
                return;
            }
        } catch (\Exception $e) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Geçersiz token."]);
            return;
        }

        // Kullanıcının hala veritabanında var olduğunu kontrol et
        try {
            $stmt = $this->db->prepare("SELECT id, username FROM admins WHERE id = :id LIMIT 1");
            $stmt->bindParam(':id', $decoded->sub);
            $stmt->execute();
            $admin = $stmt->fetch();

            if (!$admin) {
                http_response_code(401);
                echo json_encode(["success" => false, "message" => "Kullanıcı bulunamadı."]);
                return;
            }

            // Yeni token üret
            $newPayload = [
                'iss' => 'aliguvenotel',
                'iat' => time(),
                'exp' => time() + (60 * 60 * 24), // 24 saat
                'sub' => $admin['id'],
                'username' => $admin['username']
            ];

            $newToken = JWT::encode($newPayload, $secret, 'HS256');

            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Token yenilendi.",
                "token" => $newToken
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Sunucu hatası: " . $e->getMessage()]);
        }
    }

    public function handleLogout()
    {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Çıkış yapıldı."
        ]);
    }
}
