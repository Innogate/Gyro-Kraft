<?php
session_start();
// check uri / or not
if (parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) == '/') {
    // check it login or not
    if (!isset($_SESSION['user'])) {
        header("Location: /login");
    }else{
        header("Location: /dashboard");
    }
}