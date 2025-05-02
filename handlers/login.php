<?php
Router::register("POST", "/login", function () {
    echo $_POST["passwd"];
});
