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

    public function handleLogout()
    {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Çıkış yapıldı."
        ]);
    }
}
