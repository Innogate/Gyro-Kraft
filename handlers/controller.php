<?php
$cookie_lifetime = 3 * 24 * 60 * 60; // 3 days in seconds

if (session_status() === PHP_SESSION_NONE) {
    // Set session cookie params before starting the session
    session_set_cookie_params([
        'lifetime' => $cookie_lifetime,
        'path' => '/',
        'httponly' => true,
        'secure' => isset($_SERVER['HTTPS']), // secure if HTTPS
        'samesite' => 'Lax' // or 'Strict'
    ]);
    session_start();
}

// Extend session if user is logged in
if (isset($_SESSION['user'])) {
    // Reset the session cookie on each request
    setcookie(session_name(), session_id(), time() + $cookie_lifetime, '/');
}

// Routing logic
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($path === '/') {
    if (!isset($_SESSION['user'])) {
        header("Location: /login");
    } else {
        header("Location: /dashboard");
    }
    exit;
}
