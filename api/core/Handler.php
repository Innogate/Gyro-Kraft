<?php
require_once __DIR__ . '/Database.php';

class Handler {
    public static function validatePermission($module_id, $user_id = 0, $permissionCheck = "add") {
        $db = new Database();
        $pdo = $db->pdo;
        $sql = "SELECT * FROM permissions WHERE module_id = :module_id AND user_id = :user_id AND ";

        switch ($permissionCheck) {
            case 'view':
                return true;
                break;

            case 'add':
                $sql.= "can_add = 1";
                break;
            
            case 'edit':
                $sql.= "can_edit = 1";
                # code...
                break;
            
            case 'delete':
                $sql.= "can_delete = 1";
                # code...
                break;

            default:
                return false;
                break;
        }

        try {
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(":module_id", $module_id);
            $stmt->bindParam(":user_id", $user_id);
            $stmt->execute();
            $res = $stmt->rowCount() > 0;
            if ($res) {
               return true;
            }

            (new ApiResponse(403, "Permission denied"))->toJson();

        } catch (PDOException $e) {
            (new ApiResponse(500, "Database error", $e->getMessage()))->toJson();
        }
    }

    public static function validateInput($data, $requiredFields) {
        if (!is_array($data) || array_keys($data) === range(0, count($data) - 1)) {
            (new ApiResponse(400, "Invalid input format. Expected an object."))->toJson();
            exit;
        }

        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                (new ApiResponse(400, "Missing required field: $field"))->toJson();
                exit;
            }
        }
    }
}
?>
