<?php

require_once __DIR__ . '/../core/JwtHandler.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Handler.php';

global $router;

// Create a new order received
$router->add('POST', '/orderReceived/add', function () {
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
        $sql = "INSERT INTO order_received (order_id, cutting_id, received_date, received_qty, deffective_qty, received_by, remark, created_at, updated_at, updated_by) 
                VALUES (:order_id, :cutting_id, :received_date, :received_qty, :deffective_qty, :received_by, :remark, NOW(), NOW(), :updated_by)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':order_id', $data->order_id);
        $stmt->bindParam(':cutting_id', $data->cutting_id);
        $stmt->bindParam(':received_date', $data->received_date);
        $stmt->bindParam(':received_qty', $data->received_qty);
        $stmt->bindParam(':deffective_qty', $data->deffective_qty);
        $stmt->bindParam(':received_by', $_user->id);
        $stmt->bindParam(':remark', $data->remark);
        $stmt->bindParam(':updated_by', $_user->id);
        $stmt->execute();
        if ($stmt->rowCount() === 0) {
            throw new Exception("Failed to insert order received");
        }
        
        
        $lastId = $conn->lastInsertId();
        $conn->commit();
        
        (new ApiResponse(200, "Success"))->toJson();
    } catch (Exception $e) {
        $conn->rollBack();
        (new ApiResponse(500, "Error: " . $e->getMessage()))->toJson();
    }
});


// Get all order received by order ID post method
$router->add('POST', '/orderReceived/getByOrderId', function () {
    $jwt = new JwtHandler();
    $handler = new Handler();  
    $_user = $jwt->validate();
    $data = json_decode(file_get_contents("php://input"));
    if (!$data || !isset($data->order_id)) {
        (new ApiResponse(400, "Invalid input data"))->toJson();
        return;
    }
    
    $dbInstance = new Database();
    $conn = $dbInstance->pdo;
    
    try {
      $sql = "SELECT 
            order_received.*, 
            cutters.name AS cutter_name,
            cutting.lot_no,
            cutting.total_qty,
            cutting.issue_date,
            cutting.delivery_date
        FROM order_received
        LEFT JOIN cutting ON order_received.cutting_id = cutting.id
        LEFT JOIN cutters ON cutters.id = cutting.cutter_id
        WHERE order_received.order_id = :order_id";


        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':order_id', $data->order_id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($result as &$row) {
        if (isset($row['issue_date'])) {
            $row['issue_date'] = date('d-m-Y', strtotime($row['issue_date']));
        }
        if (isset($row['delivery_date'])) {
            $row['delivery_date'] = date('d-m-Y', strtotime($row['delivery_date']));
        }
    }
            (new ApiResponse(200, "Success", $result))->toJson();
        } else {
            (new ApiResponse(404, "No records found"))->toJson();
        }
    } catch (Exception $e) {
        (new ApiResponse(500, "Error: " . $e->getMessage()))->toJson();
    }
});

