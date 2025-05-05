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


function generateAlphaNumeric($length) {
    $characters = '0123456789';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}