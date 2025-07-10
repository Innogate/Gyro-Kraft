<?php
    require_once __DIR__ . '/../core/JwtHandler.php';
    require_once __DIR__ . '/../core/Database.php';
    require_once __DIR__ . '/../core/Handler.php';

    global $router;
    // Create a new cutting step
    $router->add('POST', '/cuttingSteps/add', function () {
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
        $sql = "INSERT INTO cutting (order_id, issue_date, delivery_date, cutter_id, lot_no, total_qty, created_by, created_at) 
            VALUES (:order_id, :issue_date,:delivery_date, :cutter_id, :lot_no, :total_qty, :created_by, NOW())";

            $data->created_by = $_user->id;
            // $data->date = date('d-m-y', strtotime($data->issue_date));

            $stmt = $conn->prepare($sql);
            $stmt->bindValue(':order_id', $data->order_id);
            $stmt->bindValue(':issue_date', $data->issue_date);
            $stmt->bindValue(':delivery_date', $data->delivery_date);
            $stmt->bindValue(':cutter_id', $data->cutter_id);
            $stmt->bindValue(':lot_no', $data->lot_no);
            $stmt->bindValue(':total_qty', $data->total_qty);
            $stmt->bindValue(':created_by', $data->created_by);
            $stmt->execute();
            $lastId = $conn->lastInsertId();
            $conn->commit();    
                (new ApiResponse(200, "Success"))->toJson();
            } catch (Exception $e) {
                $conn->rollBack();
                (new ApiResponse(500, "Error: " . $e->getMessage()))->toJson();
            }
        });

    // Update a cutting step by ID
    $router->add('POST', '/cuttingSteps/update', function () {
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
            $sql = "UPDATE cutting SET issue_date = :issue_date, delivery_date = :delivery_date, 
                    cutter_id = :cutter_id, lot_no = :lot_no, total_qty = :total_qty, 
                    updated_by = :updated_by, updated_at = NOW() WHERE id = :id";

            $data->updated_by = $_user->id;

            $stmt = $conn->prepare($sql);
            $stmt->bindValue(':id', $data->id);
            $stmt->bindValue(':issue_date', $data->issue_date);
            $stmt->bindValue(':delivery_date', $data->delivery_date);
            $stmt->bindValue(':cutter_id', $data->cutter_id);
            $stmt->bindValue(':lot_no', $data->lot_no);
            $stmt->bindValue(':total_qty', $data->total_qty);
            $stmt->bindValue(':updated_by', $data->updated_by);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $conn->commit();
                (new ApiResponse(200, "Success"))->toJson();
            } else {
                (new ApiResponse(404, "No data found to update"))->toJson();
            }
        } catch (Exception $e) {
            $conn->rollBack();
            (new ApiResponse(500, "Error: " . $e->getMessage()))->toJson();
        }
    });

    // Delete a cutting step by ID
    $router->add('POST', '/cuttingSteps/delete', function () {
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
            $sql = "DELETE FROM cutting WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(':id', $data->id);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $conn->commit();
                (new ApiResponse(200, "Success"))->toJson();
            } else {
                (new ApiResponse(404, "No data found to delete"))->toJson();
            }
        } catch (Exception $e) {
            $conn->rollBack();
            (new ApiResponse(500, "Error: " . $e->getMessage()))->toJson();
        }
    });

    // Get all cutting steps data
    $router->add('POST', '/cuttingSteps/gateAllByorderId', function () {
        $jwt = new JwtHandler();
        $handler = new Handler();  
        $_user = $jwt->validate();
        $dbInstance = new Database();
        $conn = $dbInstance->pdo;

        $data = json_decode(file_get_contents("php://input"));
        if (!$data) {
            (new ApiResponse(400, "Invalid input data"))->toJson();
            return;
        }

        try {
            $sql = "SELECT cutting.*, cutters.name 
                    FROM cutting 
                    LEFT JOIN cutters ON cutting.cutter_id = cutters.id 
                    WHERE cutting.order_id = :order_id";
            
            $conn->beginTransaction();

            if (!$conn) {
                throw new Exception("Database connection failed");
            }

            if (!isset($data->order_id)) {
                throw new Exception("Order Id is required");
            }   

            $stmt = $conn->prepare($sql);
            $stmt->bindValue(':order_id', $data->order_id);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $conn->commit();

            // Convert date fields to DD-MM-YYYY
            foreach ($result as &$row) {
                if (isset($row['issue_date'])) {
                    $row['issue_date'] = date('d-m-Y', strtotime($row['issue_date']));
                }
                if (isset($row['delivery_date'])) {
                    $row['delivery_date'] = date('d-m-Y', strtotime($row['delivery_date']));
                }
            }
            if ($result) {
                (new ApiResponse(200, "Success", $result))->toJson();
            } else {
                (new ApiResponse(404, "No data found"))->toJson();
            }
        } catch (Exception $e) {
            $conn->rollBack();
            (new ApiResponse(500, "Error: " . $e->getMessage()))->toJson();
        }
    });

    $router->add('POST', '/cutting/oder/list', function () {
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
                FROM orders WHERE stage = '1'
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
?>