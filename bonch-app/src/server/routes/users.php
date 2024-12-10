<?php

require_once '../db/database.php';

header("Access-Control-Allow-Origin: *"); // Разрешает запросы с любых источников
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Разрешает указанные методы
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Разрешает определенные заголовки

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    var_dump($body);
    try {
        $stmt = $pdo->prepare("INSERT INTO users (id, name, username) VALUES (:id , :name, :username) ON DUPLICATE KEY UPDATE name = :name, username = :username");
        $stmt->execute([
            'id' => $body['id'], // Изменено с 'tg_id' на 'id'
            'name' => $body['name'],
            'username' => $body['username'],
        ]);        
        http_response_code(201);
        
        echo json_encode(['message' => 'Пользователь добавлен']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Ошибка добавления пользователя: ' . $e->getMessage()]);
    }
}
