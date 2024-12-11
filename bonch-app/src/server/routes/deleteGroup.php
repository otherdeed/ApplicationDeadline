<?php
header("Access-Control-Allow-Origin: *"); // Разрешает запросы с любых источников
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE"); // Разрешает указанные методы
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Разрешает определенные заголовки

require_once '../db/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $body = json_decode(file_get_contents('php://input'), true);
    try {
        $stmt = $pdo->prepare("DELETE FROM group_members WHERE group_id = :id AND user_id = :user_id");
        $stmt->execute([
            'id' => $body['id'],
            'user_id' => $body['user_id'],
        ]);
        http_response_code(204);
        echo json_encode(['message' => 'Группа удалена']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Ошибка удаления группы: ' . $e->getMessage()]);
    }
}
