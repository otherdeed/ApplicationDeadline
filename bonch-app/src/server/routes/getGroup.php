<?php
require_once '../db/database.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$userId = 1875576355 ?? null; // Получаем ID пользователя из POST-запроса
if ($userId) {
    $query = "SELECT g.id, g.name, g.description, g.creator_id
              FROM groups g
              LEFT JOIN group_members gm ON g.id = gm.group_id
              WHERE g.creator_id = ? OR gm.user_id = ?";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$userId, $userId]);
    $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Формируем массив для возвращаемых данных
    $result = [];
    foreach ($groups as $group) {
        $result[] = [
            'id' => $group['id'],
            'name' => $group['name'],
            'description' => $group['description'],
            'creator_id' => $group['creator_id'], // ID создателя
            // Добавьте дополнительные поля, если необходимо
        ];
    }
    echo json_encode($result);
} else {
    echo json_encode(["error" => "User  ID not provided."]);
}
?>
