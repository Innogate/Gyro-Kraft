<?php
Router::register("GET", "/otp", function () {
    if (isset($_SESSION["otp"])) {
        echo $_SESSION["otp"];
    }
    else{
        echo "OTP not found";
    }
    
});