<?php
require_once '../db/database.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Разрешает запросы с любых источников
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Разрешает указанные методы
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Разрешает определенные заголовки

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $group_id = $data['group_id'] ?? null;
    $subject = $data['subject'] ?? null;
    $description = $data['description'] ?? null;
    $deadline = $data['deadline'] ?? null;

    try {
        $query = "INSERT INTO deadlines (group_id, subject, description, due_date) VALUES (:group_id, :subject, :description, :deadline)";
        $stmt = $pdo->prepare($query);
        $stmt->execute(['group_id' => $group_id, 'subject' => $subject, 'description' => $description, 'deadline' => $deadline]);
        echo json_encode(['message' => 'Дедлайн добавлен']);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Ошибка добавления дедлайна: ' . $e->getMessage()]);
    }
}
?>
