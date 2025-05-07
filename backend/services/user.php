<?php

require_once __DIR__ . '/../core/JwtHandler.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Handler.php';

global $router;

// POST USERS LOGIN
$router->add('POST', '/users/login', function () {
    $pageID = 4;
    $jwt = new JwtHandler();
    $handler = new Handler();

    // Decode incoming JSON data
    $data = json_decode(file_get_contents("php://input"), true);
    $handler->validateInput($data, ["mobile", "password"]);

    // Extract variables from incoming data
    $mobile = $data['mobile'];
    $password = $data['password'];

    // Create a new database connection
    $dbInstance = new Database();
    $conn = $dbInstance->pdo;

    $sql = "SELECT * FROM users WHERE phone_no = :mobile";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":mobile", $mobile);
    $stmt->execute();

    // Fetch user
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // If user found
    if ($user) {
        // Check password
        if (($password == $user['password_hash'])) {
            $otp = rand(100000, 999999);

            $sql = "INSERT INTO otps (user_id, otp) VALUES (:user_id, :otp)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":user_id", $user['id']);
            $stmt->bindParam(":otp", $otp);
            $stmt->execute();

            $insetId = $conn->lastInsertId();

            (new ApiResponse(200, "Success", ["otp_id" => $insetId]))->toJson();
        } else {
            (new ApiResponse(401, "Error", "Invalid credentials."))->toJson();
        }
    } else {
        (new ApiResponse(404, "Error", "User not found."))->toJson();
    }
});

// POST GET OTP
$router->add('POST', '/users/login/otp_get', function () {
    $jwt = new JwtHandler();
    $handler = new Handler();

    // Decode incoming JSON data
    $data = json_decode(file_get_contents("php://input"), true);
    $handler->validateInput($data, ["otp_id"]);

    // Extract variables from incoming data
    $otp_id = $data['otp_id'];

    $dbInstance = new Database();
    $conn = $dbInstance->pdo;

    $sql = "SELECT * FROM otps WHERE id = :otp_id ORDER BY id DESC LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":otp_id", $otp_id);
    $stmt->execute();

    $otp = $stmt->fetch(PDO::FETCH_ASSOC);

    (new ApiResponse(200, "Success", $otp))->toJson();
});

// POST VERIFY OTP
$router->add('POST', '/users/login/otp_verify', function () {
    $jwt = new JwtHandler();
    $handler = new Handler();

    // Decode incoming JSON data
    $data = json_decode(file_get_contents("php://input"), true);
    $handler->validateInput($data, ["otp_id", "otp"]);

    // Extract variables from incoming data
    $otp_id = $data['otp_id'];
    $otp = $data['otp'];

    $dbInstance = new Database();
    $conn = $dbInstance->pdo;

    $sql = "SELECT * FROM otps WHERE id = :otp_id ORDER BY id DESC LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":otp_id", $otp_id);
    $stmt->execute();

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result['otp'] == $otp) {
        if (time() - strtotime($result['created_at']) > 600) {
            (new ApiResponse(401, "Error", "OTP expired."))->toJson();
            return;
        }
        
        $sql = "SELECT * FROM users WHERE id = :user_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":user_id", $result['user_id']);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $token= $jwt->generateToken($user);
        (new ApiResponse(200, "Success", ["token"=>$token]))->toJson();
    } else {
        (new ApiResponse(401, "Error", "Invalid credentials."))->toJson();
    }
});