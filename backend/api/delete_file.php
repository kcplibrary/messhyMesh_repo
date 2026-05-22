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
// header("Access-Control-Allow-Methods: POST, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type");
// header("Content-Type: application/json");

// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;



require_once __DIR__ . '/../config/db_connect.php';

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