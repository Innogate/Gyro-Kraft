<?php

require_once __DIR__ . '/../core/JwtHandler.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Handler.php';

global $router;

// GET USER permission
$router->add('GET', '/users/permission', function () {
    $pageID = 3;
    $jwt = new JwtHandler();
    $handler = new Handler();
    $_user = $jwt->validate();

    // Create a new database connection
    $dbInstance = new Database();
    $conn = $dbInstance->pdo;

    try {
        $sql = "SELECT * FROM permissions WHERE user_id = :userId";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":userId", $_user->id);
        $stmt->execute();

    } catch (PDOException $e) {
        (new ApiResponse(500, "Database error", $e->getMessage()))->toJson();
    }
    $permission = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($permission == null) {
        (new ApiResponse(200, "Success", []))->toJson();
    }
    (new ApiResponse(200, "Success", $permission))->toJson();
});


// GET USER permission by UserId
$router->add('POST', '/users/permission/byUserId', function () {
    $pageID = 3;
    $jwt = new JwtHandler();
    $handler = new Handler();
    $_user = $jwt->validate();

    $data = json_decode(file_get_contents("php://input"), true);
    $handler->validateInput($data, ["user_id"]);

    // Create a new database connection
    $dbInstance = new Database();
    $conn = $dbInstance->pdo;

    try {
        $sql = "SELECT * FROM permissions WHERE user_id = :userId";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":userId", $data['user_id']);
        $stmt->execute();

    } catch (PDOException $e) {
        (new ApiResponse(500, "Database error", $e->getMessage()))->toJson();
    }
    $permission = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($permission == null) {
        (new ApiResponse(200, "Success", []))->toJson();
    }
    (new ApiResponse(200, "Success", $permission))->toJson();
});


// POST CREATE permission
$router->add('POST', '/users/permission/create', function () {
    $pageID = 3;
    $jwt = new JwtHandler();
    $handler = new Handler();
    $_user = $jwt->validate();
    
    // Decode incoming JSON data
    $data = json_decode(file_get_contents("php://input"), true);
    $handler->validateInput($data, ["user_id","module_id", "can_add", "can_edit", "can_delete"]);


    $dbInstance = new Database();
    $conn = $dbInstance->pdo;

    $sql = "insert into permissions (user_id, module_id, can_add, can_edit, can_delete) values
  (:user_id, :module_id, :can_add, :can_edit, :can_delete);";
  
    try {
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":user_id", $data['user_id']);
        $stmt->bindParam(":module_id", $data['module_id']);
        $stmt->bindParam(":can_add", $data['can_add']);
        $stmt->bindParam(":can_edit", $data['can_edit']);
        $stmt->bindParam(":can_delete", $data['can_delete']);
        $stmt->execute();

        $lastInsertId = $conn->lastInsertId();
        (new ApiResponse(200, "Success", $lastInsertId))->toJson();
    }
    catch (PDOException $e) {
        (new ApiResponse(500, "Database error", $e->getMessage()))->toJson();
    }
});

// Update user permission
$router->add('POST', '/users/permission/delete', function () {
    $pageID = 3;
    $jwt = new JwtHandler();
    $handler = new Handler();
    $_user = $jwt->validate();
    // Decode incoming JSON data
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Validate required fields
    $handler->validateInput($data, ['permission_id']);

    $dbInstance = new Database();
    $conn = $dbInstance->pdo;

    $sql = "DELETE FROM permissions WHERE id = :id";
    try {
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":id", $data['permission_id']);
        $stmt->execute();
    } catch (PDOException $e) {
        (new ApiResponse(500, "Database error", $e->getMessage()))->toJson();
    }
    (new ApiResponse(200, "Success"))->toJson();
});


// GET PERMISSION Module List
$router->add('GET', '/users/permission/moduleList', function () {
    $pageID = 3;
    $jwt = new JwtHandler();
    $handler = new Handler();
    $_user = $jwt->validate();

    $dbInstance = new Database();
    $conn = $dbInstance->pdo;

    try {
        $sql = "SELECT id, module_name, created_at FROM module";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $modules = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        (new ApiResponse(500, "Database error", $e->getMessage()))->toJson();
    }
    (new ApiResponse(200, "Success", $modules))->toJson();
});


$router->add('POST', '/users/permission/update', function () {
    $jwt = new JwtHandler();
    $handler = new Handler();
    $_user = $jwt->validate(); // Validate JWT token
    $userId = $_user->id;

    // Decode incoming JSON payload
    $permissions = json_decode(file_get_contents("php://input"), true);

    if (!isset($permissions) || !is_array($permissions)) {
        (new ApiResponse(400, "Invalid payload format.", null))->toJson();
        return;
    }

    $dbInstance = new Database();
    $conn = $dbInstance->pdo;

    try {
        foreach ($permissions as $perm) {
            // Validate individual permission entry
            $handler->validateInput($perm, ["id"]);

            $moduleId = $perm['id'];
            $canAdd = isset($perm['can_add']) && $perm['can_add'] ? 1 : 0;
            $canEdit = isset($perm['can_edit']) && $perm['can_edit'] ? 1 : 0;
            $canDelete = isset($perm['can_delete']) && $perm['can_delete'] ? 1 : 0;

            // Check if permission already exists
            $checkStmt = $conn->prepare("SELECT id FROM permissions WHERE user_id = :user_id AND module_id = :module_id");
            $checkStmt->bindParam(":user_id", $userId);
            $checkStmt->bindParam(":module_id", $moduleId);
            $checkStmt->execute();

            if ($checkStmt->rowCount() > 0) {
                // Update existing record
                $updateStmt = $conn->prepare("
                    UPDATE permissions
                    SET can_add = :can_add, can_edit = :can_edit, can_delete = :can_delete
                    WHERE user_id = :user_id AND module_id = :module_id
                ");
                $updateStmt->bindParam(":can_add", $canAdd);
                $updateStmt->bindParam(":can_edit", $canEdit);
                $updateStmt->bindParam(":can_delete", $canDelete);
                $updateStmt->bindParam(":user_id", $userId);
                $updateStmt->bindParam(":module_id", $moduleId);
                $updateStmt->execute();
            } else {
                // Insert new record
                $insertStmt = $conn->prepare("
                    INSERT INTO permissions (user_id, module_id, can_add, can_edit, can_delete)
                    VALUES (:user_id, :module_id, :can_add, :can_edit, :can_delete)
                ");
                $insertStmt->bindParam(":user_id", $userId);
                $insertStmt->bindParam(":module_id", $moduleId);
                $insertStmt->bindParam(":can_add", $canAdd);
                $insertStmt->bindParam(":can_edit", $canEdit);
                $insertStmt->bindParam(":can_delete", $canDelete);
                $insertStmt->execute();
            }
        }

        (new ApiResponse(200, "Permissions successfully updated.", null))->toJson();
    } catch (PDOException $e) {
        (new ApiResponse(500, "Database error", $e->getMessage()))->toJson();
    } catch (Exception $e) {
        (new ApiResponse(400, "Error", $e->getMessage()))->toJson();
    }
});



