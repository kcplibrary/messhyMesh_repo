<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once __DIR__ . '/../config/db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

// 1. Get the data first
$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;

// 2. NOW check the ID
if ($id == 1) {
    echo json_encode(["status" => "error", "message" => "Permission Denied: Root Node cannot be terminated."]);
    exit;
}

if ($id) {
    try {
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(["status" => "success", "message" => "User Node De-provisioned"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "System Error: Cannot delete user."]);
    }
}