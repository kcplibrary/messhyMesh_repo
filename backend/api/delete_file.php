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

// 3. Establish your standard connection to your local mysql folder
$conn = new mysqli("127.0.0.1", "root", "amNekku2026", "messymesh_db");
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection offline"]));
}

require_once __DIR__ . '/../config/db_connect.php';

// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$data = json_decode(file_get_contents("php://input"), true);
$fileId = $data['id'] ?? null;

if ($fileId) {
    try {
        // 1. Get the filename first so we can delete it from the folder
        $stmt = $pdo->prepare("SELECT filename FROM files WHERE id = :id");
        $stmt->execute([':id' => $fileId]);
        $file = $stmt->fetch();

        if ($file) {
            $filePath = __DIR__ . '/../uploads/' . $file['filename'];
            
            // 2. Delete the physical file
            if (file_exists($filePath)) {
                unlink($filePath);
            }

            // 3. Delete the database record
            $delStmt = $pdo->prepare("DELETE FROM files WHERE id = :id");
            $delStmt->execute([':id' => $fileId]);

            echo json_encode(["status" => "success", "message" => "Archive Purged Successfully"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}