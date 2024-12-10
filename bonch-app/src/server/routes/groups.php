<?php

require_once '../db/database.php';

header("Access-Control-Allow-Origin: *"); // Разрешает запросы с любых источников
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Разрешает указанные методы
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Разрешает определенные заголовки

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM groups");
        $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($groups);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Ошибка получения групп: ' . $e->getMessage()]);
    }
}
