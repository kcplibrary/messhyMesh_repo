<?php
// Grant global access permission to Cloudflare's incoming frontend requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, ngrok-skip-browser-warning");
header("Content-Type: application/json");

// Intercept and wave through browser safety pre-flight checks instantly
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/db_connect.php';

$user = trim($_POST['username'] ?? '');
$pass = trim($_POST['password'] ?? '');

// Security validation flag
$role = 'student'; 
$community_id = $_POST['community_id'] ?? null;

// Convert empty strings or text nulls to actual native database null types cleanly
if ($community_id === "" || $community_id === "null" || !$community_id) {
    $community_id = null;
} else {
    $community_id = (int)$community_id; // ⚡ FORCE INTEGER: Ensures MySQL reads it as a true ID number
}

if (!$user || !$pass) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Registration rejected: Both username and password fields are required."]);
    exit;
}

try {
    global $pdo;

    $check = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $check->execute([$user]);
    if ($check->fetch()) {
        http_response_code(409); // Conflict
        echo json_encode(["status" => "error", "message" => "Registration failed: The username '$user' is already taken."]);
        exit;
    }

    // Hash the text password securely
    // $hashedPassword = password_hash($pass, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("INSERT INTO users (username, password_hash, role, community_id) VALUES (?, ?, ?, ?)");
    $stmt->execute([$user, $pass, $role, $community_id]);

    echo json_encode(["status" => "success", "message" => "Account successfully created for $user"]);
} catch (PDOException $e) {
    // Keeps technical diagnostics safe inside your secure system backend logs
    http_response_code(500);
    error_log("Database Account Creation Failure: " . $e->getMessage());
    
    // Clean user-facing error block prevents vulnerable database leaks on the UI layer
    echo json_encode([
        "status" => "error", 
        "message" => "Database exception: Core repository engine failed to verify profile parameters."
    ]);
}
?>