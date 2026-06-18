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

// 🌟 Points to your actual config folder location
require_once __DIR__ . '/../config/db_connect.php';

// Read the data from React as an associative array
$data = json_decode(file_get_contents("php://input"), true);
$name = $data['name'] ?? null;

// Trim any trailing/leading whitespaces so "Test" and "Test " are treated as duplicates
$name = isset($data['name']) ? trim($data['name']) : null;

if ($name) {
    try {
        // Uses your system's global $pdo instance
        global $pdo;

        // Using LOWER() makes the check case-insensitive (e.g., prevents "Test" vs "test")
        $checkStmt = $pdo->prepare("SELECT id FROM collections WHERE LOWER(name) = LOWER(:name) LIMIT 1");
        $checkStmt->execute([':name' => $name]);
        $existingCollection = $checkStmt->fetch();

        if ($existingCollection) {
            // Rejection fallback payload
            http_response_code(400); // 400 Bad Request
            echo json_encode([
                "status" => "error", 
                "message" => "SYSTEM_REJECTION: A collection named '$name' has already been initialized."
            ]);
            exit();
        }
        
        $stmt = $pdo->prepare("INSERT INTO collections (name) VALUES (:name)");
        $stmt->execute([':name' => $name]);
        
        echo json_encode(["status" => "success", "message" => "Collection '$name' Initialized"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "SQL Error: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "No name provided"]);
}
?>