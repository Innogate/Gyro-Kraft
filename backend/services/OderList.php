<?php
require_once __DIR__ . '/../core/JwtHandler.php';
require_once __DIR__ . '/../core/Database.php';

global $router;

$router->add('POST', '/orderList/get', function () {
    $jwt = new JwtHandler();
    $handler = new Handler();
    $_user = $jwt->validate();

    // Decode incoming JSON data
    $data = json_decode(file_get_contents("php://input"), true);
    $handler->validateInput($data, ["max", "current"]);

    $max = (int) $data['max'];
    $current = (int) $data['current'];

    if ($max <= 0 || $max > 100 || $current < 0) {
        (new ApiResponse(400, "Invalid pagination values"))->toJson();
        return;
    }

    $dbInstance = new Database();
    $conn = $dbInstance->pdo;

    // Get total count of orders
    $countStmt = $conn->query("SELECT COUNT(*) as total FROM orders");
    $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Get paginated orders
    $sql = "SELECT * FROM orders ORDER BY id DESC LIMIT :limit OFFSET :offset";
    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':limit', $max, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $current, PDO::PARAM_INT);
    $stmt->execute();
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return result with total
    $response = [
        "total" => (int) $total,
        "orders" => $orders
    ];

    (new ApiResponse(200, "Success", $response))->toJson();
});
$router->add('POST', '/orderList/create', function () {
    $jwt = new JwtHandler();
    $handler = new Handler();
    $_user = $jwt->validate();

    // Decode incoming JSON data
    $data = json_decode(file_get_contents("php://input"), true);

    // Validate required fields
    $handler->validateInput($data, [
        "unique_id",
        "order_date",
        "buyer",
        "style_no",
        "brand",
        "season",
        "age_group_id",
        "shipment_date",
        "deadline_date"
    ]);

    // Optional fields with null fallback
    $pattern = $data['pattern'] ?? null;
    $printing = $data['printing'] ?? null;
    $documents = $data['documents'] ?? null;
    $steps_required = $data['steps_required'] ?? null;
    $remark = $data['remark'] ?? null;

    $dbInstance = new Database();
    $conn = $dbInstance->pdo;

    try {
        $sql = "INSERT INTO orders (
            unique_id, order_date, buyer, style_no, brand, season, age_group_id, 
            shipment_date, deadline_date, pattern, printing, documents, steps_required, remark
        ) VALUES (
            :unique_id, :order_date, :buyer, :style_no, :brand, :season, :age_group_id, 
            :shipment_date, :deadline_date, :pattern, :printing, :documents, :steps_required, :remark
        )";

        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":unique_id"       => $data['unique_id'],
            ":order_date"      => $data['order_date'],
            ":buyer"           => $data['buyer'],
            ":style_no"        => $data['style_no'],
            ":brand"           => $data['brand'],
            ":season"          => $data['season'],
            ":age_group_id"    => $data['age_group_id'],
            ":shipment_date"   => $data['shipment_date'],
            ":deadline_date"   => $data['deadline_date'],
            ":pattern"         => $pattern,
            ":printing"        => $printing,
            ":documents"       => $documents,
            ":steps_required"  => $steps_required,
            ":remark"          => $remark
        ]);

        (new ApiResponse(201, "Order created successfully"))->toJson();
    } catch (PDOException $e) {
        (new ApiResponse(500, "Database error: " . $e->getMessage()))->toJson();
    }
});
