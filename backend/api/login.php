<?php
ob_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept, X-Auth-Token");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}
// 1. Include the 'Handshake' file we just made
require_once __DIR__ . '/../config/db_connect.php';

// 2. Tell the browser we are sending back JSON (standard for modern apps)
header('Content-Type: application/json');

// 3. Get the data from the login form
$user = $_POST['username'] ?? '';
$pass = $_POST['password'] ?? '';

if (!$user || !$pass) {
    echo json_encode(["status" => "error", "message" => "Missing credentials"]);
    exit;
}

// 4. Check the database for the user
try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$user]);
    $account = $stmt->fetch();

    // 6. Verify the password and role
    if ($account && $pass === $account['password_hash']) {

        //RECORD TODAY'S ACTIVE LOGIN ENTRY
        $trackStmt = $pdo->prepare("INSERT INTO user_logins (user_id, username, role) VALUES (?, ?, ?)");
        $trackStmt->execute([
            $account['id'], 
            $account['username'], 
            $account['role']
            ]);

        //SELF-CLEAN HISTORICAL SCRATCHPAD
        $pdo->query("DELETE FROM user_logins WHERE login_time < NOW() - INTERVAL 365 DAY");
        
        echo json_encode([
            "status" => "connection success",
            "username" => $account['username'], 
            "role" => $account['role'],
            "message" => "Welcome, " . $account['username']
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database error"]);
}
?>