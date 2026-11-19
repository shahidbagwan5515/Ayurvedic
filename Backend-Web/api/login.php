
<?php

// ========================================
// CORS CONFIGURATION
// ========================================

header("Content-Type: application/json; charset=UTF-8");

$allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174"
];

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
  header("Access-Control-Allow-Origin: " . $origin);
  header("Vary: Origin");
}

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit;
}

// ========================================
// DATABASE CONNECTION
// ========================================

require_once __DIR__ . "/../config/db.php";

// ========================================
// RESPONSE FUNCTION
// ========================================

function sendResponse($success, $message, $statusCode = 200, $data = null)
{
  http_response_code($statusCode);

  echo json_encode([
    "success" => $success,
    "message" => $message,
    "data" => $data
  ]);

  exit;
}

// ========================================
// CHECK REQUEST METHOD
// ========================================

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  sendResponse(false, "Invalid request method.", 405);
}

// ========================================
// READ JSON INPUT
// ========================================

$input = json_decode(file_get_contents("php://input"), true);

if (!is_array($input)) {
  sendResponse(false, "Invalid request data.", 400);
}

// ========================================
// GET FORM DATA
// ========================================

$email = strtolower(trim($input["email"] ?? ""));
$password = $input["password"] ?? "";

// ========================================
// VALIDATION
// ========================================

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  sendResponse(false, "Please enter a valid email address.", 422);
}

if (!is_string($password) || $password === "") {
  sendResponse(false, "Please enter your password.", 422);
}

// ========================================
// FIND CUSTOMER
// ========================================

$stmt = $conn->prepare(
  "SELECT id, name, email, phone, password
     FROM signup
     WHERE email = ?
     LIMIT 1"
);

if (!$stmt) {
  error_log("Login query error: " . $conn->error);

  sendResponse(false, "Database query failed.", 500);
}

$stmt->bind_param("s", $email);

if (!$stmt->execute()) {

  error_log("Login execute error: " . $stmt->error);

  $stmt->close();

  sendResponse(false, "Login failed. Please try again.", 500);
}

$result = $stmt->get_result();

$user = $result->fetch_assoc();

$stmt->close();

if (!$user) {
  sendResponse(false, "Email or password is incorrect.", 401);
}

// ========================================
// VERIFY PASSWORD
// ========================================

$storedPassword = $user["password"];

$isValidPassword = password_verify($password, $storedPassword);

// Support old plain-text passwords and upgrade them.

if (
  !$isValidPassword &&
  password_get_info($storedPassword)["algo"] === null &&
  hash_equals($storedPassword, $password)
) {

  $newHash = password_hash($password, PASSWORD_DEFAULT);

  if ($newHash !== false) {

    $update = $conn->prepare(
      "UPDATE signup SET password = ? WHERE id = ?"
    );

    if ($update) {
      $update->bind_param("si", $newHash, $user["id"]);
      $update->execute();
      $update->close();
    }
  }

  $isValidPassword = true;
}

if (!$isValidPassword) {
  sendResponse(false, "Email or password is incorrect.", 401);
}

// ========================================
// LOGIN SUCCESS
// ========================================

unset($user["password"]);

sendResponse(
  true,
  "Login successful!",
  200,
  $user
);

?>
