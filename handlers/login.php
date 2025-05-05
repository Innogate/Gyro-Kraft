<?php
Router::register("POST", "/login", function () {
    if (isset($_POST['mobile']) && isset($_POST['password'])) {
        $mobile = sanitize($_POST['mobile']);
        $password = sanitize($_POST['password']);

        $dbInstance = new Database();
        $conn = $dbInstance->pdo;

        $sql = "SELECT * FROM users WHERE phone_no = :mobile";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":mobile", $mobile);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            if (($password == $user['password_hash'])) {
                $_SESSION['otp_data'] = $user;
                $_SESSION["otp"] = generateAlphaNumeric(6);
                response(true, "Login successful.");
            } else {
                response(false, "Invalid credentials.");
            }
        } else {
            response(false, "User not found.");
        }
    }else{
        response(false, "Invalid request.");
    }
});

Router::register("POST", "/login/otp", function () {
    if (isset($_POST['otp'])) {
        $otp = sanitize($_POST['otp']);
        if ($otp == $_SESSION["otp"]) {
            $user = $_SESSION['otp_data'];
            $_SESSION['user'] = $user;
            response(true, "Login successful.");
        } else {
            response(false, "Invalid OTP.");
        }
    }else{
        response(false, "Invalid request.", $_POST);
    }
});
