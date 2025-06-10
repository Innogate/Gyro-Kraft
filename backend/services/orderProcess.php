<?php
require_once __DIR__ . '/../core/JwtHandler.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Handler.php';

global $router;

// Get PO Quantity by order ID
$router->add('POST', '/order/poqtByorderId', function () {
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
    try{
        $sql = "SELECT * from order_po_qty WHERE order_id = :order_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':order_id', $data->order_id);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $conn->commit();
        if ($result) {
            (new ApiResponse(200, "Success", $result))->toJson();
        } else {
            (new ApiResponse(404, "No data found"))->toJson();
    }} catch (Exception $e) {
        $conn->rollBack();
        (new ApiResponse(500, "Error: " . $e->getMessage()))->toJson();
    }
});
?>
