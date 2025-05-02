<?php

class Router {
    private static $routes = [];

    public static function register($method, $path, $callback) {
        self::$routes[strtoupper($method)][$path] = $callback;
    }

    public static function dispatch($method, $path) {
        $method = strtoupper($method);

        // Serve HTML files if available
        $htmlFile = __DIR__ . "/../views" . $path . ".html";
        if ($method == "GET" && file_exists($htmlFile)) {
            header("Content-Type: text/html");
            readfile($htmlFile);
            return;
        }

        // Serve PHP handler if route is registered
        if (isset(self::$routes[$method][$path])) {
            call_user_func(self::$routes[$method][$path]);
            return;
        }

        // If file is not found, redirect to index.php for all paths
        include(__DIR__ . "/../handlers/controller.php");  // Redirect all unknown paths to index.php
    }
}
