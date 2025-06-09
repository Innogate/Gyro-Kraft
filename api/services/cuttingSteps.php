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
                $sql = "INSERT INTO cutting (order_id, date, cutter_id, po_qty_id, lot_no, total_qty, created_by, created_at) 
                    VALUES (:order_id, :date, :cutter_id, :po_qty_id, :lot_no, :total_qty, :created_by, NOW())";
                $data->created_by = $_user->id;
                $data->date = date('Y-m-d', strtotime($data->date));

                $stmt = $conn->prepare($sql);
                $stmt->bindValue(':order_id', $data->order_id);
                $stmt->bindValue(':date', $data->date);
                $stmt->bindValue(':cutter_id', $data->cutter_id);
                $stmt->bindValue(':po_qty_id', $data->po_qty_id);
                $stmt->bindValue(':lot_no', $data->lot_no);
                $stmt->bindValue(':total_qty', $data->total_qty);
                $stmt->bindValue(':created_by', $data->created_by);
                $stmt->execute()
                $lastId = $conn->lastInsertId();
                $conn->commit();
                (new ApiResponse(200, "Success"))->toJson();
        } catch (Exception $e) {
            $conn->rollBack();
            (new ApiResponse(500, "Error: " . $e->getMessage()))->toJson();
        }
    });

?>