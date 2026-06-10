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

require_once __DIR__ . '/../config/db_connect.php';

try {
    global $pdo;
    
    // 3. Structured LEFT JOIN query to fetch metadata alongside the sector names
    // Aligned to match your get_files template pattern (eb.* and community_name)
    $sql = "SELECT 
                eb.*, 
                c.name AS community_name 
            FROM ebooks eb
            LEFT JOIN communities c ON eb.community_id = c.id 
            ORDER BY eb.upload_date DESC";

    $stmt = $pdo->query($sql);
    $ebooks = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // 4. Data Normalization: Ensure IDs are true integers so React doesn't trip on type mismatches
    foreach ($ebooks as &$book) {
        $book['id'] = (int)$book['id'];
        if ($book['community_id'] !== null) {
            $book['community_id'] = (int)$book['community_id'];
        }
    }
    unset($book); // Clear reference pointer safely
    
    echo json_encode($ebooks);
} catch (PDOException $e) {
    http_response_code(500);
    error_log("Ebook Ingestion Reader Exception: " . $e->getMessage());
    echo json_encode(["status" => "error", "message" => "Indexing Exception: System database core rejected entry storage data record mapping."]);
}
?>