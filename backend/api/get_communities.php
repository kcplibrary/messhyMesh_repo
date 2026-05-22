<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once __DIR__ . '/../config/db_connect.php';

$stmt = $pdo->query("SELECT * FROM communities ORDER BY id DESC");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));