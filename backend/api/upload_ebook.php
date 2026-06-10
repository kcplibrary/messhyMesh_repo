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

// Verify file array transmission presence instantly
if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "No file received"]);
    exit;
}

$uploader = $_POST['uploader'] ?? 'system'; 
$community_id = $_POST['community_id'] ?? null; 
$bookTitle = $_POST['book_title'] ?? null;
$bookAuthor = $_POST['book_author'] ?? null;
$bookYear = $_POST['book_year'] ?? null;
$subjectTags = $_POST['subject_tags'] ?? ''; // Behaves like your 'keywords' string parameter

if (empty($community_id) || $community_id === "null") {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Routing Error: Select a Sector first."]);
    exit;
}

// Absolute path to your dedicated ebooks storage node
$targetDir = "/home/kcplibrary/Documents/messyMesh/backend/uploads/ebooks/";

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
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "PHP Upload Error Code: " . $_FILES['file']['error']]);
    exit;
}

if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFilePath)) {
    try {
        global $pdo; 
        $timestamp = date("Y-m-d H:i:s"); 

        // TARGETS EBOOKS TABLE STRUCTURE matching your design standards
        $stmt = $pdo->prepare("INSERT INTO ebooks (filename, community_id, uploaded_by, upload_date, book_title, book_author, book_year, subject_tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$fileName, (int)$community_id, $uploader, $timestamp, $bookTitle, $bookAuthor, $bookYear, $subjectTags]);
        
        echo json_encode([
            "status" => "success", 
            "message" => "Asset verified, indexed, and securely archived in the ebook repository.",
            "file" => $fileName
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        error_log("Database Ingestion Crash (Ebooks): " . $e->getMessage());
        echo json_encode(["status" => "error", "message" => "Indexing Exception: System database core rejected entry storage data record mapping."]);
    }
} else {
    http_response_code(500);
    // Check if the temporary file actually exists
    $tmpExists = file_exists($_FILES["file"]["tmp_name"]) ? "Yes" : "No";
    echo json_encode([
        "status" => "error", 
        "message" => "Move failed. Temp file exists: $tmpExists. Target: $targetFilePath"
    ]);
}
?>