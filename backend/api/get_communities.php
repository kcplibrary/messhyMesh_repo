<?php
ob_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// header("Access-Control-Allow-Origin: *");
// header("Content-Type: application/json");

require_once __DIR__ . '/../config/db_connect.php';

$stmt = $pdo->query("SELECT * FROM communities ORDER BY id DESC");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));