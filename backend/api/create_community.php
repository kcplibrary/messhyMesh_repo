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

// Read the data from React
$data = json_decode(file_get_contents("php://input"), true);
$name = $data['name'] ?? null;

if ($name) {
    try {
        // We use global $pdo to make sure we are reaching the variable from db_connect
        global $pdo; 
        
        $stmt = $pdo->prepare("INSERT INTO communities (name) VALUES (:name)");
        $stmt->execute([':name' => $name]);
        
        echo json_encode(["status" => "success", "message" => "Sector '$name' Initialized"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "SQL Error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "No name provided"]);
}