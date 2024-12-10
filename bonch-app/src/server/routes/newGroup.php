<?php

require_once '../db/database.php';

header("Access-Control-Allow-Origin: *"); // Разрешает запросы с любых источников
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Разрешает указанные методы
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Разрешает определенные заголовки

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    try {
        $stmt = $pdo->prepare("INSERT INTO groups (name, description, creator_id) VALUES (:name, :description, :creator_id)");
        $stmt->execute([
            'name' => $body['name'],
            'description' => $body['description'],
            'creator_id' => $body['creator']['id'],
        ]);

        $lastID = $pdo ->lastInsertId();

        
        http_response_code(201);
        echo json_encode([
            'message' => 'Группа создана',
            'id' => $pdo->lastInsertId()
    ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Ошибка создания группы: ' . $e->getMessage()]);
    }
}
