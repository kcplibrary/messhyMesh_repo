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

// 3. Establish your standard connection to your local mysql folder
$conn = new mysqli("127.0.0.1", "root", "amNekku2026", "messymesh_db");
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection offline"]));
}

// Handle preflight OPTIONS requests gracefully
// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//     exit(0);
// }

require_once __DIR__ . '/../config/db_connect.php';

try {
    // Read the incoming JSON payload from React
    $data = json_decode(file_get_contents("php://input"), true);

    if (!empty($data['label']) && !empty($data['start']) && !empty($data['end'])) {
        
        // Prepare a single transaction or individual safe updates using PDO
        $sql = "UPDATE semester_settings SET setting_value = :val WHERE setting_key = :key";
        $stmt = $pdo->prepare($sql);

        // 1. Update the Semester Label
        $stmt->execute([
            ':val' => $data['label'],
            ':key' => 'current_semester_label'
        ]);

        // 2. Update the Start Date
        $stmt->execute([
            ':val' => $data['start'],
            ':key' => 'semester_start_date'
        ]);

        // 3. Update the End Date
        $stmt->execute([
            ':val' => $data['end'],
            ':key' => 'semester_end_date'
        ]);

        echo json_encode([
            "status" => "success", 
            "message" => "Curriculum adjustments successfully committed to semester parameters."
        ]);
    } else {
        echo json_encode([
            "status" => "error", 
            "message" => "Missing required configuration inputs."
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "status" => "error", 
        "message" => "Mainframe write failure: " . $e->getMessage()
    ]);
}
?>