<?php
ob_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept, X-Auth-Token");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// header("Access-Control-Allow-Origin: *");
// header("Content-Type: application/json");

require_once __DIR__ . '/../config/db_connect.php';

try {
    global $pdo;
    
    // We link 'files.community_id' to 'communities.id'
    $sql = "SELECT 
                f.*, 
                c.name AS community_name 
            FROM files f
            LEFT JOIN communities c ON f.community_id = c.id 
            ORDER BY f.upload_date DESC";

    $stmt = $pdo->query($sql);
    $files = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($files);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>