<?php
// mysql input sanitization
function sanitize($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function response($status, $message, $data='') {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => $status,
        'message' => $message,
        'data' => $data
    ]);
}