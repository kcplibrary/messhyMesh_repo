<?php
// Force global CORS clearances so the browser doesn't trip out
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, ngrok-skip-browser-warning");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Exact absolute path to your folder
$uploadDirectory = '/home/kcplibrary/Documents/messyMesh/backend/uploads/';

// Get file parameter and explicitly DECODE it to handle long names with dashes/numbers
$filename = $_GET['file'] ?? '';
$filename = rawurldecode($filename); // Cleans up %20, dashes, and URL mutations
$filename = basename($filename); 

$filePath = $uploadDirectory . $filename;

// Enhanced Path Debugger: Let's find out EXACTLY what went wrong
if (!$filename || !file_exists($filePath)) {
    header("HTTP/1.1 404 Not Found");
    header('Content-Type: application/json');
    
    // Check if the directory itself is unreadable by the PHP server engine
    $dirReadable = is_readable($uploadDirectory) ? "Yes" : "No";
    
    die(json_encode([
        "status" => "error",
        "message" => "Requested file does not exist on source disk.",
        "debug_filename_parsed" => $filename,
        "debug_absolute_path_checked" => $filePath,
        "is_uploads_folder_readable_by_php" => $dirReadable
    ]));
}

// If it gets past the check, stream it!
$fileMimeType = mime_content_type($filePath);
header("Content-Type: " . $fileMimeType);
header("Content-Length: " . filesize($filePath));
header("Content-Disposition: inline; filename=\"" . $filename . "\"");

readfile($filePath);
exit;
?>