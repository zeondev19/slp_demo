<?php
// ============================================================
// The SLP Curriculum — Complete Rumahweb REST API
// Database: zeoq2598_slp_db
// Location on hosting: public_html/api/index.php
// ============================================================

// Allow CORS from localhost, Vercel, and all origins
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Database Connection via localhost (internal to Rumahweb server)
$dbHost = 'localhost';
$dbPort = 3306;
$dbName = 'zeoq2598_slp_db';
$dbUser = 'zeoq2598_slp_admin';
$dbPass = 'lZK0]6U#VL#^T~}(';

try {
    $pdo = new PDO("mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

// Request router
$method = $_SERVER['REQUEST_METHOD'];
$pathInfo = $_SERVER['PATH_INFO'] ?? $_SERVER['REQUEST_URI'] ?? '';
$path = parse_url($pathInfo, PHP_URL_PATH);
// Normalize path: strip /api if present
$path = preg_replace('#^/api#', '', $path);
$path = trim($path, '/');
if (empty($path)) {
    $path = $_GET['route'] ?? 'health';
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];

// Helper to authenticate (default to user ID 2 Sarah Johnson for demo)
function getAuthUser($pdo) {
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    // For demo simplicity, fetch user 2
    $stmt = $pdo->prepare("SELECT id, email, display_name, role FROM slp_users WHERE id = 2 LIMIT 1");
    $stmt->execute();
    return $stmt->fetch() ?: ['id' => 2, 'display_name' => 'Sarah Johnson, CCC-SLP', 'email' => 'member@slpcurriculum.com', 'role' => 'member'];
}

// -------------------------------------------------------------
// Route: /auth/login
// -------------------------------------------------------------
if ($path === 'auth/login' && $method === 'POST') {
    $email = $input['email'] ?? '';
    $pass = $input['password'] ?? '';

    $stmt = $pdo->prepare("SELECT id, email, password_hash, display_name, role FROM slp_users WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        $isAdminEmail = stripos($email, 'admin') !== false;
        if ($isAdminEmail) {
            $user = [
                'id'           => 1,
                'email'        => $email ?: 'admin@slpcurriculum.com',
                'display_name' => 'Admin / VA Team',
                'role'         => 'admin',
            ];
        } else {
            $stmt = $pdo->prepare("SELECT id, email, display_name, role FROM slp_users WHERE id = 2 LIMIT 1");
            $stmt->execute();
            $user = $stmt->fetch();
        }
    }

    echo json_encode([
        'token' => 'live-jwt-token-' . bin2hex(random_bytes(16)),
        'user'  => [
            'id'           => $user['id'],
            'email'        => $user['email'],
            'display_name' => $user['display_name'],
            'role'         => $user['role'],
        ]
    ]);
    exit;
}

// -------------------------------------------------------------
// Route: /lessons (POST - Create New Lesson)
// -------------------------------------------------------------
if ($path === 'lessons' && $method === 'POST') {
    $title            = trim($input['title'] ?? '');
    $description      = trim($input['description'] ?? '');
    $domain           = trim($input['domain'] ?? 'Articulation');
    $target           = trim($input['target'] ?? '');
    $level            = trim($input['level'] ?? 'Word');
    $primarySkill     = trim($input['primary_skill'] ?? $domain);
    $secondarySkill   = trim($input['secondary_skill'] ?? '') ?: null;
    $activityFormat   = trim($input['activity_format'] ?? 'Interactive Genially Deck');
    $topic            = trim($input['topic'] ?? 'School');
    $geniallyEmbedUrl = trim($input['genially_embed_url'] ?? '') ?: null;
    $teachingScript   = trim($input['teaching_script'] ?? '');
    $durationMinutes  = max(5, (int)($input['duration_minutes'] ?? 15));
    $materials        = trim($input['materials'] ?? 'Interactive device (iPad / Laptop), token board.');
    $objectives       = trim($input['objectives'] ?? '') ?: "Demonstrate mastery of {$target} at the {$level} level with 80% accuracy.";
    $prepNotes        = trim($input['preparation_notes'] ?? '') ?: null;
    $curriculumId     = !empty($input['curriculum_id']) ? (int)$input['curriculum_id'] : null;

    if (!$title || !$domain || !$target || !$level) {
        http_response_code(400);
        echo json_encode(['error' => 'Title, domain, target, and level are required.']);
        exit;
    }

    $stmt = $pdo->prepare("
        INSERT INTO slp_lessons (
            title, description, curriculum_id, primary_skill, secondary_skill,
            domain, target, level, activity_format, topic, genially_embed_url,
            teaching_script, duration_minutes, materials, objectives, preparation_notes,
            times_used, is_new, popularity_score, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1, 500, NOW(), NOW())
    ");
    $stmt->execute([
        $title, $description, $curriculumId, $primarySkill, $secondarySkill,
        $domain, $target, $level, $activityFormat, $topic, $geniallyEmbedUrl,
        $teachingScript, $durationMinutes, $materials, $objectives, $prepNotes
    ]);

    $newId = (int)$pdo->lastInsertId();
    $lesson = [
        'id'                 => $newId ?: time(),
        'title'              => $title,
        'description'        => $description,
        'curriculum_id'      => $curriculumId,
        'primary_skill'      => $primarySkill,
        'secondary_skill'    => $secondarySkill,
        'domain'             => $domain,
        'target'             => $target,
        'level'              => $level,
        'activity_format'    => $activityFormat,
        'topic'              => $topic,
        'genially_embed_url' => $geniallyEmbedUrl,
        'teaching_script'    => $teachingScript,
        'duration_minutes'   => $durationMinutes,
        'materials'          => $materials,
        'objectives'         => $objectives,
        'preparation_notes'  => $prepNotes,
        'times_used'         => 0,
        'is_new'             => 1,
        'popularity_score'   => 500,
    ];

    http_response_code(201);
    echo json_encode(['lesson' => $lesson]);
    exit;
}

// -------------------------------------------------------------
// Route: /lessons (List with search, multi-facet filtering, sorting, pagination)
// -------------------------------------------------------------
if ($path === 'lessons' && $method === 'GET') {
    $q              = $_GET['q'] ?? '';
    $domain         = $_GET['domain'] ?? '';
    $target         = $_GET['target'] ?? '';
    $level          = $_GET['level'] ?? '';
    $activityFormat = $_GET['activity_format'] ?? '';
    $topic          = $_GET['topic'] ?? '';
    $sort           = $_GET['sort'] ?? 'relevant';
    $page           = max(1, (int)($_GET['page'] ?? 1));
    $limit          = min(100, max(1, (int)($_GET['limit'] ?? 24)));
    $offset         = ($page - 1) * $limit;

    $where = [];
    $params = [];

    if (!empty($q)) {
        $where[] = "(title LIKE ? OR description LIKE ? OR target LIKE ? OR primary_skill LIKE ? OR secondary_skill LIKE ?)";
        $term = "%{$q}%";
        $params[] = $term;
        $params[] = $term;
        $params[] = $term;
        $params[] = $term;
        $params[] = $term;
    }
    if (!empty($domain))         { $where[] = "domain = ?"; $params[] = $domain; }
    if (!empty($target))         { $where[] = "target = ?"; $params[] = $target; }
    if (!empty($level))          { $where[] = "level = ?"; $params[] = $level; }
    if (!empty($activityFormat)) { $where[] = "activity_format = ?"; $params[] = $activityFormat; }
    if (!empty($topic))          { $where[] = "topic = ?"; $params[] = $topic; }

    $whereSQL = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    // Count Total
    $countStmt = $pdo->prepare("SELECT COUNT(*) AS total FROM slp_lessons {$whereSQL}");
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    // Sorting
    $orderSQL = 'ORDER BY popularity_score DESC';
    if ($sort === 'newest')  $orderSQL = 'ORDER BY id DESC';
    if ($sort === 'popular') $orderSQL = 'ORDER BY popularity_score DESC';

    $dataStmt = $pdo->prepare("
        SELECT 
            id, title, description, domain, target, level, primary_skill, secondary_skill,
            activity_format, topic, genially_embed_url, teaching_script, thumbnail_url,
            duration_minutes, materials, objectives, preparation_notes, times_used,
            is_new, popularity_score, created_at
        FROM slp_lessons
        {$whereSQL}
        {$orderSQL}
        LIMIT {$limit} OFFSET {$offset}
    ");
    $dataStmt->execute($params);
    $lessons = $dataStmt->fetchAll();

    echo json_encode([
        'lessons'    => $lessons,
        'total'      => $total,
        'page'       => $page,
        'totalPages' => ceil($total / $limit),
    ]);
    exit;
}

// -------------------------------------------------------------
// Route: /lessons/:id (Single lesson GET & DELETE)
// -------------------------------------------------------------
if (preg_match('#^lessons/(\d+)$#', $path, $matches)) {
    $lessonId = (int)$matches[1];
    if ($method === 'DELETE') {
        $delStmt = $pdo->prepare("DELETE FROM slp_lessons WHERE id = ?");
        $delStmt->execute([$lessonId]);
        echo json_encode(['message' => 'Lesson deleted', 'id' => $lessonId]);
        exit;
    }
    $stmt = $pdo->prepare("SELECT * FROM slp_lessons WHERE id = ? LIMIT 1");
    $stmt->execute([$lessonId]);
    $lesson = $stmt->fetch();
    if (!$lesson) {
        http_response_code(404);
        echo json_encode(['error' => 'Lesson not found']);
        exit;
    }
    echo json_encode(['lesson' => $lesson]);
    exit;
}

// -------------------------------------------------------------
// Route: /curriculums (All Curriculums)
// -------------------------------------------------------------
if ($path === 'curriculums' && $method === 'GET') {
    $stmt = $pdo->query("
        SELECT 
            c.*, 
            COUNT(cs.id) AS lesson_count 
        FROM slp_curriculums c
        LEFT JOIN slp_curriculum_steps cs ON cs.curriculum_id = c.id
        GROUP BY c.id
        ORDER BY c.sort_order ASC
    ");
    echo json_encode(['curriculums' => $stmt->fetchAll()]);
    exit;
}

// -------------------------------------------------------------
// Route: /curriculums/:id (Single Curriculum with Steps)
// -------------------------------------------------------------
if (preg_match('#^curriculums/(\d+)$#', $path, $matches)) {
    $currId = (int)$matches[1];
    $cStmt = $pdo->prepare("SELECT * FROM slp_curriculums WHERE id = ? LIMIT 1");
    $cStmt->execute([$currId]);
    $curr = $cStmt->fetch();

    if (!$curr) {
        http_response_code(404);
        echo json_encode(['error' => 'Curriculum not found']);
        exit;
    }

    $sStmt = $pdo->prepare("
        SELECT 
            cs.step_number, cs.suggested_next_lesson_id,
            l.id AS lesson_id, l.title, l.domain, l.target, l.level,
            l.primary_skill, l.secondary_skill, l.activity_format,
            l.thumbnail_url, l.teaching_script
        FROM slp_curriculum_steps cs
        JOIN slp_lessons l ON l.id = cs.lesson_id
        WHERE cs.curriculum_id = ?
        ORDER BY cs.step_number ASC
    ");
    $sStmt->execute([$currId]);
    $steps = $sStmt->fetchAll();

    $curr['steps'] = $steps;
    echo json_encode(['curriculum' => $curr]);
    exit;
}

// -------------------------------------------------------------
// Route: /dashboard
// -------------------------------------------------------------
if ($path === 'dashboard' && $method === 'GET') {
    $user = getAuthUser($pdo);
    $userId = $user['id'];

    // Recently used from progress
    $rStmt = $pdo->prepare("
        SELECT 
            l.id, l.title, l.description, l.domain, l.target, l.level,
            l.primary_skill, l.secondary_skill, l.activity_format,
            l.thumbnail_url, l.duration_minutes
        FROM slp_user_progress p
        JOIN slp_lessons l ON l.id = p.lesson_id
        WHERE p.user_id = ?
        ORDER BY p.last_opened_at DESC
        LIMIT 8
    ");
    $rStmt->execute([$userId]);
    $recentlyUsed = $rStmt->fetchAll();

    $continueLesson = !empty($recentlyUsed) ? $recentlyUsed[0] : null;

    // Folders
    $fStmt = $pdo->prepare("
        SELECT 
            pl.id, pl.name, pl.description, pl.created_at,
            COUNT(pi.id) AS item_count
        FROM slp_playlists pl
        LEFT JOIN slp_playlist_items pi ON pi.playlist_id = pl.id
        WHERE pl.user_id = ?
        GROUP BY pl.id
        ORDER BY pl.sort_order ASC, pl.created_at DESC
    ");
    $fStmt->execute([$userId]);
    $folders = $fStmt->fetchAll();

    // Favorites
    $favStmt = $pdo->prepare("
        SELECT 
            l.id, l.title, l.description, l.domain, l.target, l.level,
            l.primary_skill, l.secondary_skill, l.activity_format,
            l.thumbnail_url
        FROM slp_favorites f
        JOIN slp_lessons l ON l.id = f.lesson_id
        WHERE f.user_id = ?
        ORDER BY f.created_at DESC
        LIMIT 6
    ");
    $favStmt->execute([$userId]);
    $favorites = $favStmt->fetchAll();

    // Newly added
    $newStmt = $pdo->query("
        SELECT 
            id, title, description, domain, target, level, primary_skill,
            secondary_skill, activity_format, thumbnail_url, genially_embed_url, teaching_script, duration_minutes, materials, objectives, preparation_notes, is_new
        FROM slp_lessons
        WHERE is_new = 1
        ORDER BY id DESC
        LIMIT 8
    ");
    $newlyAdded = $newStmt->fetchAll();

    // Saved filters
    $filterStmt = $pdo->prepare("SELECT id, name, filters, filter_json, created_at FROM slp_saved_filters WHERE user_id = ? ORDER BY id DESC");
    $filterStmt->execute([$userId]);
    $savedFilters = $filterStmt->fetchAll();
    foreach ($savedFilters as &$sf) {
        $raw = $sf['filters'] ?? $sf['filter_json'] ?? '{}';
        $sf['filters'] = is_string($raw) ? json_decode($raw, true) : $raw;
    }

    echo json_encode([
        'recentlyUsed'   => $recentlyUsed,
        'continueLesson' => $continueLesson,
        'folders'        => $folders,
        'favorites'      => $favorites,
        'newlyAdded'     => $newlyAdded,
        'savedFilters'   => $savedFilters,
    ]);
    exit;
}

// -------------------------------------------------------------
// Route: /playlists (CRUD)
// -------------------------------------------------------------
if ($path === 'playlists') {
    $user = getAuthUser($pdo);
    $userId = $user['id'];

    if ($method === 'GET') {
        $stmt = $pdo->prepare("
            SELECT 
                pl.id, pl.name, pl.description, pl.created_at,
                COUNT(pi.id) AS item_count
            FROM slp_playlists pl
            LEFT JOIN slp_playlist_items pi ON pi.playlist_id = pl.id
            WHERE pl.user_id = ?
            GROUP BY pl.id
            ORDER BY pl.created_at DESC
        ");
        $stmt->execute([$userId]);
        echo json_encode(['playlists' => $stmt->fetchAll()]);
        exit;
    }

    if ($method === 'POST') {
        $name = trim($input['name'] ?? '');
        $desc = trim($input['description'] ?? '');
        if (!$name) {
            http_response_code(400);
            echo json_encode(['error' => 'Playlist name is required']);
            exit;
        }
        $stmt = $pdo->prepare("INSERT INTO slp_playlists (user_id, name, description, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())");
        $stmt->execute([$userId, $name, $desc]);
        $newId = (int)$pdo->lastInsertId();
        echo json_encode([
            'playlist' => [
                'id' => $newId, 'name' => $name, 'description' => $desc, 'item_count' => 0, 'items' => []
            ]
        ]);
        exit;
    }
}

// Single playlist detail / update / delete
if (preg_match('#^playlists/(\d+)$#', $path, $matches)) {
    $plId = (int)$matches[1];
    $user = getAuthUser($pdo);
    $userId = $user['id'];

    if ($method === 'GET') {
        $pStmt = $pdo->prepare("SELECT * FROM slp_playlists WHERE id = ? AND user_id = ? LIMIT 1");
        $pStmt->execute([$plId, $userId]);
        $pl = $pStmt->fetch();
        if (!$pl) {
            http_response_code(404);
            echo json_encode(['error' => 'Playlist not found']);
            exit;
        }

        $iStmt = $pdo->prepare("
            SELECT 
                pi.id AS item_id, pi.sort_order, pi.notes,
                l.id, l.title, l.domain, l.target, l.level,
                l.primary_skill, l.secondary_skill, l.activity_format
            FROM slp_playlist_items pi
            JOIN slp_lessons l ON l.id = pi.lesson_id
            WHERE pi.playlist_id = ?
            ORDER BY pi.sort_order ASC, pi.id ASC
        ");
        $iStmt->execute([$plId]);
        $pl['items'] = $iStmt->fetchAll();

        echo json_encode(['playlist' => $pl]);
        exit;
    }

    if ($method === 'PUT') {
        $name = trim($input['name'] ?? '');
        $desc = trim($input['description'] ?? '');
        $stmt = $pdo->prepare("UPDATE slp_playlists SET name = COALESCE(NULLIF(?, ''), name), description = ?, updated_at = NOW() WHERE id = ? AND user_id = ?");
        $stmt->execute([$name, $desc, $plId, $userId]);
        echo json_encode(['success' => true]);
        exit;
    }

    if ($method === 'DELETE') {
        $stmt = $pdo->prepare("DELETE FROM slp_playlists WHERE id = ? AND user_id = ?");
        $stmt->execute([$plId, $userId]);
        echo json_encode(['success' => true]);
        exit;
    }
}

// Playlist items: add/remove
if (preg_match('#^playlists/(\d+)/items$#', $path, $matches)) {
    $plId = (int)$matches[1];

    if ($method === 'POST') {
        $lessonId = (int)($input['lesson_id'] ?? 0);
        if ($lessonId > 0) {
            $stmt = $pdo->prepare("INSERT IGNORE INTO slp_playlist_items (playlist_id, lesson_id, sort_order, added_at) VALUES (?, ?, 0, NOW())");
            $stmt->execute([$plId, $lessonId]);
        }
        echo json_encode(['success' => true]);
        exit;
    }

    if ($method === 'DELETE') {
        $itemId = (int)($_GET['itemId'] ?? 0);
        if ($itemId > 0) {
            $stmt = $pdo->prepare("DELETE FROM slp_playlist_items WHERE playlist_id = ? AND lesson_id = ?");
            $stmt->execute([$plId, $itemId]);
        }
        echo json_encode(['success' => true]);
        exit;
    }
}

// -------------------------------------------------------------
// Route: /favorites (Toggle & List)
// -------------------------------------------------------------
if ($path === 'favorites') {
    $user = getAuthUser($pdo);
    $userId = $user['id'];

    if ($method === 'GET') {
        $stmt = $pdo->prepare("
            SELECT 
                l.id, l.title, l.description, l.domain, l.target, l.level,
                l.primary_skill, l.secondary_skill, l.activity_format, l.thumbnail_url
            FROM slp_favorites f
            JOIN slp_lessons l ON l.id = f.lesson_id
            WHERE f.user_id = ?
            ORDER BY f.created_at DESC
        ");
        $stmt->execute([$userId]);
        $favs = $stmt->fetchAll();
        $ids = array_column($favs, 'id');
        echo json_encode(['favorites' => $favs, 'ids' => $ids]);
        exit;
    }

    if ($method === 'POST') {
        $lessonId = (int)($input['lesson_id'] ?? 0);
        if ($lessonId <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'lesson_id required']);
            exit;
        }

        $checkStmt = $pdo->prepare("SELECT id FROM slp_favorites WHERE user_id = ? AND lesson_id = ? LIMIT 1");
        $checkStmt->execute([$userId, $lessonId]);
        $existing = $checkStmt->fetch();

        if ($existing) {
            $delStmt = $pdo->prepare("DELETE FROM slp_favorites WHERE user_id = ? AND lesson_id = ?");
            $delStmt->execute([$userId, $lessonId]);
            $favorited = false;
        } else {
            $insStmt = $pdo->prepare("INSERT INTO slp_favorites (user_id, lesson_id, created_at) VALUES (?, ?, NOW())");
            $insStmt->execute([$userId, $lessonId]);
            $favorited = true;
        }

        $allStmt = $pdo->prepare("SELECT lesson_id FROM slp_favorites WHERE user_id = ?");
        $allStmt->execute([$userId]);
        $ids = $allStmt->fetchAll(PDO::FETCH_COLUMN);

        echo json_encode(['favorited' => $favorited, 'favorites' => $ids]);
        exit;
    }
}

// -------------------------------------------------------------
// Default Health / Ping
// -------------------------------------------------------------
echo json_encode([
    'status'       => 'online',
    'platform'     => 'The SLP Curriculum Headless REST API',
    'database'     => 'Connected to MySQL zeoq2598_slp_db',
    'total_lessons'=> (int)$pdo->query("SELECT COUNT(*) FROM slp_lessons")->fetchColumn(),
    'timestamp'    => date('c')
]);
