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

// Points to your real database connection layout file
require_once __DIR__ . '/../config/db_connect.php';

// Read incoming body payload as an associative array to align with React Axios calls
$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;
$newName = $data['name'] ?? null;

if (!$id || !$newName || trim($newName) === "") {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Modification aborted: Missing target collection identifier or value pointer."]);
    exit;
}

try {
    // Reaching into your global system PDO wrapper context
    global $pdo;
    
    // 🌟 Corrected targeting query to modify the collections table
    $stmt = $pdo->prepare("UPDATE collections SET name = :name WHERE id = :id");
    $stmt->execute([':name' => trim($newName), ':id' => $id]);
    
    echo json_encode(["status" => "success", "message" => "Collection configuration node updated to '" . trim($newName) . "'."]);

} catch (Exception $e) {
    http_response_code(500);
    
    // Hide raw SQL structural syntax errors from showing up inside your UI toast layers
    echo json_encode(["status" => "error", "message" => "Modification exception: Core database engine refused to update collection entry metadata safely."]);
}
?>