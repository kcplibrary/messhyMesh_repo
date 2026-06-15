<?php
// Grant global access permission to Cloudflare's incoming frontend requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, ngrok-skip-browser-warning");
header("Content-Type: application/json");

// Intercept and wave through browser safety pre-flight checks instantly
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include the 'Handshake' file we just made
require_once __DIR__ . '/../config/db_connect.php';

// Tell the browser we are sending back JSON (standard for modern apps)
header('Content-Type: application/json');

// Get the data from the login form
$user = $_POST['username'] ?? '';
$pass = $_POST['password'] ?? '';

if (!$user || !$pass) {
    echo json_encode(["status" => "error", "message" => "Missing credentials"]);
    exit;
}

// Check the database for the user
try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$user]);
    $account = $stmt->fetch();

    // Verify the password and role
    if ($account && $pass === $account['password_hash']) {

        //Record today's login activity
        $trackStmt = $pdo->prepare("INSERT INTO user_logins (user_id, username, role) VALUES (?, ?, ?)");
        $trackStmt->execute([
            $account['id'], 
            $account['username'], 
            $account['role']
            ]);

        // Auto self-clean historical scratchpad, yearly
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