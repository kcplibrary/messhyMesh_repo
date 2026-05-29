<?php
// 1. Inherit CORS security handshakes and database context strings instantly
require_once __DIR__ . '/../config/db_connect.php';

// 2. Point to the folder on your Ubuntu computer where uploads are actually saved
// Adjust this folder name path if your uploads folder is named differently
$uploadDirectory = __DIR__ . '/../backend/uploads/'; 

$filename = $_GET['file'] ?? '';

// Security Check: Block directory traversal hacks (like passing "../../etc/passwd")
$filename = basename($filename); 
$filePath = $uploadDirectory . $filename;

if (!$filename || !file_exists($filePath)) {
    header("HTTP/1.1 404 Not Found");
    header('Content-Type: application/json');
    die(json_encode(["status" => "error", "message" => "Requested file does not exist on source disk."]));
}

// 3. Detect the correct type of file automatically
$fileMimeType = mime_content_type($filePath);

// 4. Force browser streaming rules
header("Access-Control-Allow-Origin: *");
header("Content-Type: " . $fileMimeType);
header("Content-Length: " . filesize($filePath));

// Optional: Change "inline" to "attachment" if you want to FORCE download instead of previewing
header("Content-Disposition: inline; filename=\"" . $filename . "\"");

// 5. Read the file from the hard drive and stream it across the ngrok tunnel
readfile($filePath);
exit;
?>