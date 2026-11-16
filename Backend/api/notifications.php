
<?php
// =============================================
// NOTIFICATIONS API
// =============================================

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit;
}

// =============================================
// DATABASE CONNECTION
// =============================================

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$host = "localhost";
$username = "root";
$password = "";
$database = "ayurvedic_db";

try {
  $conn = new mysqli($host, $username, $password, $database);
  $conn->set_charset("utf8mb4");
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => "Database connection failed"
  ]);
  exit;
}

// =============================================
// JSON RESPONSE
// =============================================

function response($success, $message, $data = null, $status = 200)
{
  http_response_code($status);

  $result = [
    "success" => $success,
    "message" => $message
  ];

  if ($data !== null) {
    $result["data"] = $data;
  }

  echo json_encode($result);
  exit;
}

// =============================================
// GET USER ID
// =============================================

function getUserId($input = [])
{
  $userId = $input["user_id"] ?? $_GET["user_id"] ?? 0;

  return filter_var(
    $userId,
    FILTER_VALIDATE_INT,
    ["options" => ["min_range" => 1]]
  ) ?: 0;
}

// =============================================
// GET - FETCH NOTIFICATIONS
// =============================================

if ($_SERVER["REQUEST_METHOD"] === "GET") {

  try {

    $userId = getUserId();

    if (!$userId) {
      response(false, "Valid user_id is required", null, 400);
    }

    $stmt = $conn->prepare("
            SELECT
                id,
                user_id,
                title,
                message,
                type,
                is_read,
                created_at
            FROM notificationWeb
            WHERE user_id = ?
            ORDER BY created_at DESC, id DESC
        ");

    $stmt->bind_param("i", $userId);
    $stmt->execute();

    $result = $stmt->get_result();

    $notifications = [];
    $unreadCount = 0;

    while ($row = $result->fetch_assoc()) {

      $isRead = (bool)$row["is_read"];

      if (!$isRead) {
        $unreadCount++;
      }

      $notifications[] = [
        "id" => (int)$row["id"],
        "user_id" => (int)$row["user_id"],
        "title" => $row["title"],
        "message" => $row["message"],
        "type" => $row["type"],
        "is_read" => $isRead,
        "created_at" => $row["created_at"]
      ];
    }

    $totalCount = count($notifications);

    $stmt->close();

    response(true, "Notifications fetched successfully", [
      "notifications" => $notifications,
      "total_count" => $totalCount,
      "unread_count" => $unreadCount
    ]);
  } catch (Throwable $e) {

    error_log("Notification GET Error: " . $e->getMessage());

    response(false, "Unable to fetch notifications", null, 500);
  }
}

// =============================================
// POST - NOTIFICATION ACTIONS
// =============================================

if ($_SERVER["REQUEST_METHOD"] === "POST") {

  try {

    $input = json_decode(file_get_contents("php://input"), true);

    if (!is_array($input)) {
      response(false, "Invalid JSON request", null, 400);
    }

    $userId = getUserId($input);
    $action = $input["action"] ?? "";

    if (!$userId) {
      response(false, "Valid user_id is required", null, 400);
    }

    if (!$action) {
      response(false, "Action is required", null, 400);
    }

    // =====================================
    // MARK SINGLE AS READ
    // =====================================

    if ($action === "mark_read") {

      $id = filter_var(
        $input["id"] ?? 0,
        FILTER_VALIDATE_INT,
        ["options" => ["min_range" => 1]]
      );

      if (!$id) {
        response(false, "Valid notification id is required", null, 400);
      }

      $stmt = $conn->prepare("
                UPDATE notificationWeb
                SET is_read = 1
                WHERE id = ? AND user_id = ?
            ");

      $stmt->bind_param("ii", $id, $userId);
      $stmt->execute();

      if ($stmt->affected_rows === 0) {

        $check = $conn->prepare("
                    SELECT id
                    FROM notificationWeb
                    WHERE id = ? AND user_id = ?
                ");

        $check->bind_param("ii", $id, $userId);
        $check->execute();

        $exists = $check->get_result()->fetch_assoc();

        $check->close();
        $stmt->close();

        if (!$exists) {
          response(false, "Notification not found", null, 404);
        }
      } else {
        $stmt->close();
      }

      response(true, "Notification marked as read successfully");
    }

    // =====================================
    // MARK ALL AS READ
    // =====================================

    if ($action === "mark_all_read") {

      $stmt = $conn->prepare("
                UPDATE notificationWeb
                SET is_read = 1
                WHERE user_id = ? AND is_read = 0
            ");

      $stmt->bind_param("i", $userId);
      $stmt->execute();
      $stmt->close();

      response(true, "All notifications marked as read");
    }

    // =====================================
    // DELETE SINGLE NOTIFICATION
    // =====================================

    if ($action === "delete") {

      $id = filter_var(
        $input["id"] ?? 0,
        FILTER_VALIDATE_INT,
        ["options" => ["min_range" => 1]]
      );

      if (!$id) {
        response(false, "Valid notification id is required", null, 400);
      }

      $stmt = $conn->prepare("
                DELETE FROM notificationWeb
                WHERE id = ? AND user_id = ?
            ");

      $stmt->bind_param("ii", $id, $userId);
      $stmt->execute();

      $deleted = $stmt->affected_rows;

      $stmt->close();

      if ($deleted === 0) {
        response(false, "Notification not found", null, 404);
      }

      response(true, "Notification deleted successfully");
    }

    // =====================================
    // CLEAR ALL NOTIFICATIONS
    // =====================================

    if ($action === "clear_all") {

      $stmt = $conn->prepare("
                DELETE FROM notificationWeb
                WHERE user_id = ?
            ");

      $stmt->bind_param("i", $userId);
      $stmt->execute();
      $stmt->close();

      response(true, "All notifications cleared successfully");
    }

    // =====================================
    // INVALID ACTION
    // =====================================

    response(false, "Invalid notification action", null, 400);
  } catch (Throwable $e) {

    error_log("Notification POST Error: " . $e->getMessage());

    response(false, "Notification operation failed", null, 500);
  }
}

// =============================================
// INVALID METHOD
// =============================================

response(false, "Method not allowed", null, 405);

?>
