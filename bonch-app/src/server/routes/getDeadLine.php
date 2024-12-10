<?php
require_once '../db/database.php';


header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Разрешает запросы с любых источников
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Разрешает указанные методы
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Разрешает определенные заголовки

$groupName = $_POST['groupName'] ?? null;

if ($groupName) {
    $query = "SELECT d.id, d.subject, d.description, d.due_date AS deadline
              FROM deadlines d
              INNER JOIN groups g ON d.group_id = g.id
              WHERE g.name = ?";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$groupName]);
    $deadlines = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($deadlines);
} else {
    echo json_encode(["error" => "Group name not provided."]);
}
?>
