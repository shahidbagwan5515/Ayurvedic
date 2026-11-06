
<?php

// ========================================
// CORS CONFIGURATION
// ========================================

$allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
  header("Access-Control-Allow-Origin: " . $origin);
  header("Vary: Origin");
}

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// OPTIONS REQUEST
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
// REQUEST METHOD
// ========================================

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  sendResponse(false, "Invalid request method.", 405);
}

// ========================================
// GET JSON DATA
// ========================================

$input = json_decode(file_get_contents("php://input"), true);

if (!is_array($input)) {
  sendResponse(false, "Invalid request data.", 400);
}

// ========================================
// FORM DATA
// ========================================

$name = trim($input["name"] ?? "");
$email = strtolower(trim($input["email"] ?? ""));
$phone = trim($input["phone"] ?? "");
$password = $input["password"] ?? "";

// ========================================
// VALIDATION
// ========================================

if ($name === "") {
  sendResponse(false, "Please enter your full name.", 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  sendResponse(false, "Please enter a valid email address.", 422);
}

if (!preg_match("/^[6-9][0-9]{9}$/", $phone)) {
  sendResponse(false, "Please enter a valid 10 digit mobile number.", 422);
}

if (!is_string($password) || strlen($password) < 8) {
  sendResponse(false, "Password must contain at least 8 characters.", 422);
}

// ========================================
// CHECK EXISTING EMAIL
// ========================================

$checkEmail = $conn->prepare(
  "SELECT id FROM signup WHERE email = ? LIMIT 1"
);

if (!$checkEmail) {
  error_log("Email query error: " . $conn->error);
  sendResponse(false, "Database query failed.", 500);
}

$checkEmail->bind_param("s", $email);
$checkEmail->execute();
$checkEmail->store_result();

if ($checkEmail->num_rows > 0) {
  $checkEmail->close();
  sendResponse(false, "Email address is already registered.", 409);
}

$checkEmail->close();

// ========================================
// CHECK EXISTING PHONE
// ========================================

$checkPhone = $conn->prepare(
  "SELECT id FROM signup WHERE phone = ? LIMIT 1"
);

if (!$checkPhone) {
  error_log("Phone query error: " . $conn->error);
  sendResponse(false, "Database query failed.", 500);
}

$checkPhone->bind_param("s", $phone);
$checkPhone->execute();
$checkPhone->store_result();

if ($checkPhone->num_rows > 0) {
  $checkPhone->close();
  sendResponse(false, "Mobile number is already registered.", 409);
}

$checkPhone->close();

// ========================================
// INSERT SIGNUP
// ========================================

// Plain text password as currently requested.
// Not recommended for production.

$stmt = $conn->prepare(
  "INSERT INTO signup (name, email, phone, password)
     VALUES (?, ?, ?, ?)"
);

if (!$stmt) {
  error_log("Insert query error: " . $conn->error);
  sendResponse(false, "Database query failed.", 500);
}

$stmt->bind_param(
  "ssss",
  $name,
  $email,
  $phone,
  $password
);

// ========================================
// EXECUTE QUERY
// ========================================

if ($stmt->execute()) {

  $userId = $conn->insert_id;

  $stmt->close();

  sendResponse(
    true,
    "Account created successfully!",
    201,
    [
      "id" => $userId,
      "name" => $name,
      "email" => $email,
      "phone" => $phone
    ]
  );
} else {

  if ($stmt->errno === 1062) {
    $stmt->close();

    sendResponse(
      false,
      "Email or mobile number already registered.",
      409
    );
  }

  error_log("Signup error: " . $stmt->error);

  $stmt->close();

  sendResponse(
    false,
    "Registration failed. Please try again.",
    500
  );
}

?>
