<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once __DIR__ . '/../config/db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$newUsername = $data['username'] ?? null;
$newRole = $data['role'] ?? null;
$newDept = $data['community_id'] ?? null;
$newPass = $data['password'] ?? null;

// Convert empty string to null if no sector is selected
$newDept = ($newDept === "") ? null : $newDept;

if ($id == 1) {
    echo json_encode(["status" => "error", "message" => "Root Node Protected."]);
    exit;
}

try {
    // 1. Update the main table
    $stmt = $pdo->prepare("UPDATE users SET username = ?, role = ?, community_id = ? WHERE id = ?");
    $stmt->execute([$newUsername, $newRole, $newDept, $id]);

    // 2. Update password ONLY if it's not empty
    if (!empty($newPass)) {
        // Use 'password' or 'password_hash' - check your database table structure!
        // Also added password_hash() so the new password actually works for login.
        $hashed = password_hash($newPass, PASSWORD_DEFAULT);
        $stmtPw = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
        $stmtPw->execute([$hashed, $id]);
    }

    echo json_encode(["status" => "success", "message" => "Update Confirmed"]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}