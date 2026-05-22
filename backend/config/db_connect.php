<?php
$host = "127.0.0.1";
$dbname = "messymesh_db";
$username = "root";
$password = "amNekku2026";

try {
    // Merged: PDO connection with charset for special characters
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    die(json_encode([
        "status" => "error", 
        "message" => "Asena, kabaw: Database connection failed",
        "debug" => $e->getMessage()
    ]));
}
?>