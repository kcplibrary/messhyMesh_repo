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
$fileId = $data['id'] ?? null;

if ($fileId) {
    try {
        // Get the filename first so we can delete it from the folder
        $stmt = $pdo->prepare("SELECT filename FROM files WHERE id = :id");
        $stmt->execute([':id' => $fileId]);
        $file = $stmt->fetch();

        if ($file) {
            $filePath = __DIR__ . '/../uploads/' . $file['filename'];
            
            // Delete the physical file
            if (file_exists($filePath)) {
                unlink($filePath);
            }

            // Delete the database record
            $delStmt = $pdo->prepare("DELETE FROM files WHERE id = :id");
            $delStmt->execute([':id' => $fileId]);

            echo json_encode(["status" => "success", "message" => "Archive Purged Successfully"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}