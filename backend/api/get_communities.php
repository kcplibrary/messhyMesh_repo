<?php
ob_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
// 🌟 CRITICAL: 'ngrok-skip-browser-warning' must be explicitly allowed here!
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept, X-Auth-Token");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// header("Access-Control-Allow-Origin: *");
// header("Content-Type: application/json");

require_once __DIR__ . '/../config/db_connect.php';

$stmt = $pdo->query("SELECT * FROM communities ORDER BY id DESC");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));