<?php
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: POST, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type");
// header("Content-Type: application/json");

// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

// tunnel
// Clear any accidental whitespaces or notices from breaking headers
ob_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/db_connect.php';

if (!isset($_FILES['file'])) {
    echo json_encode(["status" => "error", "message" => "No file received"]);
    exit;
}

$uploader = $_POST['uploader'] ?? 'system'; 
$community_id = $_POST['community_id'] ?? null; 
$paperTitle = $_POST['paper_title'] ?? null;
$paperAuthor = $_POST['paper_author'] ?? null;
$paperYear = $_POST['paper_year'] ?? null;
$keywords = $_POST['keywords'] ?? '';

if (empty($community_id) || $community_id === "null") {
    echo json_encode(["status" => "error", "message" => "Routing Error: Select a Sector first."]);
    exit;
}

// Absolute path
$targetDir = "/home/kcplibrary/Documents/messyMesh/backend/uploads/";

// Clear cache to ensure PHP sees the latest permissions
clearstatcache();

if (!is_dir($targetDir)) {
    mkdir($targetDir, 0777, true);
}

$originalName = $_FILES['file']['name'];
$extension = pathinfo($originalName, PATHINFO_EXTENSION);
$onlyName = pathinfo($originalName, PATHINFO_FILENAME);
$cleanName = preg_replace("/[^a-z0-9.]+/i", "-", strtolower($onlyName));
$fileName = date("Ymd") . "_" . time() . "_" . trim($cleanName, "-") . "." . $extension;
$targetFilePath = $targetDir . $fileName;

// Check for PHP upload errors before attempting move
if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(["status" => "error", "message" => "PHP Upload Error Code: " . $_FILES['file']['error']]);
    exit;
}

if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFilePath)) {
    try {
        global $pdo; 
        $timestamp = date("Y-m-d H:i:s"); 

        $stmt = $pdo->prepare("INSERT INTO files (filename, community_id, uploaded_by, upload_date, paper_title, paper_author, paper_year, keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$fileName, (int)$community_id, $uploader, $timestamp, $paperTitle, $paperAuthor, $paperYear, $keywords]);
        
        echo json_encode([
            "status" => "success", 
            "message" => "Archived in Sector Vault!",
            "file" => $fileName
        ]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Database Error: " . $e->getMessage()]);
    }
} else {
    // Check if the temporary file actually exists
    $tmpExists = file_exists($_FILES["file"]["tmp_name"]) ? "Yes" : "No";
    echo json_encode([
        "status" => "error", 
        "message" => "Move failed. Temp file exists: $tmpExists. Target: $targetFilePath"
    ]);
}
?>