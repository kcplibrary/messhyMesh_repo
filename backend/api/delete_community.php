<?php
// 1. Grant global access permission to Cloudflare's incoming frontend requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, ngrok-skip-browser-warning");
header("Content-Type: application/json");

// 2. Intercept and wave through browser safety pre-flight checks instantly
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 3. Establish your standard connection to your local mysql folder
$conn = new mysqli("127.0.0.1", "root", "amNekku2026", "messymesh_db");
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection offline"]));
}

require_once __DIR__ . '/../config/db_connect.php';

// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;

if ($id) {
    try {
        $stmt = $pdo->prepare("DELETE FROM communities WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(["status" => "success", "message" => "Node De-initialized"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Cannot delete: Community might have active files."]);
    }
}