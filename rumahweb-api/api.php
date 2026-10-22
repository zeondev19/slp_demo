<?php
// ============================================================
// The SLP Curriculum — Rumahweb Lightweight REST API Bridge
// Connects to MySQL via localhost (bypasses port 3306 firewall)
// Place this file in public_html/api.php or public_html/slp-api/index.php
// ============================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Database Credentials (Runs inside Rumahweb so host is localhost)
$db_host = 'localhost';
$db_port = 3306;
$db_name = 'zeoq2598_slp_db';
$db_user = 'zeoq2598_slp_admin';
$db_pass = 'YOUR_DB_PASSWORD'; // Replace with your password

try {
    $pdo = new PDO("mysql:host=$db_host;port=$db_port;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

$action = $_GET['action'] ?? 'lessons';

// 1. Get Lessons with Filter & Search
if ($action === 'lessons') {
    $q = $_GET['q'] ?? '';
    $domain = $_GET['domain'] ?? '';
    $target = $_GET['target'] ?? '';
    $level = $_GET['level'] ?? '';
    $activity_format = $_GET['activity_format'] ?? '';
    $topic = $_GET['topic'] ?? '';
    $sort = $_GET['sort'] ?? 'relevant';
    $page = max(1, (int)($_GET['page'] ?? 1));
    $limit = min(100, max(1, (int)($_GET['limit'] ?? 24)));
    $offset = ($page - 1) * $limit;

    $where = [];
    $params = [];

    if ($q) {
        $where[] = "(title LIKE ? OR description LIKE ? OR target LIKE ? OR primary_skill LIKE ?)";
        $searchTerm = "%$q%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    if ($domain) { $where[] = "domain = ?"; $params[] = $domain; }
    if ($target) { $where[] = "target = ?"; $params[] = $target; }
    if ($level) { $where[] = "level = ?"; $params[] = $level; }
    if ($activity_format) { $where[] = "activity_format = ?"; $params[] = $activity_format; }
    if ($topic) { $where[] = "topic = ?"; $params[] = $topic; }

    $whereSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';

    // Total Count
    $countStmt = $pdo->prepare("SELECT COUNT(*) as total FROM slp_lessons $whereSql");
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    // Sorting
    $orderSql = 'ORDER BY popularity_score DESC';
    if ($sort === 'newest') $orderSql = 'ORDER BY id DESC';

    $dataStmt = $pdo->prepare("SELECT id, title, description, domain, target, level, primary_skill, secondary_skill, activity_format, topic, duration_minutes, popularity_score, is_new FROM slp_lessons $whereSql $orderSql LIMIT $limit OFFSET $offset");
    $dataStmt->execute($params);
    $lessons = $dataStmt->fetchAll();

    echo json_encode([
        'lessons' => $lessons,
        'total' => $total,
        'page' => $page,
        'totalPages' => ceil($total / $limit)
    ]);
    exit;
}

// 2. Curriculums
if ($action === 'curriculums') {
    $stmt = $pdo->query("SELECT * FROM slp_curriculums ORDER BY sort_order ASC");
    echo json_encode(['curriculums' => $stmt->fetchAll()]);
    exit;
}

// Default fallback
echo json_encode(['status' => 'online', 'database' => 'connected', 'total_lessons' => 1000]);
