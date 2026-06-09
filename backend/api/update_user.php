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

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$newUsername = $data['username'] ?? null;
$newRole = $data['role'] ?? null;
$newDept = $data['community_id'] ?? null;
$newPass = $data['password'] ?? null;

// Convert empty string or string "null" to actual database null if no sector is selected
$newDept = ($newDept === "" || $newDept === "null") ? null : $newDept;

// 3. Structural validation input checks
if (!$id || !$newUsername || !$newRole) {
    http_response_code(400); // Bad Request
    echo json_encode(["status" => "error", "message" => "Modification aborted: Missing required configuration keys."]);
    exit;
}

// 4. Protection guard loop for Root Administrator Node
if ($id == 1) {
    http_response_code(403); // Forbidden
    echo json_encode(["status" => "error", "message" => "Permission Denied: Root Node cannot be modified."]);
    exit;
}

try {
    global $pdo;

    // 5. Dynamic Query Traffic Router Loop
    if (!empty($newPass) && trim($newPass) !== "") {
        // PATH A: Update text attributes INCLUDING the freshly hashed security string
        // $hashed = password_hash(trim($newPass), PASSWORD_DEFAULT);
        
        // ⚠️ NOTE: If your column name is 'password_hash', change 'password = ?' below to match!
        $stmt = $pdo->prepare("UPDATE users SET username = ?, role = ?, community_id = ?, password_hash = ? WHERE id = ?");
        $stmt->execute([trim($newUsername), $newRole, $newDept, $newPass, $id]);
    } else {
        // PATH B: Update profile text attributes only (Preserves existing password cleanly!)
        $stmt = $pdo->prepare("UPDATE users SET username = ?, role = ?, community_id = ? WHERE id = ?");
        $stmt->execute([trim($newUsername), $newRole, $newDept, $id]);
    }

    // 6. SECURITY FIX: Sanitize output variable to stop XSS injection attacks in Toast popups
    $cleanDisplayUser = htmlspecialchars($newUsername, ENT_QUOTES, 'UTF-8');
    echo json_encode([
        "status" => "success", 
        "message" => "Profile configurations for '" . $cleanDisplayUser . "' successfully updated."
    ]);

} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    error_log("User Reconfiguration Failure: " . $e->getMessage());
    
    // Kept this output clear so if your table uses 'password_hash' instead of 'password', it will tell you exactly here!
    echo json_encode([
        "status" => "error", 
        "message" => "Database Query Exception: " . $e->getMessage()
    ]);
}
?>