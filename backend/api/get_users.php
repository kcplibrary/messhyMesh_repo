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

$sql = "SELECT users.id, users.username, users.role, users.community_id, communities.name as community_name 
        FROM users 
        LEFT JOIN communities ON users.community_id = communities.id";
        
try {
    // We use a LEFT JOIN to get the community name (department) 
    // even if the user hasn't been assigned to one yet.
    $query = "
        SELECT 
            u.id, 
            u.username, 
            u.role, 
            u.community_id,
            c.name as department 
        FROM users u
        LEFT JOIN communities c ON u.community_id = c.id 
        ORDER BY u.id DESC
    ";
    
    $stmt = $pdo->query($query);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($users);
} catch (PDOException $e) {
    // Log the error for debugging
    error_log($e->getMessage());
    echo json_encode([]);
}
?>