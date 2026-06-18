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

try {
    // Reaching into your global system PDO wrapper context
    global $pdo;

    // Fetching from collections table, ordered alphabetically by name
    $stmt = $pdo->query("SELECT id, name, created_at FROM collections ORDER BY name ASC");
    $collections = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode($collections);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Sync exception: Core database engine failed to read collection logs."
    ]);
}
?>