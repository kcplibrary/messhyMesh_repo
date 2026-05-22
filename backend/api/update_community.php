<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once __DIR__ . '/../config/db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;
$newName = $data['name'] ?? null;

if ($id && $newName) {
    try {
        $stmt = $pdo->prepare("UPDATE communities SET name = :name WHERE id = :id");
        $stmt->execute([':name' => $newName, ':id' => $id]);
        echo json_encode(["status" => "success", "message" => "Sector Renamed"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}