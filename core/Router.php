<?php

class Router {
    private static $routes = [];

    public static function register($method, $path, $callback) {
        self::$routes[strtoupper($method)][$path] = $callback;
    }

    public static function dispatch($method, $path) {
        $method = strtoupper($method);

        // Serve HTML if available
        $htmlFile = __DIR__ . "/../views" . $path . ".html";
        if (file_exists($htmlFile)) {
            header("Content-Type: text/html");
            readfile($htmlFile);
            return;
        }

        // Serve PHP handler
        if (isset(self::$routes[$method][$path])) {
            call_user_func(self::$routes[$method][$path]);
        } else {
            http_response_code(404);
            echo "404 Not Found";
        }
    }
}
