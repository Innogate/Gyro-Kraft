<?php

class Router {
    private static $routes = [];

    /**
     * Register a route for a specific method and path.
     */
    public static function register($method, $path, $callback) {
        $method = strtoupper($method);
        self::$routes[$method][$path] = $callback;
    }

    /**
     * Dispatch the request to the appropriate route or serve static HTML.
     */
    public static function dispatch($method, $path) {
        $method = strtoupper($method);

        // Normalize and sanitize path
        $normalizedPath = preg_replace('/\/+/', '/', $path); // collapse multiple slashes
        $normalizedPath = rtrim($normalizedPath, '/');       // remove trailing slash

        // Serve default index page for root path
        if ($normalizedPath === '') {
            $normalizedPath = '/index';
        }

        // Serve static HTML from /views directory
        $htmlFile = __DIR__ . '/../views' . $normalizedPath . '.html';
        if ($method === 'GET' && file_exists($htmlFile)) {
            header('Content-Type: text/html');
            readfile($htmlFile);
            return;
        }

        // Handle registered PHP route
        if (isset(self::$routes[$method][$path])) {
            call_user_func(self::$routes[$method][$path]);
            return;
        }

        // Fallback to controller if nothing matched
        include(__DIR__ . '/../handlers/controller.php');
    }
}
