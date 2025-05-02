<?php
require_once __DIR__ . "/core/Router.php";

// Autoload all handlers
foreach (glob(__DIR__ . "/handlers/*.php") as $file) {
    require_once $file;
}

// Dispatch current request
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
Router::dispatch($method, rtrim($path, '/'));
