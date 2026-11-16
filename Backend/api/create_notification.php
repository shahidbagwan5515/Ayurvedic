<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");

// =====================================
// CORS PREFLIGHT
// =====================================
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit;
}

// =====================================
// JSON RESPONSE FUNCTION
// =====================================
function response($success, $message, $status = 200, $data = null)
{
  http_response_code($status);

  echo json_encode([
    "success" => $success,
    "message" => $message,
    "data" => $data
  ]);

  exit;
}

// =====================================
// ONLY POST REQUEST ALLOWED
// =====================================
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  response(false, "Method not allowed", 405);
}

// =====================================
// DATABASE CONNECTION
// =====================================
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$conn = null;
$stmt = null;

try {

  $conn = new mysqli(
    "localhost",
    "root",
    "",
    "ayurvedic_db"
  );

  $conn->set_charset("utf8mb4");

  // =====================================
  // GET JSON INPUT
  // =====================================
  $rawInput = file_get_contents("php://input");
  $input = json_decode($rawInput, true);

  if (!is_array($input)) {
    response(false, "Invalid JSON data", 400);
  }

  // =====================================
  // GET NOTIFICATION DATA
  // =====================================
  $user_id = filter_var(
    $input["user_id"] ?? null,
    FILTER_VALIDATE_INT
  );

  $title = trim((string)($input["title"] ?? ""));
  $message = trim((string)($input["message"] ?? ""));
  $type = trim((string)($input["type"] ?? "general"));

  // =====================================
  // ALLOWED NOTIFICATION TYPES
  // =====================================
  $allowedTypes = [
    "order",
    "shipping",
    "offer",
    "general",
    "cart",
    "wishlist",
    "product"
  ];

  // =====================================
  // VALIDATION
  // =====================================
  if (
    $user_id === false ||
    $user_id === null ||
    $user_id <= 0
  ) {
    response(false, "Valid customer ID is required", 400);
  }

  if ($title === "") {
    response(false, "Notification title is required", 400);
  }

  if ($message === "") {
    response(false, "Notification message is required", 400);
  }

  if (!in_array($type, $allowedTypes, true)) {
    response(false, "Invalid notification type", 400);
  }

  if (mb_strlen($title) > 255) {
    response(false, "Notification title is too long", 400);
  }

  // =====================================
  // INSERT NOTIFICATION
  // =====================================
  $sql = "
        INSERT INTO notificationWeb
        (
            user_id,
            title,
            message,
            type,
            is_read
        )
        VALUES (?, ?, ?, ?, 0)
    ";

  $stmt = $conn->prepare($sql);

  $stmt->bind_param(
    "isss",
    $user_id,
    $title,
    $message,
    $type
  );

  $stmt->execute();

  $notificationId = $stmt->insert_id;

  // =====================================
  // SUCCESS RESPONSE
  // =====================================
  response(
    true,
    "Notification created successfully",
    200,
    [
      "id" => $notificationId,
      "user_id" => $user_id,
      "title" => $title,
      "message" => $message,
      "type" => $type,
      "is_read" => 0
    ]
  );
} catch (Throwable $error) {

  error_log(
    "Create Notification Error: " . $error->getMessage()
  );

  response(
    false,
    "Unable to create notification",
    500
  );
} finally {

  if ($stmt !== null) {
    $stmt->close();
  }

  if ($conn !== null) {
    $conn->close();
  }
}
