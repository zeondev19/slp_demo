<?php
/**
 * The SLP Curriculum — MySQL Database Bridge for Rumahweb cPanel
 * Enables secure HTTPS communication between Vercel and Rumahweb localhost MySQL.
 */

// Allow CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Bridge-Secret, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// -------------------------------------------------------------
// CONFIGURATION
// -------------------------------------------------------------
$dbConfig = [
    'host'     => '127.0.0.1',
    'port'     => 3306,
    'dbname'   => 'zeoq2598_slp_db',
    'user'     => 'zeoq2598_slp_admin',
    'pass'     => 'lZK0]6U#VL#^T~}(',
    'charset'  => 'utf8mb4'
];

// Secret key to protect this bridge endpoint
define('BRIDGE_SECRET', 'slp-curriculum-secure-bridge-2026');

// -------------------------------------------------------------
// DATABASE CONNECTION (Localhost)
// -------------------------------------------------------------
try {
    $dsn = "mysql:host={$dbConfig['host']};port={$dbConfig['port']};dbname={$dbConfig['dbname']};charset={$dbConfig['charset']}";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, $dbConfig['user'], $dbConfig['pass'], $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Failed to connect to MySQL on localhost: ' . $e->getMessage()
    ]);
    exit;
}

// -------------------------------------------------------------
// GET REQUEST: STATUS & HEALTH CHECK
// -------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query('SELECT COUNT(*) AS total_lessons FROM slp_lessons');
        $row = $stmt->fetch();
        echo json_encode([
            'status'       => 'ok',
            'message'      => 'SLP Database Bridge is live and connected to MySQL on localhost!',
            'database'     => $dbConfig['dbname'],
            'totalLessons' => (int)($row['total_lessons'] ?? 0),
            'timestamp'    => date('c')
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'status'  => 'error',
            'message' => $e->getMessage()
        ]);
    }
    exit;
}

// -------------------------------------------------------------
// AUTHENTICATION CHECK FOR QUERIES
// -------------------------------------------------------------
$headers = function_exists('getallheaders') ? getallheaders() : [];
$clientSecret = '';

foreach ($headers as $key => $val) {
    if (strtolower($key) === 'x-bridge-secret') {
        $clientSecret = $val;
        break;
    }
}

if (!$clientSecret && isset($_SERVER['HTTP_X_BRIDGE_SECRET'])) {
    $clientSecret = $_SERVER['HTTP_X_BRIDGE_SECRET'];
}

if ($clientSecret !== BRIDGE_SECRET) {
    http_response_code(401);
    echo json_encode([
        'status' => 'error',
        'error'  => 'Unauthorized: Invalid X-Bridge-Secret header.'
    ]);
    exit;
}

// -------------------------------------------------------------
// POST REQUEST: EXECUTE QUERY OR BATCH QUERIES
// -------------------------------------------------------------
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

function runSingleQuery($pdo, $sql, $params) {
    $stmt = $pdo->prepare($sql);
    foreach ($params as $idx => $val) {
        $pos = $idx + 1;
        if (is_int($val)) {
            $stmt->bindValue($pos, $val, PDO::PARAM_INT);
        } elseif (is_bool($val)) {
            $stmt->bindValue($pos, $val, PDO::PARAM_BOOL);
        } elseif (is_null($val)) {
            $stmt->bindValue($pos, $val, PDO::PARAM_NULL);
        } else {
            $stmt->bindValue($pos, (string)$val, PDO::PARAM_STR);
        }
    }
    $stmt->execute();
    if (preg_match('/^\s*(SELECT|SHOW|DESCRIBE|EXPLAIN)/i', $sql)) {
        return [
            'rows'         => $stmt->fetchAll(),
            'insertId'     => 0,
            'affectedRows' => 0,
        ];
    }
    return [
        'rows'         => [],
        'insertId'     => (int)$pdo->lastInsertId(),
        'affectedRows' => $stmt->rowCount(),
    ];
}

// Support batch queries in 1 single HTTP request + 1 MySQL connection
if (isset($data['batch']) && is_array($data['batch'])) {
    try {
        $results = [];
        foreach ($data['batch'] as $item) {
            $qSql = trim($item['sql'] ?? '');
            $qParams = isset($item['params']) && is_array($item['params']) ? $item['params'] : [];
            $results[] = runSingleQuery($pdo, $qSql, $qParams);
        }
        echo json_encode([
            'status'  => 'ok',
            'results' => $results,
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'error'  => $e->getMessage(),
            'code'   => $e->getCode(),
        ]);
    }
    exit;
}

if (!isset($data['sql']) || !is_string($data['sql'])) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'error'  => 'Missing "sql" parameter in request body.'
    ]);
    exit;
}

$sql = trim($data['sql']);
$params = isset($data['params']) && is_array($data['params']) ? $data['params'] : [];

try {
    $stmt = $pdo->prepare($sql);

    // Bind parameters with appropriate PDO types
    foreach ($params as $idx => $val) {
        $pos = $idx + 1; // 1-indexed for positional placeholders
        if (is_int($val)) {
            $stmt->bindValue($pos, $val, PDO::PARAM_INT);
        } elseif (is_bool($val)) {
            $stmt->bindValue($pos, $val, PDO::PARAM_BOOL);
        } elseif (is_null($val)) {
            $stmt->bindValue($pos, $val, PDO::PARAM_NULL);
        } else {
            $stmt->bindValue($pos, (string)$val, PDO::PARAM_STR);
        }
    }

    $stmt->execute();

    // Check if SELECT / SHOW / DESCRIBE query
    if (preg_match('/^\s*(SELECT|SHOW|DESCRIBE|EXPLAIN)/i', $sql)) {
        $rows = $stmt->fetchAll();
        echo json_encode([
            'status' => 'ok',
            'rows'   => $rows
        ]);
    } else {
        $insertId = (int)$pdo->lastInsertId();
        $affectedRows = $stmt->rowCount();
        echo json_encode([
            'status'       => 'ok',
            'rows'         => [],
            'insertId'     => $insertId,
            'affectedRows' => $affectedRows
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'error'  => $e->getMessage(),
        'code'   => $e->getCode()
    ]);
}
