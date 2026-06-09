<?php
// Grant global access permission to Cloudflare's incoming frontend requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, ngrok-skip-browser-warning");
header("Content-Type: application/json");

// Intercept and wave through browser safety pre-flight checks instantly
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
require_once __DIR__ . '/../config/db_connect.php';

// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

// Get the data first
$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;

// Guard against missing parameters entirely
if (!$id) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Termination aborted: Missing targeting element pointer."]);
    exit;
}

// check the ID
if ($id == 1) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Permission Denied: User cannot be terminated."]);
    exit;
}

try {
    global $pdo;

    $stmt = $pdo->prepare("DELETE FROM users WHERE id = :id");
    $stmt->execute([':id' => $id]);
    // echo json_encode(["status" => "success", "message" => "User Node De-provisioned"]);
    echo json_encode(["status" => "success", "message" => "User successfully removed."]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "System Error: Cannot delete user."]);
        }
?>