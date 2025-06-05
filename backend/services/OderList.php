<?php
require_once __DIR__ . '/../core/JwtHandler.php';
require_once __DIR__ . '/../core/Database.php';

global $router;

$router->add('POST', '/orderList/get', function () {
    $jwt = new JwtHandler();
    $handler = new Handler();
    $_user = $jwt->validate();

    $data = json_decode(file_get_contents("php://input"), true);
    $handler->validateInput($data, ["page", "pageSize", "search"]);

    $max = (int) $data['pageSize'];
    $current = (int) $data['page'];

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

    $sql = "SELECT id,style_no,description,age_group,pattern,order_date,buyer,brand,season,shipment_date,documents,remark
            FROM orders
            ORDER BY id DESC
            LIMIT :limit OFFSET :offset";

    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':limit', $max, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response = [
        "total" => $total,
        "orders" => $orders
    ];

    (new ApiResponse(200, "Success", $response))->toJson();
});

$router->add('POST', '/orderList/create', function () {
    $jwt = new JwtHandler();
    $_user = $jwt->validate();

    $data = json_decode(file_get_contents("php://input"), true);

    $dbInstance = new Database();
    $conn = $dbInstance->pdo;

    $conn->beginTransaction();
    try {
        // Insert into orders
        $sql = "INSERT INTO orders (
            style_no, description, order_date, buyer, brand, season,
            age_group, shipment_date, pattern, remark, documents
        ) VALUES (
            :style_no, :description, :order_date, :buyer, :brand, :season,
            :age_group, :shipment_date, :pattern, :remark, :documents
        )";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':style_no', $data['styleNo']);
        $stmt->bindValue(':description', $data['description']);
        $stmt->bindValue(':order_date', $data['date']);
        $stmt->bindValue(':buyer', $data['buyer']);
        $stmt->bindValue(':brand', $data['brand']);
        $stmt->bindValue(':season', $data['season']);
        $stmt->bindValue(':age_group', $data['ageGroup']);
        $stmt->bindValue(':shipment_date', $data['shipmentDate']);
        $stmt->bindValue(':pattern', $data['pattern']);
        $stmt->bindValue(':remark', $data['remark']);
        $stmt->bindValue(':documents', json_encode($data['documents']));
        $stmt->execute();
        $order_id = $conn->lastInsertId();
    } catch (Exception $e) {
        $conn->rollBack();
        (new ApiResponse(500, "Failed to insert order", $e->getMessage()))->toJson();
        return;
    }

    // Insert PO Quantities
    try {
        if (!empty($data['poQty']) && is_array($data['poQty'])) {
            $sql = "INSERT INTO order_po_qty (
                order_id, combo, pro_color, fabric_quality, supplier, preemie, nb, total_qty
            ) VALUES (
                :order_id, :combo, :pro_color, :fabric_quality, :supplier, :preemie, :nb, :total_qty
            )";
            $stmt = $conn->prepare($sql);
            foreach ($data['poQty'] as $po) {
                $stmt->bindValue(':order_id', $order_id, PDO::PARAM_INT);
                $stmt->bindValue(':combo', $po['combo']);
                $stmt->bindValue(':pro_color', $po['color']);
                $stmt->bindValue(':fabric_quality', $po['fabric']);
                $stmt->bindValue(':supplier', $po['item']);
                $stmt->bindValue(':preemie', 0, PDO::PARAM_INT); // default
                $stmt->bindValue(':nb', 0, PDO::PARAM_INT);       // default
                $stmt->bindValue(':total_qty', $po['totalQty'], PDO::PARAM_INT);
                $stmt->execute();
            }
        }
    } catch (Exception $e) {
        $conn->rollBack();
        (new ApiResponse(500, "Failed to insert PO quantities", $e->getMessage()))->toJson();
        return;
    }

    // Insert BOM as accessoriesBOM
    try {
        if (!empty($data['accessoriesBOM']) && is_array($data['accessoriesBOM'])) {
            $sql = "INSERT INTO bom (
                order_id, description, fabric, colour, tpx
            ) VALUES (
                :order_id, :description, :fabric, :colour, :tpx
            )";
            $stmt = $conn->prepare($sql);
            foreach ($data['accessoriesBOM'] as $bom) {
                $stmt->bindValue(':order_id', $order_id, PDO::PARAM_INT);
                $stmt->bindValue(':description', $bom['description']);
                $stmt->bindValue(':fabric', $bom['item']);
                $stmt->bindValue(':colour', $bom['status']);
                $stmt->bindValue(':tpx', $bom['consumption']);
                $stmt->execute();
            }
        }
    } catch (Exception $e) {
        $conn->rollBack();
        (new ApiResponse(500, "Failed to insert BOM", $e->getMessage()))->toJson();
        return;
    }

    $conn->commit();

    (new ApiResponse(200, "Order created successfully", ["orderId" => $order_id]))->toJson();
});

$router->add('POST', '/orderList/byId', function () {
    $jwt = new JwtHandler();
    $_user = $jwt->validate();

    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['orderId'])) {
        (new ApiResponse(400, "Missing orderId"))->toJson();
        return;
    }

    $order_id = $data['orderId'];

    $dbInstance = new Database();
    $conn = $dbInstance->pdo;

    try {
        // Fetch main order
        $sql = "SELECT * FROM orders WHERE id = :order_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':order_id', $order_id, PDO::PARAM_INT);
        $stmt->execute();
        $order = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$order) {
            (new ApiResponse(404, "Order not found"))->toJson();
            return;
        }

        $response = [
            "id" => $order['id'],
            "styleNo" => $order['style_no'],
            "description" => $order['description'],
            "ageGroup" => $order['age_group'],
            "pattern" => $order['pattern'],
            "date" => $order['order_date'],
            "buyer" => $order['buyer'],
            "brand" => $order['brand'],
            "season" => $order['season'],
            "shipmentDate" => $order['shipment_date'],
            "documents" => json_decode($order['documents'], true),
            "remark" => $order['remark'],
        ];

        // Get poQty
        $sql = "SELECT * FROM order_po_qty WHERE order_id = :order_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':order_id', $order_id, PDO::PARAM_INT);
        $stmt->execute();
        $poRows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $response['poQty'] = array_map(function ($row) {
            return [
                "fabric" => $row['fabric_quality'],
                "item" => $row['supplier'],
                "color" => $row['pro_color'],
                "combo" => $row['combo'],
                "size" => "", // Not in schema, leave blank or add column
                "qty" => "",  // Not in schema, leave blank or add column
                "totalQty" => (int)$row['total_qty']
            ];
        }, $poRows);

        // Get accessoriesBOM from `bom` table
        $sql = "SELECT * FROM bom WHERE order_id = :order_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':order_id', $order_id, PDO::PARAM_INT);
        $stmt->execute();
        $bomRows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $response['accessoriesBOM'] = array_map(function ($row) {
            return [
                "item" => $row['fabric'],
                "description" => $row['description'],
                "consumption" => $row['tpx'],  // Assuming TPX = consumption for simplicity
                "status" => $row['colour']
            ];
        }, $bomRows);

        (new ApiResponse(200, "Success", $response))->toJson();
    } catch (Exception $e) {
        (new ApiResponse(500, "Error", $e->getMessage()))->toJson();
    }
});



$router->add('POST', '/orderList/update', function () {
    $jwt = new JwtHandler();
    $_user = $jwt->validate();

    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['id'])) {
        (new ApiResponse(400, "Missing order ID"))->toJson();
        return;
    }

    $dbInstance = new Database();
    $conn = $dbInstance->pdo;

    $conn->beginTransaction();
    try {
        // Update main order
        $sql = "UPDATE orders SET
            style_no = :style_no,
            description = :description,
            order_date = :order_date,
            buyer = :buyer,
            brand = :brand,
            season = :season,
            age_group = :age_group,
            shipment_date = :shipment_date,
            pattern = :pattern,
            remark = :remark,
            documents = :documents
        WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':style_no', $data['styleNo']);
        $stmt->bindValue(':description', $data['description']);
        $stmt->bindValue(':order_date', $data['date']);
        $stmt->bindValue(':buyer', $data['buyer']);
        $stmt->bindValue(':brand', $data['brand']);
        $stmt->bindValue(':season', $data['season']);
        $stmt->bindValue(':age_group', $data['ageGroup']);
        $stmt->bindValue(':shipment_date', $data['shipmentDate']);
        $stmt->bindValue(':pattern', $data['pattern']);
        $stmt->bindValue(':remark', $data['remark']);
        $stmt->bindValue(':documents', json_encode($data['documents']));
        $stmt->bindValue(':id', $data['id'], PDO::PARAM_INT);
        $stmt->execute();
    } catch (Exception $e) {
        $conn->rollBack();
        (new ApiResponse(500, "Failed to update order", $e->getMessage()))->toJson();
        return;
    }

    $order_id = $data['id'];

    // Clear and re-insert PO Quantities
    try {
        $conn->prepare("DELETE FROM order_po_qty WHERE order_id = :order_id")
            ->execute(['order_id' => $order_id]);

        if (!empty($data['poQty']) && is_array($data['poQty'])) {
            $sql = "INSERT INTO order_po_qty (
                order_id, combo, pro_color, fabric_quality, supplier, preemie, nb, total_qty
            ) VALUES (
                :order_id, :combo, :pro_color, :fabric_quality, :supplier, :preemie, :nb, :total_qty
            )";
            $stmt = $conn->prepare($sql);

            foreach ($data['poQty'] as $po) {
                $stmt->bindValue(':order_id', $order_id, PDO::PARAM_INT);
                $stmt->bindValue(':combo', $po['combo']);
                $stmt->bindValue(':pro_color', $po['color']);
                $stmt->bindValue(':fabric_quality', $po['fabric']);
                $stmt->bindValue(':supplier', $po['item']);
                $stmt->bindValue(':preemie', 0);
                $stmt->bindValue(':nb', 0);
                $stmt->bindValue(':total_qty', $po['totalQty'], PDO::PARAM_INT);
                $stmt->execute();
            }
        }
    } catch (Exception $e) {
        $conn->rollBack();
        (new ApiResponse(500, "Failed to update PO Qty", $e->getMessage()))->toJson();
        return;
    }

    // Clear and re-insert BOM (accessoriesBOM)
    try {
        $conn->prepare("DELETE FROM bom WHERE order_id = :order_id")
            ->execute(['order_id' => $order_id]);

        if (!empty($data['accessoriesBOM']) && is_array($data['accessoriesBOM'])) {
            $sql = "INSERT INTO bom (
                order_id, description, fabric, colour, tpx
            ) VALUES (
                :order_id, :description, :fabric, :colour, :tpx
            )";
            $stmt = $conn->prepare($sql);

            foreach ($data['accessoriesBOM'] as $bom) {
                $stmt->bindValue(':order_id', $order_id, PDO::PARAM_INT);
                $stmt->bindValue(':description', $bom['description']);
                $stmt->bindValue(':fabric', $bom['item']);
                $stmt->bindValue(':colour', $bom['status']);
                $stmt->bindValue(':tpx', $bom['consumption']);
                $stmt->execute();
            }
        }
    } catch (Exception $e) {
        $conn->rollBack();
        (new ApiResponse(500, "Failed to update BOM", $e->getMessage()))->toJson();
        return;
    }

    $conn->commit();

    (new ApiResponse(200, "Order updated successfully", ["orderId" => $order_id]))->toJson();
});
