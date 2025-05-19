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

    $sql = "SELECT id, unique_id, order_date, style_no, brand, season, age_group_id, shipment_date, pattern, printing, steps_required, remark, deadline_date
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
    $handler = new Handler();
    $_user = $jwt->validate();

    $data = json_decode(file_get_contents("php://input"), true);

    $dbInstance = new Database();
    $conn = $dbInstance->pdo;

    $conn->beginTransaction();
    try {
        // Insert into orders
        $sql = "INSERT INTO orders (
            unique_id, order_date, buyer, style_no, brand, season,
            age_group_id, shipment_date, pattern, printing, documents,
            steps_required, remark, deadline_date
        ) VALUES (
            :unique_id, :order_date, :buyer, :style_no, :brand, :season,
            :age_group_id, :shipment_date, :pattern, :printing, :documents,
            :steps_required, :remark, :deadline_date
        )";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':unique_id', $data['uniqueId']);
        $stmt->bindValue(':order_date', $data['date']);
        $stmt->bindValue(':buyer', $data['buyer']);
        $stmt->bindValue(':style_no', $data['styleNo']);
        $stmt->bindValue(':brand', $data['brand']);
        $stmt->bindValue(':season', $data['season']);
        $stmt->bindValue(':age_group_id', $data['ageGroup']); // must be int ID
        $stmt->bindValue(':shipment_date', $data['shipmentDate']);
        $stmt->bindValue(':pattern', $data['pattern']);
        $stmt->bindValue(':printing', $data['printing']);
        $stmt->bindValue(':documents', json_encode($data['documents']));
        $stmt->bindValue(':steps_required', $data['steps']);
        $stmt->bindValue(':remark', $data['remark']);
        $stmt->bindValue(':deadline_date', $data['deadlineDate']);
        $stmt->execute();
        $order_id = $conn->lastInsertId();
    } catch (Exception $e) {
        $conn->rollBack();
        (new ApiResponse(500, "Error-1", $e->getMessage()))->toJson();
        return;
    }

    // Insert PO Quantities and Articles
    try {
        if (!empty($data['poQty']) && is_array($data['poQty'])) {
            $sql = "INSERT INTO order_po_qty (
                order_id, combo, pro_color, fabric_quality, supplier,
                preemie, nb, total_qty
            ) VALUES (
                :order_id, :combo, :pro_color, :fabric_quality, :supplier,
                :preemie, :nb, :total_qty
            )";
            $stmt = $conn->prepare($sql);

            foreach ($data['poQty'] as $poQty) {
                $stmt->bindValue(':order_id', $order_id, PDO::PARAM_INT);
                $stmt->bindValue(':combo', $poQty['combo']);
                $stmt->bindValue(':pro_color', $poQty['proColor']);
                $stmt->bindValue(':fabric_quality', $poQty['fabricQuality']);
                $stmt->bindValue(':supplier', $poQty['supplier']);
                $stmt->bindValue(':preemie', $poQty['preemie'], PDO::PARAM_INT);
                $stmt->bindValue(':nb', $poQty['nb'], PDO::PARAM_INT);
                $stmt->bindValue(':total_qty', $poQty['totalQty'], PDO::PARAM_INT);
                $stmt->execute();
                $poQty_id = $conn->lastInsertId();

                if (!empty($poQty['articles']) && is_array($poQty['articles'])) {
                    $articleSql = "INSERT INTO order_articles (
                        po_id, poQty_id, age_group_id, article_no,
                        qty, gender, product_photos
                    ) VALUES (
                        :order_id, :po_qty_id, :age_group_id, :article_no,
                        :qty, :gender, :product_photos
                    )";
                    $articleStmt = $conn->prepare($articleSql);

                    foreach ($poQty['articles'] as $article) {
                        $articleStmt->bindValue(':order_id', $order_id, PDO::PARAM_INT);
                        $articleStmt->bindValue(':po_qty_id', $poQty_id, PDO::PARAM_INT);
                        $articleStmt->bindValue(':age_group_id', $article['ageGroup']);
                        $articleStmt->bindValue(':article_no', $article['articleNo']);
                        $articleStmt->bindValue(':qty', $article['qty'], PDO::PARAM_INT);
                        $articleStmt->bindValue(':gender', $article['gender']);
                        $articleStmt->bindValue(':product_photos', json_encode($article['productPhotos']));
                        $articleStmt->execute();
                    }
                }
            }
        }
    } catch (Exception $e) {
        $conn->rollBack();
        (new ApiResponse(500, "Error-2", $e->getMessage()))->toJson();
        return;
    }

    // Insert Fabric BOM
    try {
        if (!empty($data['fabricBOM']) && is_array($data['fabricBOM'])) {
            $sql = "INSERT INTO bom_fabrics (
                order_id, fabric, colour, tpx, description
            ) VALUES (
                :order_id, :fabric, :colour, :tpx, :description
            )";
            $stmt = $conn->prepare($sql);
            foreach ($data['fabricBOM'] as $fabricBOM) {
                $stmt->bindValue(':order_id', $order_id, PDO::PARAM_INT);
                $stmt->bindValue(':fabric', $fabricBOM['fabric']);
                $stmt->bindValue(':colour', $fabricBOM['colour']);
                $stmt->bindValue(':tpx', $fabricBOM['tpx']);
                $stmt->bindValue(':description', $fabricBOM['description']);
                $stmt->execute();
            }
        }
    } catch (Exception $e) {
        $conn->rollBack();
        (new ApiResponse(500, "Error-3", $e->getMessage()))->toJson();
        return;
    }

    // Insert Accessories BOM
    try {
        if (!empty($data['accessoriesBOM']) && is_array($data['accessoriesBOM'])) {
            $sql = "INSERT INTO bom_accessories (
                order_id, particular, specification, shade_no, consumption,
                supplier, status
            ) VALUES (
                :order_id, :particular, :specification, :shade_no, :consumption,
                :supplier, :status
            )";
            $stmt = $conn->prepare($sql);
            foreach ($data['accessoriesBOM'] as $accessoriesBOM) {
                $stmt->bindValue(':order_id', $order_id, PDO::PARAM_INT);
                $stmt->bindValue(':particular', $accessoriesBOM['particular']);
                $stmt->bindValue(':specification', $accessoriesBOM['specification']);
                $stmt->bindValue(':shade_no', $accessoriesBOM['shadeNo']);
                $stmt->bindValue(':consumption', $accessoriesBOM['consumption']);
                $stmt->bindValue(':supplier', $accessoriesBOM['supplier']);
                $stmt->bindValue(':status', $accessoriesBOM['status']);
                $stmt->execute();
            }
        }
    } catch (Exception $e) {
        $conn->rollBack();
        (new ApiResponse(500, "Error-4", $e->getMessage()))->toJson();
        return;
    }

    // Commit All Transactions
    $conn->commit();

    // Return the inserted order
    $sql = "SELECT o.*, ag.name AS age_group_name
            FROM orders o
            LEFT JOIN age_groups ag ON o.age_group_id = ag.id
            WHERE o.id = :order_id";
    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':order_id', $order_id, PDO::PARAM_INT);
    $stmt->execute();
    $response = $stmt->fetch(PDO::FETCH_ASSOC);

    (new ApiResponse(200, "Success", $response))->toJson();
});


$router->add('POST', '/orderList/byId', function () {
    $jwt = new JwtHandler();
    $_user = $jwt->validate();
    $handler = new Handler();
    
    $data = json_decode(file_get_contents("php://input"), true);
    $handler->validateInput($data, ["orderId"]);
    $order_id = $data['orderId'];

    $dbInstance = new Database();
    $conn = $dbInstance->pdo;

    try {
        // Fetch main order data
        $sql = "SELECT * FROM orders WHERE id = :order_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':order_id', $order_id, PDO::PARAM_INT);
        $stmt->execute();
        $order = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$order) {
            (new ApiResponse(404, "Order not found"))->toJson();
            return;
        }

        // Map order fields to required format
        $response = [
            "uniqueId" => $order['unique_id'],
            "date" => $order['order_date'],
            "buyer" => $order['buyer'],
            "styleNo" => $order['style_no'],
            "brand" => $order['brand'],
            "season" => $order['season'],
            "ageGroup" => $order['age_group_id'],  // You can convert to name if needed
            "shipmentDate" => $order['shipment_date'],
            "pattern" => $order['pattern'],
            "printing" => $order['printing'],
            "steps" => $order['steps_required'],
            "deadlineDate" => $order['deadline_date'],
            "remark" => $order['remark'],
            "documents" => json_decode($order['documents'], true),
        ];

        // Fetch poQty with articles
        $sql = "SELECT * FROM order_po_qty WHERE order_id = :order_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':order_id', $order_id, PDO::PARAM_INT);
        $stmt->execute();
        $poQtyRows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $poQty = [];
        foreach ($poQtyRows as $row) {
            $poQtyItem = [
                "combo" => $row['combo'],
                "proColor" => $row['pro_color'],
                "fabricQuality" => $row['fabric_quality'],
                "supplier" => $row['supplier'],
                "preemie" => (int)$row['preemie'],
                "nb" => (int)$row['nb'],
                "totalQty" => (int)$row['total_qty'],
                "articles" => []
            ];

            // Fetch articles for each poQty
            $sql = "SELECT * FROM order_articles WHERE poQty_id = :po_qty_id";
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(':po_qty_id', $row['id'], PDO::PARAM_INT);
            $stmt->execute();
            $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($articles as $article) {
                $poQtyItem['articles'][] = [
                    "ageGroup" => $article['age_group_id'],
                    "articleNo" => $article['article_no'],
                    "qty" => (int)$article['qty'],
                    "gender" => $article['gender'],
                    "productPhotos" => json_decode($article['product_photos'], true)
                ];
            }

            $poQty[] = $poQtyItem;
        }

        $response['poQty'] = $poQty;

        // Fetch fabricBOM
        $sql = "SELECT * FROM bom_fabrics WHERE order_id = :order_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':order_id', $order_id, PDO::PARAM_INT);
        $stmt->execute();
        $fabricBOM = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $response['fabricBOM'] = array_map(function ($row) {
            return [
                "description" => $row['description'],
                "fabric" => $row['fabric'],
                "colour" => $row['colour'],
                "tpx" => $row['tpx']
            ];
        }, $fabricBOM);

        // Fetch accessoriesBOM
        $sql = "SELECT * FROM bom_accessories WHERE order_id = :order_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':order_id', $order_id, PDO::PARAM_INT);
        $stmt->execute();
        $accessoriesBOM = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $response['accessoriesBOM'] = array_map(function ($row) {
            return [
                "particular" => $row['particular'],
                "specification" => $row['specification'],
                "shadeNo" => $row['shade_no'],
                "consumption" => $row['consumption'],
                "supplier" => $row['supplier'],
                "status" => $row['status']
            ];
        }, $accessoriesBOM);

        (new ApiResponse(200, "Success", $response))->toJson();
    } catch (Exception $e) {
        (new ApiResponse(500, "Error", $e->getMessage()))->toJson();
    }
});