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

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;
$newName = $data['name'] ?? null;

if (!$id || !$newName || trim($newName) === "") {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Modification aborted: Missing target node identifier or value pointer."]);
    exit;
}

try {
    global $pdo;
    
    $stmt = $pdo->prepare("UPDATE communities SET name = :name WHERE id = :id");
    $stmt->execute([':name' => trim($newName), ':id' => $id]);
    
    echo json_encode(["status" => "success", "message" => "Community successfully reconfigured to '" . trim($newName) . "'."]);

} catch (Exception $e) {
    http_response_code(500);
    
    // Hide raw SQL structural syntax errors from showing up inside your premium UI layout layers
    echo json_encode(["status" => "error", "message" => "Modification exception: Core database engine refused to update sector entry metadata safely."]);
}
?>