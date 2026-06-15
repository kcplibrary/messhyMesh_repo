<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once __DIR__ . '/../config/db_connect.php';

try {
    // Count total users (Nodes)
    $stmtUsers = $pdo->query("SELECT COUNT(*) as total FROM users");
    $userCount = $stmtUsers->fetch()['total'];

    // Count total files (Archives)
    $stmtFiles = $pdo->query("SELECT COUNT(*) as total FROM files");
    $fileCount = $stmtFiles->fetch()['total'];

    // Count total communities (Sectors)
    $stmtComm = $pdo->query("SELECT COUNT(*) as total FROM communities");
    $commCount = $stmtComm->fetch()['total'];

    // Daily: Unique accounts active since midnight today
    $stmtDaily = $pdo->query("SELECT COUNT(DISTINCT user_id) as total FROM user_logins WHERE login_time >= CURDATE()");
    $dailyCount = $stmtDaily->fetch()['total'];

    // Weekly: Unique accounts active since Monday of the current week
    $stmtWeekly = $pdo->query("SELECT COUNT(DISTINCT user_id) as total FROM user_logins WHERE login_time >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)");
    $weeklyCount = $stmtWeekly->fetch()['total'];

    // Monthly: Unique accounts active since the 1st of this calendar month
    $stmtMonthly = $pdo->query("SELECT COUNT(DISTINCT user_id) as total FROM user_logins WHERE login_time >= DATE_FORMAT(CURDATE(), '%Y-%m-01')");
    $monthlyCount = $stmtMonthly->fetch()['total'];

    // Yearly: Unique accounts active since January 1st of this calendar year
    $stmtYearly = $pdo->query("SELECT COUNT(DISTINCT user_id) as total FROM user_logins WHERE login_time >= DATE_FORMAT(CURDATE(), '%Y-01-01')");
    $yearlyCount = $stmtYearly->fetch()['total'];

    // Daily Uploads: Items pushed to files table today
    $stmtDailyFiles = $pdo->query("SELECT COUNT(*) as total FROM files WHERE DATE(upload_date) = CURDATE()");
    $dailyUploadsCount = (int)$stmtDailyFiles->fetch()['total'];

    // Weekly Uploads: Items pushed within past 7 days
    $stmtWeeklyFiles = $pdo->query("SELECT COUNT(*) as total FROM files WHERE upload_date >= NOW() - INTERVAL 7 DAY");
    $weeklyUploadsCount = (int)$stmtWeeklyFiles->fetch()['total'];


    // DYNAMIC SEMESTER SETTINGS WINDOW (Converted from MySQLi to PDO)
    $settings_query = $pdo->query("SELECT setting_key, setting_value FROM semester_settings");
    $settings = [];
    while($row = $settings_query->fetch()) {
        $settings[$row['setting_key']] = $row['setting_value'];
    }

    $sem_label = $settings['current_semester_label'] ?? 'Active Semester';
    $start_date = $settings['semester_start_date'] ?? '2026-01-01';
    $end_date = $settings['semester_end_date'] ?? '2026-12-31';

    // Query files uploaded within your editable academic window parameters via PDO
    $sem_stmt = $pdo->prepare("SELECT COUNT(*) as cnt FROM files WHERE upload_date BETWEEN :start AND :end");
    $sem_stmt->execute([
        ':start' => $start_date,
        ':end'   => $end_date
    ]);
    $semester_uploads = (int)$sem_stmt->fetch()['cnt'];


    // DYNAMIC HISTORICAL LOOKBACK FILTER PARSING
    $timeframe = isset($_GET['timeframe']) ? $_GET['timeframe'] : null;
    $day       = isset($_GET['day']) ? (int)$_GET['day'] : (int)date('d');
    $week      = isset($_GET['week']) ? $_GET['week'] : 'Week 1';
    $month     = isset($_GET['month']) ? $_GET['month'] : date('m');
    $year      = isset($_GET['year']) ? (int)$_GET['year'] : (int)date('Y');

    // Default historical baseline to the daily live count if no filters are requested yet
    $activeFilteredCount = (int)$dailyCount;

    if ($timeframe !== null) {
        if ($timeframe === 'daily') {
            // Filter by exactly Year, Month, and Day
            $stmt = $pdo->prepare("SELECT COUNT(DISTINCT user_id) as total FROM user_logins WHERE YEAR(login_time) = :year AND MONTH(login_time) = :month AND DAY(login_time) = :day");
            $stmt->execute([':year' => $year, ':month' => $month, ':day' => $day]);
            $activeFilteredCount = (int)$stmt->fetch()['total'];

        } else if ($timeframe === 'weekly') {
            // Extract the digit from strings like "Week 3"
            preg_match('/\d+/', $week, $matches);
            $weekNum = isset($matches[0]) ? (int)$matches[0] : 1;
            
            // Group days into standard 7-day calendar bins within the specified month/year
            $stmt = $pdo->prepare("SELECT COUNT(DISTINCT user_id) as total FROM user_logins WHERE YEAR(login_time) = :year AND MONTH(login_time) = :month AND FLOOR((DAY(login_time) - 1) / 7) + 1 = :weekNum");
            $stmt->execute([':year' => $year, ':month' => $month, ':weekNum' => $weekNum]);
            $activeFilteredCount = (int)$stmt->fetch()['total'];

        } else if ($timeframe === 'monthly') {
            // Filter across a whole calendar month
            $stmt = $pdo->prepare("SELECT COUNT(DISTINCT user_id) as total FROM user_logins WHERE YEAR(login_time) = :year AND MONTH(login_time) = :month");
            $stmt->execute([':year' => $year, ':month' => $month]);
            $activeFilteredCount = (int)$stmt->fetch()['total'];

        } else if ($timeframe === 'yearly') {
            // Filter across an entire year
            $stmt = $pdo->prepare("SELECT COUNT(DISTINCT user_id) as total FROM user_logins WHERE YEAR(login_time) = :year");
            $stmt->execute([':year' => $year]);
            $activeFilteredCount = (int)$stmt->fetch()['total'];
        }
    }

    echo json_encode([
        "status" => "success",
        "stats" => [
            "nodes" => $userCount,
            "archives" => $fileCount,
            "sectors" => $commCount,

            "dailyUsers" => (int)$dailyCount,
            "weeklyUsers" => (int)$weeklyCount,
            "monthlyUsers" => (int)$monthlyCount,
            "yearlyUsers" => (int)$yearlyCount,

            "dailyUploads"    => $dailyUploadsCount,
            "weeklyUploads"   => $weeklyUploadsCount,
            "semesterLabel"   => $sem_label,
            "semesterUploads" => $semester_uploads,
            
            // Pass the custom query selection back to your React app
            "activeFilteredCount" => $activeFilteredCount
        ]
    ]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}