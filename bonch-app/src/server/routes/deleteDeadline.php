<?php

header("Access-Control-Allow-Origin: *"); // Разрешает запросы с любых источников
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE"); // Разрешает указанные методы
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Разрешает определенные заголовки

require_once '../db/database.php';

$body = json_decode(file_get_contents('php://input'), true);

$groupId = $body['groupId']; 

$deadlineId = $body['deadlineId']; 

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $body = json_decode(file_get_contents('php://input'), true);


    $groupId = $body['groupId']; 
    $deadlineId = $body['deadlineId']; 

    try {
        // Подготавливаем запрос с правильными именами параметров
        $stmt = $pdo->prepare("DELETE FROM deadlines WHERE group_id = :groupId AND id = :deadlineId");
        $stmt->execute([
            'groupId' => $groupId, // Используем переменные для передачи значений
            'deadlineId' => $deadlineId,
        ]);

        // Проверяем, были ли затронуты какие-либо строки
        if ($stmt->rowCount() > 0) {
            http_response_code(204); // Код ответа 204 No Content
            echo json_encode(['message' => 'Дедлайн удален']);
        } else {
            http_response_code(404); // Код ответа 404 Not Found
            echo json_encode(['error' => 'Дедлайн не найден']);
        }
    } catch (PDOException $e) {
        http_response_code(500); // Код ответа 500 Internal Server Error
        echo json_encode(['error' => 'Ошибка удаления дедлайна: ' . $e->getMessage()]);
    }
}