<?php
ob_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// header("Access-Control-Allow-Origin: *");

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