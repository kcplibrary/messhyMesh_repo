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

// Intercept payload parameters packed inside the axios.post application/json body
$data = json_decode(file_get_contents("php://input"), true);
$fileId = $data['id'] ?? null;

if ($fileId) {
    try {
        // Fetch the book file's text descriptor from your ebooks table index rows
        $stmt = $pdo->prepare("SELECT filename FROM ebooks WHERE id = :id");
        $stmt->execute([':id' => $fileId]);
        $file = $stmt->fetch();

        if ($file) {
            // Absolute path targeting your isolated textbooks storage sub-folder partition
            $filePath = '/home/kcplibrary/Documents/messyMesh/backend/uploads/ebooks/' . $file['filename'];
            
            // Clear out the physical binary document asset from server storage space
            if (file_exists($filePath)) {
                unlink($filePath);
            }

            // Purge the matching row registration from the database tracking cluster
            $delStmt = $pdo->prepare("DELETE FROM ebooks WHERE id = :id");
            $delStmt->execute([':id' => $fileId]);

            echo json_encode(["status" => "success", "message" => "Archive Purged Successfully"]);
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Ebook asset reference absent from system registry."]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing unique configuration tracking ID parameters."]);
}
?>