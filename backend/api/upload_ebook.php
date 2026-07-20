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

// Verify file array transmission presence instantly
if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "No file received"]);
    exit;
}

$uploader = $_POST['uploader'] ?? 'system'; 
$collection_id = $_POST['collection_id'] ?? null;
$bookTitle = isset($_POST['book_title']) ? trim($_POST['book_title']) : null;
$bookAuthor = isset($_POST['book_author']) ? trim($_POST['book_author']) : null;
$bookYear = $_POST['book_year'] ?? null;
$subjectTags = $_POST['subject_tags'] ?? ''; 

// Guard against missing target identifiers
if (empty($collection_id) || $collection_id === "null" || $collection_id === "undefined") {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Routing Error: Select a Sector first."]);
    exit;
}

// Check for PHP upload errors before attempting move
if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "PHP Upload Error Code: " . $_FILES['file']['error']]);
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

if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFilePath)) {
    try {
        global $pdo; 
        $timestamp = date("Y-m-d H:i:s"); 

        /* -----------------------------------------------------------------
         * 🟢 [UPDATE 2]: Foreign Key Validation Check
         * Verify that the selected community/collection ID actually exists 
         * in the referenced table before attempting the INSERT statement.
         * ----------------------------------------------------------------- */
        $checkStmt = $pdo->prepare("SELECT id FROM communities WHERE id = ?");
        $checkStmt->execute([(int)$collection_id]);
        
        if (!$checkStmt->fetch()) {
            // Throw exception to trigger catch block & file cleanup
            throw new Exception("Invalid Sector Selected. ID '{$collection_id}' does not exist in communities table.");
        }

        // TARGETS EBOOKS TABLE STRUCTURE
        $stmt = $pdo->prepare("INSERT INTO ebooks (filename, collection_id, uploaded_by, upload_date, book_title, book_author, book_year, subject_tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$fileName, (int)$collection_id, $uploader, $timestamp, $bookTitle, $bookAuthor, $bookYear, $subjectTags]);
        
        echo json_encode([
            "status" => "success", 
            "message" => "Asset verified, indexed, and securely archived in the ebook repository.",
            "file" => $fileName
        ]);
    } catch (Exception $e) {
        /* -----------------------------------------------------------------
         * 🟢 [UPDATE 1]: File Rollback / Orphan Cleanup
         * Deletes the uploaded physical file if the database insert fails,
         * keeping storage clean and synced with MySQL.
         * ----------------------------------------------------------------- */
        if (file_exists($targetFilePath)) {
            unlink($targetFilePath);
        }

        /* -----------------------------------------------------------------
         * 🟢 [UPDATE 3]: Explicit JSON Response on Failure
         * Ensures http_response_code(400) is returned along with
         * clean, scannable error details for UI Toast alerts.
         * ----------------------------------------------------------------- */
        http_response_code(400);
        error_log("Database Ingestion Crash (Ebooks): " . $e->getMessage());
        
        echo json_encode([
            "status" => "error", 
            "message" => "Database Transaction Aborted: " . $e->getMessage()
        ]);
    }
} else {
    http_response_code(500);
    $tmpExists = file_exists($_FILES["file"]["tmp_name"]) ? "Yes" : "No";
    echo json_encode([
        "status" => "error", 
        "message" => "Move failed. Temp file exists: $tmpExists. Target: $targetFilePath"
    ]);
}
?>