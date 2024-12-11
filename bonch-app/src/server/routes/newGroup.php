<?php

require_once '../db/database.php';

header("Access-Control-Allow-Origin: *"); // Разрешает запросы с любых источников
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Разрешает указанные методы
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Разрешает определенные заголовки

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    try {
        // Insert the new group into the groups table
        $stmt = $pdo->prepare("INSERT INTO groups (name, description, creator_id) VALUES (:name, :description, :creator_id)");
        $stmt->execute([
            'name' => $body['name'],
            'description' => $body['description'],
            'creator_id' => $body['creator']['id'],
        ]);

        // Get the last inserted group ID
        $lastID = $pdo->lastInsertId();

        // Automatically add the creator as the first member of the group
        $stmtMember = $pdo->prepare("INSERT INTO group_members (group_id, user_id) VALUES (:group_id, :user_id)");
        $stmtMember->execute([
            'group_id' => $lastID,
            'user_id' => $body['creator']['id'],
        ]);

        http_response_code(201);
        echo json_encode([
            'message' => 'Группа создана и первый участник добавлен',
            'id' => $lastID
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Ошибка создания группы: ' . $e->getMessage()]);
    }
}
?>