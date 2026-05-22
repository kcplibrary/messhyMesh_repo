<?php
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: POST, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type");
// header("Content-Type: application/json");

// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

// tunnel
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/db_connect.php';

// 2. Read the data from React
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