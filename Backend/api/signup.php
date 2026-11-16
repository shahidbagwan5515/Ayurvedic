<?php

// ========================================
// CORS CONFIGURATION
// ========================================

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

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

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
// READ JSON INPUT
// ========================================

$input = json_decode(file_get_contents("php://input"), true);

if (!is_array($input)) {
  $input = [];
}

$method = $_SERVER["REQUEST_METHOD"];

// ========================================
// GET CUSTOMER PROFILE (READ)
// ========================================

if ($method === "GET") {

  $id = intval($_GET["id"] ?? 0);

  if ($id <= 0) {
    sendResponse(false, "Customer ID is required.", 400);
  }

  $stmt = $conn->prepare(
    "SELECT id, name, email, phone FROM signup WHERE id = ? LIMIT 1"
  );

  if (!$stmt) {
    sendResponse(false, "Database query failed.", 500);
  }

  $stmt->bind_param("i", $id);
  $stmt->execute();

  $result = $stmt->get_result();
  $user = $result->fetch_assoc();

  $stmt->close();

  if (!$user) {
    sendResponse(false, "Customer account not found.", 404);
  }

  sendResponse(true, "Customer details fetched successfully.", 200, $user);
}

// ========================================
// CREATE CUSTOMER ACCOUNT (SIGNUP)
// ========================================

if ($method === "POST") {

  $name = trim($input["name"] ?? "");
  $email = strtolower(trim($input["email"] ?? ""));
  $phone = trim($input["phone"] ?? "");
  $password = $input["password"] ?? "";

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

  // Check duplicate email or phone

  $check = $conn->prepare(
    "SELECT id FROM signup WHERE email = ? OR phone = ? LIMIT 1"
  );

  if (!$check) {
    sendResponse(false, "Database query failed.", 500);
  }

  $check->bind_param("ss", $email, $phone);
  $check->execute();
  $check->store_result();

  if ($check->num_rows > 0) {
    $check->close();
    sendResponse(false, "Email or mobile number already registered.", 409);
  }

  $check->close();

  // Existing password storage behavior retained for compatibility.
  // For production, migrate to password_hash() and password_verify().

  $stmt = $conn->prepare(
    "INSERT INTO signup (name, email, phone, password)
         VALUES (?, ?, ?, ?)"
  );

  if (!$stmt) {
    sendResponse(false, "Database query failed.", 500);
  }

  $stmt->bind_param("ssss", $name, $email, $phone, $password);

  if ($stmt->execute()) {

    $userId = $conn->insert_id;
    $stmt->close();

    sendResponse(true, "Account created successfully!", 201, [
      "id" => $userId,
      "name" => $name,
      "email" => $email,
      "phone" => $phone
    ]);
  }

  $error = $stmt->error;
  $stmt->close();

  error_log("Signup error: " . $error);

  sendResponse(false, "Registration failed. Please try again.", 500);
}

// ========================================
// UPDATE CUSTOMER PROFILE
// ========================================

if ($method === "PUT") {

  $id = intval($input["id"] ?? 0);

  $name = trim($input["name"] ?? "");
  $email = strtolower(trim($input["email"] ?? ""));
  $phone = trim($input["phone"] ?? "");

  if ($id <= 0) {
    sendResponse(false, "Customer ID is required.", 400);
  }

  if ($name === "") {
    sendResponse(false, "Please enter your full name.", 422);
  }

  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(false, "Please enter a valid email address.", 422);
  }

  if (!preg_match("/^[6-9][0-9]{9}$/", $phone)) {
    sendResponse(false, "Please enter a valid 10 digit mobile number.", 422);
  }

  // Check customer exists

  $checkUser = $conn->prepare(
    "SELECT id FROM signup WHERE id = ? LIMIT 1"
  );

  $checkUser->bind_param("i", $id);
  $checkUser->execute();
  $checkUser->store_result();

  if ($checkUser->num_rows === 0) {
    $checkUser->close();
    sendResponse(false, "Customer account not found.", 404);
  }

  $checkUser->close();

  // Check duplicate email or phone excluding current customer

  $check = $conn->prepare(
    "SELECT id FROM signup
         WHERE (email = ? OR phone = ?) AND id != ?
         LIMIT 1"
  );

  if (!$check) {
    sendResponse(false, "Database query failed.", 500);
  }

  $check->bind_param("ssi", $email, $phone, $id);
  $check->execute();
  $check->store_result();

  if ($check->num_rows > 0) {
    $check->close();
    sendResponse(false, "Email or mobile number already used.", 409);
  }

  $check->close();

  // Update profile

  $stmt = $conn->prepare(
    "UPDATE signup
         SET name = ?, email = ?, phone = ?
         WHERE id = ?"
  );

  if (!$stmt) {
    sendResponse(false, "Database query failed.", 500);
  }

  $stmt->bind_param("sssi", $name, $email, $phone, $id);

  if ($stmt->execute()) {

    $stmt->close();

    sendResponse(true, "Profile updated successfully!", 200, [
      "id" => $id,
      "name" => $name,
      "email" => $email,
      "phone" => $phone
    ]);
  }

  $stmt->close();

  sendResponse(false, "Profile update failed.", 500);
}

// ========================================
// DELETE CUSTOMER ACCOUNT
// ========================================

if ($method === "DELETE") {

  $id = intval($input["id"] ?? $_GET["id"] ?? 0);

  if ($id <= 0) {
    sendResponse(false, "Customer ID is required.", 400);
  }

  $stmt = $conn->prepare(
    "DELETE FROM signup WHERE id = ?"
  );

  if (!$stmt) {
    sendResponse(false, "Database query failed.", 500);
  }

  $stmt->bind_param("i", $id);

  if ($stmt->execute()) {

    $deleted = $stmt->affected_rows;

    $stmt->close();

    if ($deleted === 0) {
      sendResponse(false, "Customer account not found.", 404);
    }

    sendResponse(true, "Account deleted successfully!", 200);
  }

  $error = $stmt->error;
  $stmt->close();

  error_log("Delete account error: " . $error);

  sendResponse(false, "Unable to delete account.", 500);
}

// ========================================
// INVALID METHOD
// ========================================

sendResponse(false, "Invalid request method.", 405);
