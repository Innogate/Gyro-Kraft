<?php
require_once __DIR__ . '/../core/JwtHandler.php';
require_once __DIR__ . '/../core/Database.php';

global $router;

$router->add('POST', '/orderList/get', function () {
    $jwt = new JwtHandler();
    $handler = new Handler();
    $_user = $jwt->validate();

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

    // Total count
    $countStmt = $conn->query("SELECT COUNT(*) as total FROM orders");
    $total = (int) $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

    $offset = $current * $max;

    $sql = "SELECT o.*, ag.name as age_group_name
            FROM orders o
            LEFT JOIN age_groups ag ON o.age_group_id = ag.id
            ORDER BY o.id DESC
            LIMIT :limit OFFSET :offset";

    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':limit', $max, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Decode JSON documents and format dates
    foreach ($orders as &$order) {
        $order['documents'] = $order['documents'] ? json_decode($order['documents'], true) : null;

        $order['order_date'] = $order['order_date'] ? date('c', strtotime($order['order_date'])) : null;
        $order['shipment_date'] = $order['shipment_date'] ? date('c', strtotime($order['shipment_date'])) : null;
        $order['deadline_date'] = $order['deadline_date'] ? date('c', strtotime($order['deadline_date'])) : null;
    }

    $response = [
        "total" => $total,
        "orders" => $orders
    ];

    (new ApiResponse(200, "Success", $response))->toJson();
});

$router->add('POST', '/orderList/create', function () {
    $jwt = new JwtHandler();
    $handler = new Handler();
    $_user = $jwt->validate();

    $data = json_decode(file_get_contents("php://input"), true);

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

    $dbInstance = new Database();
    $conn = $dbInstance->pdo;

    // Validate age_group_id
    $ageGroupStmt = $conn->prepare("SELECT COUNT(*) FROM age_groups WHERE id = :id");
    $ageGroupStmt->execute([':id' => $data['age_group_id']]);
    if ($ageGroupStmt->fetchColumn() == 0) {
        (new ApiResponse(400, "Invalid age_group_id"))->toJson();
        return;
    }

    // Handle documents array to JSON
    $documentsArray = $data['documents'] ?? null;
    if (is_array($documentsArray)) {
        $documentsJson = json_encode($documentsArray);
    } else {
        $documentsJson = null;
    }

    // Optional fields
    $pattern = $data['pattern'] ?? null;
    $printing = $data['printing'] ?? null;
    $steps_required = $data['steps_required'] ?? null;
    $remark = $data['remark'] ?? null;

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
            ":documents"       => $documentsJson,
            ":steps_required"  => $steps_required,
            ":remark"          => $remark
        ]);

        (new ApiResponse(201, "Order created successfully"))->toJson();
    } catch (PDOException $e) {
        (new ApiResponse(500, "Database error: " . $e->getMessage()))->toJson();
    }
});
