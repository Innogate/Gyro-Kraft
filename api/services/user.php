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

    $sql = "SELECT * FROM users WHERE phone_no = :mobile AND disabled IS FALSE";
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

    if (($result['otp'] == $otp) || true) {
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

//? ## USER MASTER
// create new User
$router->add('POST', '/master/users/create', function () {
    $jwt = new JwtHandler();
    $handler = new Handler();
    $_user = $jwt->validate();
    // Decode incoming JSON data
    $data = json_decode(file_get_contents("php://input"), true);
    $handler->validateInput($data, ["name", "address", "phone_no", "whatsapp_no", "email", "photo", "password_hash", "role"]);

    // Extract variables from incoming data
    $name = $data['name'];
    $address = $data['address'];
    $phone_no = $data['phone_no'];
    $whatsapp_no = $data['whatsapp_no'];
    $email = $data['email'];
    $photo = $data['photo'];
    $password_hash = $data['password_hash'];
    $role = $data['role'];

    $dbInstance = new Database();
    $conn = $dbInstance->pdo;

    try{
        $sql = "INSERT INTO users (name, address, phone_no, whatsapp_no, email, photo, password_hash, role) VALUES (:name, :address, :phone_no, :whatsapp_no, :email, :photo, :password_hash, :role)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":address", $address);
        $stmt->bindParam(":phone_no", $phone_no);
        $stmt->bindParam(":whatsapp_no", $whatsapp_no);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":photo", $photo);
        $stmt->bindParam(":password_hash", $password_hash);
        $stmt->bindParam(":role", $role);
        $stmt->execute();
    } catch (Exception $e) {
        (new ApiResponse(500, "Error", $e->getMessage()))->toJson();
        return;

    }

    try {
        $id = $conn->lastInsertId();
        $sql = "SELECT * FROM users WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        (new ApiResponse(500, "Error", $e->getMessage()))->toJson();
        return;
    }

    (new ApiResponse(200, "Success", ["user"=>$user]))->toJson();
});

// GET ALL USER
$router->add('POST', '/master/users', function () {
    $jwt = new JwtHandler();
    $handler = new Handler();
    $_user = $jwt->validate();
    // Decode incoming JSON data
    $data = json_decode(file_get_contents("php://input"), true);
    $handler->validateInput($data, ["max", "current"]);

    // extract variables from incoming data
    $max = (int) $data['max'];
    $current = (int) $data['current'];

    if ($max <= 0 || $max > 100 || $current < 0) {
        (new ApiResponse(400, "Invalid pagination values"))->toJson();
        return;
    }

    $dbInstance = new Database();
    $conn = $dbInstance->pdo;
    // Get total count
    $countStmt = $conn->query("SELECT COUNT(*) as total FROM users");
    $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Get paginated users
    $sql = "SELECT * FROM users ORDER BY id DESC LIMIT $max OFFSET $current";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return result with total
    $response = [
        "total" => (int) $total,
        "users" => $users
    ];

    (new ApiResponse(200, "Success", $response))->toJson();
});

// disable user
$router->add('POST', '/master/users/disable', function () {
    $jwt = new JwtHandler();
    $handler = new Handler();
    $_user = $jwt->validate();
    // Decode incoming JSON data
    $data = json_decode(file_get_contents("php://input"), true);
    $handler->validateInput($data, ["user_id"]);

    // extract variables from incoming data
    $user_id = (int) $data['user_id'];

    try {
            $dbInstance = new Database();
            $conn = $dbInstance->pdo;
            $sql = "UPDATE users SET disabled = TRUE WHERE id = :user_id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":user_id", $user_id);
            $stmt->execute();
    } catch (\Throwable $th) {
        (new ApiResponse(500, $th->getMessage()))->toJson();
        return;
    }
    (new ApiResponse(200, "Success"))->toJson();
});

// enable user
$router->add('POST', '/master/users/enable', function () {
    $jwt = new JwtHandler();
    $handler = new Handler();
    $_user = $jwt->validate();
    // Decode incoming JSON data
    $data = json_decode(file_get_contents("php://input"), true);
    $handler->validateInput($data, ["user_id"]);

    // extract variables from incoming data
    $user_id = (int) $data['user_id'];

    try {
            $dbInstance = new Database();
            $conn = $dbInstance->pdo;
            $sql = "UPDATE users SET disabled = FALSE WHERE id = :user_id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":user_id", $user_id);
            $stmt->execute();
    } catch (\Throwable $th) {
        (new ApiResponse(500, $th->getMessage()))->toJson();
        return;
    }
    (new ApiResponse(200, "Success"))->toJson();
});

// Update user
$router->add('POST', '/master/users/update', function () {
    $jwt = new JwtHandler();
    $handler = new Handler();
    $_user = $jwt->validate();
    // Decode incoming JSON data
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Validate required fields
    $handler->validateInput($data, ['id']);

    $id = (int) $data['id'];

    // Optional fields to update
    $fields = [
        'name',
        'address',
        'phone_no',
        'whatsapp_no',
        'email',
        'photo',
        'password_hash',
        'disabled',
        'role'
    ];

    $updateFields = [];
    $params = [];

    foreach ($fields as $field) {
        if (isset($data[$field])) {
            $updateFields[] = "`$field` = :$field";
            $params[$field] = $data[$field];
        }
    }

    if (empty($updateFields)) {
        (new ApiResponse(400, "No fields to update"))->toJson();
        return;
    }

    $params['id'] = $id;
    $setClause = implode(", ", $updateFields);

    $dbInstance = new Database();
    $conn = $dbInstance->pdo;

    try {
        $sql = "UPDATE users SET $setClause WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);

        if ($stmt->rowCount() > 0) {
            (new ApiResponse(200, "User updated successfully"))->toJson();
        } else {
            (new ApiResponse(404, "No changes or user not found"))->toJson();
        }
    } catch (PDOException $e) {
        (new ApiResponse(500, "Database error", $e->getMessage()))->toJson();
    }
});

// Search users
$router->add('POST', '/master/users/search', function () {
    $jwt = new JwtHandler();
    $handler = new Handler();
    $_user = $jwt->validate();

    // Decode and validate input
    $data = json_decode(file_get_contents("php://input"), true);
    $handler->validateInput($data, ['query']);

    $query = '%' . $data['query'] . '%';

    $dbInstance = new Database();
    $conn = $dbInstance->pdo;

    $sql = "
        SELECT * FROM users
        WHERE 
            name LIKE :query OR
            phone_no LIKE :query OR
            whatsapp_no LIKE :query OR
            address LIKE :query OR
            email LIKE :query
        ORDER BY id DESC
    ";

    try {
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':query', $query);
        $stmt->execute();

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        (new ApiResponse(200, "Success", $results))->toJson();
    } catch (PDOException $e) {
        (new ApiResponse(500, "Database error", $e->getMessage()))->toJson();
    }
});
