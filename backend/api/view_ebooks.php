<?php
// Force global CORS clearances so the browser doesn't trip out
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, ngrok-skip-browser-warning");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Exact absolute path pointing directly into your isolated ebook cluster
$uploadDirectory = '/home/kcplibrary/Documents/messyMesh/backend/uploads/ebooks/';

// Get file parameter and explicitly DECODE it to handle long names with dashes/numbers
$filename = $_GET['file'] ?? '';
$filename = rawurldecode($filename); // Cleans up %20, dashes, and URL mutations
$filename = basename($filename); 

$filePath = $uploadDirectory . $filename;

// Enhanced Path Debugger for Ebooks
if (!$filename || !file_exists($filePath)) {
    header("HTTP/1.1 404 Not Found");
    header('Content-Type: application/json');
    
    // Check if the ebook directory itself is unreadable by the PHP server engine
    $dirReadable = is_readable($uploadDirectory) ? "Yes" : "No";
    
    die(json_encode([
        "status" => "error",
        "message" => "Requested Ebook file does not exist on source disk.",
        "debug_filename_parsed" => $filename,
        "debug_absolute_path_checked" => $filePath,
        "is_ebooks_folder_readable_by_php" => $dirReadable
    ]));
}

// If it gets past the check, stream it inline!
$fileMimeType = mime_content_type($filePath);
header("Content-Type: " . $fileMimeType);
header("Content-Length: " . filesize($filePath));

// "inline" instructs the browser window frame layout to render the PDF instead of popping down a background download
header("Content-Disposition: inline; filename=\"" . $filename . "\"");

readfile($filePath);
exit;
?>