<?php
// Grant global access permission to Cloudflare's incoming frontend requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, ngrok-skip-browser-warning");

// Intercept and wave through browser safety pre-flight checks instantly
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$file = $_GET['file'] ?? '';
$action = $_GET['action'] ?? 'download'; // Default to download if not specified

// Ebooks live inside their dedicated sub-folder within uploads
$targetDir = realpath(__DIR__ . '/../uploads/ebooks');
$filePath = realpath($targetDir . '/' . basename($file));

// Security check: Verify file exists and stays confined within the ebook storage sandbox
if (!empty($file) && $filePath && file_exists($filePath) && strpos($filePath, $targetDir) === 0) {
    
    // Get the actual MIME type of the file (e.g., application/pdf)
    $mimeType = mime_content_type($filePath);
    
    header('Content-Description: File Transfer');
    header('Content-Type: ' . $mimeType);
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($filePath));
    
    if ($action === 'view') {
        // 'inline' instructs the browser/modal viewport to display the PDF directly on screen
        header('Content-Disposition: inline; filename="' . basename($filePath) . '"');
    } else {
        // 'attachment' forces the browser to drop the asset into local downloads storage
        header('Content-Disposition: attachment; filename="' . basename($filePath) . '"');
    }
    
    // Clear buffer arrays cleanly to avoid document file stream corruption
    if (ob_get_length()) ob_clean();
    flush();
    
    readfile($filePath);
    exit;
} else {
    http_response_code(404);
    header("Content-Type: application/json");
    echo json_encode(["status" => "error", "message" => "Ebook asset not found or access denied."]);
}
?>