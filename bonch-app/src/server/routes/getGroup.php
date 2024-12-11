<?php
require_once '../db/database.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


$body = json_decode(file_get_contents('php://input'), true);
$userId = $body['id'] ?? null; 

// Получаем ID пользователя из POST-запроса
if ($userId) {
    $query = "SELECT g.id, g.name, g.description, g.creator_id, u.name as creator_name, u.username as creator_username
              FROM groups g
              LEFT JOIN group_members gm ON g.id = gm.group_id
              LEFT JOIN users u ON g.creator_id = u.id
              WHERE g.creator_id = ? OR gm.user_id = ?";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$userId, $userId]);
    $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $result = [];
    foreach ($groups as $group) {
        $groupId = $group['id'];

        // Fetch members
        $stmtMembers = $pdo->prepare("SELECT user_id FROM group_members WHERE group_id = ?");
        $stmtMembers->execute([$groupId]);
        $members = $stmtMembers->fetchAll(PDO::FETCH_COLUMN);

        // Fetch deadlines
        $stmtDeadlines = $pdo->prepare("SELECT * FROM deadlines WHERE group_id = ?");
        $stmtDeadlines->execute([$groupId]);
        $deadlines = $stmtDeadlines->fetchAll(PDO::FETCH_ASSOC);

        $result[] = [
            'name' => $group['name'],
            'description' => $group['description'],
            'creator' => [
                'id' => $group['creator_id'],
                'name' => $group['creator_name'],
                'username' => $group['creator_username'],
                'group_id' => $groupId,
            ],
            'members' => $members,
            'deadline' => $deadlines,
        ];
    }
    echo json_encode($result);
} else {
    echo json_encode(["error" => "User ID not provided."]);
}
?>