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


$file = $_GET['file'] ?? '';
// Path goes up one level to find the 'uploads' folder
$filePath = __DIR__ . '/../uploads/' . $file;

// Security: Prevent users from downloading files outside the uploads folder
if (!empty($file) && file_exists($filePath) && strpos(realpath($filePath), 'uploads') !== false) {
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream'); // Forces "binary" mode
    header('Content-Disposition: attachment; filename="' . basename($filePath) . '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($filePath));
    
    // Clear buffer to prevent file corruption
    ob_clean();
    flush();
    
    readfile($filePath);
    exit;
} else {
    http_response_code(404);
    echo "File not found or access denied.";
}
?>