<?php

require_once __DIR__ . '/../core/JwtHandler.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Handler.php';

global $router;

// Create a new cutter name
$router->add('POST', '/master/cutterName/add', function () {
    $jwt = new JwtHandler();
    $handler = new Handler();

    
    $_user = $jwt->validate();

    $data = json_decode(file_get_contents("php://input"));

    if (!$data) {
        (new ApiResponse(400, "Invalid input data"))->toJson();
        return;
    }

    $dbInstance = new Database();
    $conn = $dbInstance->pdo;

    $conn->beginTransaction();

    try {
        $sql = "INSERT INTO cutters (name, address, phone_no, whatsapp_no) 
                VALUES (:name, :address, :phone_no, :whatsapp_no)";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':name', $data->name);
        $stmt->bindValue(':address', $data->address);
        $stmt->bindValue(':phone_no', $data->phone_no);
        $stmt->bindValue(':whatsapp_no', $data->whatsapp_no);

        $stmt->execute();
        $lastId = $conn->lastInsertId();
        $conn->commit();

        (new ApiResponse(200, "Success"))->toJson();
    } catch (Exception $e) {
        $conn->rollBack();
        (new ApiResponse(500, "Error: " . $e->getMessage()))->toJson();
    }
});

// Get all cutter names
$router->add('GET', '/master/cutterName', function () {
    $jwt = new JwtHandler();
    $handler = new Handler();

   
    $_user = $jwt->validate();

    $dbInstance = new Database();
    $conn = $dbInstance->pdo;

    try {
        $sql = "SELECT * FROM cutters";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $cutters = $stmt->fetchAll(PDO::FETCH_ASSOC);

        (new ApiResponse(200, "Success", $cutters))->toJson();
    } catch (Exception $e) {
        (new ApiResponse(500, "Error: " . $e->getMessage()))->toJson();
    }
});


// Update a cutter name
$router->add('POST', '/master/cutterName/update', function () {
    $jwt = new JwtHandler();
    $handler = new Handler();

    
    $_user = $jwt->validate();

    $data = json_decode(file_get_contents("php://input"));

    if (!$data) {
        (new ApiResponse(400, "Invalid input data"))->toJson();
        return;
    }

    $dbInstance = new Database();
    $conn = $dbInstance->pdo;

    try {
        $sql = "UPDATE cutters SET name = :name, address = :address, phone_no = :phone_no, whatsapp_no = :whatsapp_no WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':name', $data->name);
        $stmt->bindValue(':address', $data->address);
        $stmt->bindValue(':phone_no', $data->phone_no);
        $stmt->bindValue(':whatsapp_no', $data->whatsapp_no);
        $stmt->bindValue(':id', $data->id);

        if ($stmt->execute()) {
            (new ApiResponse(200, "Success"))->toJson();
        } else {
            (new ApiResponse(500, "Error: Unable to update cutter name"))->toJson();
        }
    } catch (Exception $e) {
        (new ApiResponse(500, "Error: " . $e->getMessage()))->toJson();
    }
});

// Delete a cutter name
$router->add('POST', '/master/cutterName/delete', function () {
    $jwt = new JwtHandler();
    $handler = new Handler();

    $_user = $jwt->validate();

    $data = json_decode(file_get_contents("php://input"));

    if (!$data || !isset($data->id) || !isset($data->status)) {
        (new ApiResponse(400, "Invalid input data"))->toJson();
        return;
    }

    $dbInstance = new Database();
    $conn = $dbInstance->pdo;

    try {
        $sql = "UPDATE cutters SET status = :status WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':status', $data->status ? 1 : 0, PDO::PARAM_INT); // Convert boolean to 1/0
        $stmt->bindValue(':id', $data->id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            (new ApiResponse(200, "Status updated successfully"))->toJson();
        } else {
            (new ApiResponse(500, "Error: Unable to update cutter status"))->toJson();
        }
    } catch (Exception $e) {
        (new ApiResponse(500, "Error: " . $e->getMessage()))->toJson();
    }
});

?>
