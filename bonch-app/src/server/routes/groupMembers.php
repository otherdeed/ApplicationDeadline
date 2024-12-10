<?php

require_once '../db/database.php';

header("Access-Control-Allow-Origin: *"); // Разрешает запросы с любых источников
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Разрешает указанные методы
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Разрешает определенные заголовки

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['group_id'])) {
    try {
        $stmt = $pdo->prepare("SELECT u.id, u.name, u.username FROM group_members gm JOIN users u ON gm.user_id = u.id WHERE gm.group_id = :group_id");
        $stmt->execute(['group_id' => $_GET['group_id']]);
        $members = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($members);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Ошибка получения участников группы: ' . $e->getMessage()]);
    }
}
