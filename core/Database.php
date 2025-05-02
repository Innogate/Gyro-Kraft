<?php

class Database {
    public $pdo;

    public function __construct() {
        $configPath = __DIR__ . '/../config.json';
        if (!file_exists($configPath)) {
            die(" config.json not found.");
        }

        $config = json_decode(file_get_contents($configPath), true);
        $dbConf = $config['db'];

        $host = $dbConf['host'];
        $db   = $dbConf['name'];
        $user = $dbConf['user'];
        $pass = $dbConf['pass'];
        $charset = $dbConf['charset'];

        $dsn = "mysql:host=$host;dbname=$db;charset=$charset";

        try {
            $this->pdo = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            die(" DB connection failed: " . $e->getMessage());
        }
    }
}
