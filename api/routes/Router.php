<?php

/**
 * Router sınıfı
 * Tüm rota tanımlamaları ve dispatch mantığını barındırır.
 */
class Router
{
    private $db;
    private $method;
    private $resource;
    private $subResource;
    private $resourceId;

    public function __construct($db, $method, $resource, $subResource, $resourceId)
    {
        $this->db = $db;
        $this->method = $method;
        $this->resource = $resource;
        $this->subResource = $subResource;
        $this->resourceId = $resourceId;
    }

    /**
     * Ana dispatch metodu. Rotayı belirler ve ilgili controller'a yönlendirir.
     */
    public function dispatch()
    {
        switch ($this->resource) {

            // ========================
            // AUTH (Public)
            // ========================
            case 'auth':
                $this->handleAuth();
                break;

            case 'upload':
                $this->handleUploadRoute();
                break;

            // ========================
            // PUBLIC PAGE ROUTES
            // ========================
            case 'nav-menus':
                $this->handlePublicGet(NavigationController::class, 'getMenus');
                break;

            case 'home-page':
                $this->handlePublicPage('homePage');
                break;

            case 'rooms-page':
                $this->handlePublicPage('roomsPage');
                break;

            case 'restaurant-page':
                $this->handleRestaurantPage();
                break;

            case 'events-page':
                $this->handlePublicPage('eventsPage');
                break;

            case 'meetings-page':
                $this->handlePublicPage('meetingsPage');
                break;

            case 'contact-page':
                $this->handlePublicPage('contactPage');
                break;

            // ========================
            // PRIVATE CRUD ROUTES (JWT Required)
            // ========================
            case 'rooms':
                $this->handleCrud(RoomController::class);
                break;

            case 'saloons':
                $this->handleCrud(SaloonController::class);
                break;

            case 'home-hero':
                $this->handleCrud(HomeHeroController::class);
                break;

            case 'home-counters':
                $this->handleCrud(HomeCounterController::class);
                break;

            case 'home-features':
                $this->handleCrud(HomeFeatureController::class);
                break;

            case 'page-banners':
                $this->handleCrud(PageBannerController::class);
                break;

            // ========================
            // STATIC CONTENT (Update Only)
            // ========================
            case 'home-overview':
                $this->handleUpdateOnly(HomeOverviewController::class);
                break;

            case 'home-founder':
                $this->handleUpdateOnly(HomeFounderController::class);
                break;

            case 'company-contacts':
                $this->handleUpdateOnly(ContactController::class);
                break;

            case 'restaurant':
                $this->handleUpdateOnly(RestaurantController::class);
                break;

            // ========================
            // 404
            // ========================
            default:
                $this->notFound();
                break;
        }
    }

    // ============================================================
    // HANDLER METOTLARı
    // ============================================================

    private function handleUploadRoute()
    {
        AuthMiddleware::authenticate();
        if ($this->method !== 'POST') {
            $this->methodNotAllowed("Sadece POST desteklenmektedir.");
        }
        $controller = new UploadController();
        $controller->store();
    }

    /**
     * Auth rotalarını yönetir.
     */
    private function handleAuth()
    {
        $controller = new AuthController($this->db);

        if ($this->subResource === 'login' && $this->method === 'POST') {
            $controller->handleLogin();
        } elseif ($this->subResource === 'refresh' && $this->method === 'POST') {
            $controller->handleRefresh();
        } elseif ($this->subResource === 'me' && $this->method === 'GET') {
            $controller->handleMe();
        } elseif ($this->subResource === 'logout' && $this->method === 'POST') {
            $controller->handleLogout();
        } else {
            $this->notFound();
        }
    }

    /**
     * Sadece GET destekleyen genel public rotalar.
     */
    private function handlePublicGet($controllerClass, $action)
    {
        if ($this->method === 'GET') {
            $controller = new $controllerClass($this->db);
            $controller->$action();
        } else {
            $this->methodNotAllowed("Bu rota için sadece GET metodu desteklenmektedir.");
        }
    }

    /**
     * Sadece GET destekleyen public sayfa rotaları.
     */
    private function handlePublicPage($action)
    {
        $this->handlePublicGet(PageController::class, $action);
    }

    /**
     * Restaurant sayfası — public GET + private PUT/{id}.
     */
    private function handleRestaurantPage()
    {
        if ($this->method === 'GET' && !$this->resourceId) {
            $controller = new PageController($this->db);
            $controller->restaurantPage();
        } elseif ($this->method === 'PUT' && $this->resourceId) {
            AuthMiddleware::authenticate();
            $controller = new RestaurantController($this->db);
            $controller->update($this->resourceId);
        } else {
            $this->methodNotAllowed();
        }
    }

    /**
     * Tam CRUD destekleyen (JWT korumalı) rotalar için ortak dispatch.
     * GET (listele/getir), POST (ekle), PUT (güncelle), DELETE (sil)
     */
    private function handleCrud($controllerClass)
    {
        if ($this->method !== 'GET') {
            AuthMiddleware::authenticate();
        }
        $controller = new $controllerClass($this->db);

        if ($this->resourceId) {
            switch ($this->method) {
                case 'GET':
                    $controller->show($this->resourceId);
                    break;
                case 'PUT':
                case 'POST': // Include POST so we can use multipart/form-data to update
                    $controller->update($this->resourceId);
                    break;
                case 'DELETE':
                    $controller->destroy($this->resourceId);
                    break;
                default:
                    $this->methodNotAllowed();
            }
        } else {
            switch ($this->method) {
                case 'GET':
                    $controller->index();
                    break;
                case 'POST':
                    $controller->store();
                    break;
                default:
                    $this->methodNotAllowed();
            }
        }
    }

    /**
     * Sadece GET ve PUT/{id} destekleyen statik içerik rotaları.
     */
    private function handleUpdateOnly($controllerClass)
    {
        if ($this->method !== 'GET') {
            AuthMiddleware::authenticate();
        }
        $controller = new $controllerClass($this->db);

        if ($this->resourceId && $this->method === 'PUT') {
            $controller->update($this->resourceId);
        } elseif (!$this->resourceId && $this->method === 'GET') {
            $controller->show();
        } else {
            $this->methodNotAllowed("Bu kaynak için sadece GET ve PUT/{id} desteklenmektedir.");
        }
    }

    // ============================================================
    // YARDIMCI METOTLAR
    // ============================================================

    private function notFound()
    {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Rota bulunamadı."]);
    }

    private function methodNotAllowed($message = "Desteklenmeyen metot.")
    {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => $message]);
    }
}
