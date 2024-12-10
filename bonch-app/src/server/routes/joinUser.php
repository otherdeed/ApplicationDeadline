<?php

require_once '../db/database.php';

header("Access-Control-Allow-Origin: *"); // Разрешает запросы с любых источников
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Разрешает указанные методы
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Разрешает определенные заголовки

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $body = json_decode(file_get_contents('php://input'), true);
    try {
        if (isset($body['group_id']) && isset($body['user_id'])) {
            $stmt = $pdo->prepare("INSERT INTO group_members (group_id, user_id) VALUES (:group_id, :user_id)");
            $stmt->execute([
                'group_id' => $body['group_id'],
                'user_id' => $body['user_id'],
            ]);
            echo json_encode(['message' => 'Пользователь добавлен в группу']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Недостаточно данных']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Ошибка добавления пользователя в группу: ' . $e->getMessage()]);
    }
}
