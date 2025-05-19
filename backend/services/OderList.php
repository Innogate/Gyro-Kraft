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
        $sql = "INSERT INTO orders (unique_id, order_date, buyer, style_no, brand, season, age_group_id, shipment_date, pattern, printing, documents, steps_required, remark, deadline_date) VALUES (:unique_id, :order_date, :buyer, :style_no, :brand, :season, :age_group_id, :shipment_date, :pattern, :printing, :documents, :steps_required, :remark, :deadline_date)";

        $stmt = $conn->prepare($sql);

        $stmt->bindValue(':unique_id', $data['uniqueId'], PDO::PARAM_STR);
        $stmt->bindValue(':order_date', $data['date'], PDO::PARAM_STR);
        $stmt->bindValue(':buyer', $data['buyer'], PDO::PARAM_STR);
        $stmt->bindValue(':style_no', $data['styleNo'], PDO::PARAM_STR);
        $stmt->bindValue(':brand', $data['brand'], PDO::PARAM_STR);
        $stmt->bindValue(':season', $data['season'], PDO::PARAM_STR);
        $stmt->bindValue(':age_group_id', $data['ageGroup'], PDO::PARAM_INT);
        $stmt->bindValue(':shipment_date', $data['shipmentDate'], PDO::PARAM_STR);
        $stmt->bindValue(':pattern', $data['pattern'], PDO::PARAM_STR);
        $stmt->bindValue(':printing', $data['printing'], PDO::PARAM_STR);
        $stmt->bindValue(':documents', json_encode($data['documents']), PDO::PARAM_STR);
        $stmt->bindValue(':steps_required', $data['steps'], PDO::PARAM_STR);
        $stmt->bindValue(':remark', $data['remark'], PDO::PARAM_STR);
        $stmt->bindValue(':deadline_date', $data['deadlineDate'], PDO::PARAM_STR);
        
        $stmt->execute();
        $order_id = $conn->lastInsertId();

    } catch (Exception $e) {
        $conn->rollBack();
        (new ApiResponse(500, "Error-1", $e->getMessage()))->toJson();
        return;
    }

    if (isset($data['poQty']) && is_array($data['poQty'])) {
        $sql = "INSERT INTO order_po_qty (order_id, combo, pro_color, fabric_quality, supplier, preemie, nb, total_qty) VALUES (:order_id, :combo, :pro_color, :fabric_quality, :supplier, :preemie, :nb, :total_qty)";

        $stmt = $conn->prepare($sql);

        foreach ($data['poQty'] as $poQty) {
            $stmt->bindValue(':order_id', $order_id, PDO::PARAM_INT);
            $stmt->bindValue(':combo', $poQty['combo'], PDO::PARAM_STR);
            $stmt->bindValue(':pro_color', $poQty['proColor'], PDO::PARAM_STR);
            $stmt->bindValue(':fabric_quality', $poQty['fabricQuality'], PDO::PARAM_STR);
            $stmt->bindValue(':supplier', $poQty['supplier'], PDO::PARAM_STR);
            $stmt->bindValue(':preemie', $poQty['preemie'], PDO::PARAM_INT);
            $stmt->bindValue(':nb', $poQty['nb'], PDO::PARAM_INT);
            $stmt->bindValue(':total_qty', $poQty['totalQty'], PDO::PARAM_INT);
            $stmt->execute();
            $poQty_id = $conn->lastInsertId();
            if (isset($poQty['articles'])) {
                try{
                    $sql = "INSERT INTO order_articles (po_id, poQty_id, age_group_id, article_no,
                    qty, gender, product_photos)
                    VALUES (:order_id, :po_qty_id, :age_group_id, :article_no, :qty, :gender, :product_photos)";
                    $stmt = $conn->prepare($sql);
    
                    foreach ($poQty['articles'] as $article) {
                        $stmt->bindValue(':order_id', $order_id, PDO::PARAM_INT);
                        $stmt->bindValue(':po_qty_id', $poQty_id, PDO::PARAM_INT);
                        $stmt->bindValue(':age_group_id', $article['ageGroup'], PDO::PARAM_INT);
                        $stmt->bindValue(':article_no', $article['articleNo'], PDO::PARAM_INT);
                        $stmt->bindValue(':qty', $article['qty'], PDO::PARAM_INT);
                        $stmt->bindValue(':gender', $article['gender'], PDO::PARAM_STR);
                        $stmt->bindValue(':product_photos', json_encode($article['productPhotos']), PDO::PARAM_STR);
                        $stmt->execute();
                    }
                }
                catch (Exception $e) {
                    $conn->rollBack();
                    (new ApiResponse(500, "Error-2", $e->getMessage()))->toJson();
                    return;
                }
            }
    
        }
    }

    if (isset($data['fabricBOM']) && is_array($data['fabricBOM'])) {
        $sql = "INSERT INTO bom_fabrics (
        order_id, 
        fabric, 
        colour, 
        tpx, 
        description
        ) VALUES (
        :order_id, 
        :fabric, 
        :color, 
        :tpx, 
        :description)";
        try {
            $stmt = $conn->prepare($sql);
            foreach ($data['fabricBOM'] as $fabricBOM) {
                $stmt->bindValue(':order_id', $order_id, PDO::PARAM_INT);
                $stmt->bindValue(':fabric', $fabricBOM['fabric'], PDO::PARAM_STR);
                $stmt->bindValue(':color', $fabricBOM['colour'], PDO::PARAM_STR);
                $stmt->bindValue(':tpx', $fabricBOM['tpx'], PDO::PARAM_STR);
                $stmt->bindValue(':description', $fabricBOM['description'], PDO::PARAM_STR);
                $stmt->execute();
            }
        } catch (Exception $e) {
            $conn->rollBack();
            (new ApiResponse(500, "Error-3", $e->getMessage()))->toJson();
            return;
        }
    }

    if (isset($data['accessoriesBOM']) && is_array($data['accessoriesBOM'])) {
        $sql = "INSERT INTO bom_accessories (order_id, particular, specification, shade_no, consumption, supplier, status) VALUES (:order_id, :particular, :specification, :shade_no, :consumption, :supplier, :status)";
        try {
            $stmt = $conn->prepare($sql);
            foreach ($data['accessoriesBOM'] as $accessoriesBOM) {
                $stmt->bindValue(':order_id', $order_id, PDO::PARAM_INT);
                $stmt->bindValue(':particular', $accessoriesBOM['particular'], PDO::PARAM_STR);
                $stmt->bindValue(':specification', $accessoriesBOM['specification'], PDO::PARAM_STR);
                $stmt->bindValue(':shade_no', $accessoriesBOM['shadeNo'], PDO::PARAM_STR);
                $stmt->bindValue(':consumption', $accessoriesBOM['consumption'], PDO::PARAM_STR);
                $stmt->bindValue(':supplier', $accessoriesBOM['supplier'], PDO::PARAM_STR);
                $stmt->bindValue(':status', $accessoriesBOM['status'], PDO::PARAM_STR);
                $stmt->execute();
            }
        } catch (Exception $e) {
            $conn->rollBack();
            (new ApiResponse(500, "Error-4", $e->getMessage()))->toJson();
            return;
        }
        
    }

    $conn->commit();
    
    // SELECT NEW ENTER VALUE
    $sql = "SELECT o.*, ag.name as age_group_name
            FROM orders o
            LEFT JOIN age_groups ag ON o.age_group_id = ag.id
            WHERE o.id = :order_id";
    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':order_id', $order_id, PDO::PARAM_INT);
    $stmt->execute();
    $response = $stmt->fetch(PDO::FETCH_ASSOC);

    (new ApiResponse(200, "Success", $response))->toJson();
});
