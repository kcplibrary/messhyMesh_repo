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
// header("Access-Control-Allow-Methods: POST, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");

// if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit;

require_once __DIR__ . '/../config/db_connect.php';

$user = $_POST['username'] ?? '';
$pass = $_POST['password'] ?? '';
$role = $_POST['role'] ?? 'student';
$community_id = $_POST['community_id'] ?? null;

// Convert empty string to null for the database
if ($community_id === "" || $community_id === "null") {
    $community_id = null;
}

if (!$user || !$pass) {
    echo json_encode(["status" => "error", "message" => "All fields are required"]);
    exit;
}

try {
    // 1. Check if user exists
    $check = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $check->execute([$user]);
    if ($check->fetch()) {
        echo json_encode(["status" => "error", "message" => "Username already taken"]);
        exit;
    }

    // 2. FIXED INSERT: Match columns to values (4 columns, 4 values)
    $stmt = $pdo->prepare("INSERT INTO users (username, password_hash, role, community_id) VALUES (?, ?, ?, ?)");
    $stmt->execute([$user, $pass, $role, $community_id]);

    echo json_encode(["status" => "connection success", "message" => "Account created for $user"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>