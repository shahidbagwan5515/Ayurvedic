
<?php

// =====================================
// CORS
// =====================================

$allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
  header("Access-Control-Allow-Origin: " . $origin);
}

header("Vary: Origin");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit;
}

require_once __DIR__ . "/../config/db.php";

// =====================================
// RESPONSE HELPER
// =====================================

function response($success, $message, $extra = [], $status = 200)
{
  http_response_code($status);

  echo json_encode(array_merge([
    "success" => $success,
    "message" => $message
  ], $extra));

  exit;
}

// =====================================
// DATABASE CHECK
// =====================================

if (!isset($conn) || !($conn instanceof mysqli)) {
  response(false, "Database connection failed", [], 500);
}

// =====================================
// METHOD CHECK
// =====================================

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  response(false, "Method not allowed", [], 405);
}

// =====================================
// READ JSON
// =====================================

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
  response(false, "Invalid request data", [], 400);
}

$order_id = (int)($data["order_id"] ?? 0);
$user_id = (int)($data["user_id"] ?? 0);

$payment_method = strtolower(
  trim($data["payment_method"] ?? "")
);

// =====================================
// VALIDATE INPUT
// =====================================

if ($order_id <= 0 || $user_id <= 0) {
  response(false, "Valid order ID and user ID are required", [], 400);
}

$allowedMethods = [
  "upi",
  "card",
  "netbanking",
  "cod"
];

if (!in_array($payment_method, $allowedMethods, true)) {
  response(false, "Invalid payment method", [], 400);
}

// =====================================
// FIND ORDER IN orders_history
// IMPORTANT: NOT orders
// =====================================

try {

  $conn->begin_transaction();

  $stmt = $conn->prepare(
    "SELECT
            id,
            order_number,
            user_id,
            grand_total,
            payment_method,
            payment_status,
            order_status
         FROM orders_history
         WHERE id = ? AND user_id = ?
         LIMIT 1
         FOR UPDATE"
  );

  if (!$stmt) {
    throw new Exception("Order query preparation failed");
  }

  $stmt->bind_param("ii", $order_id, $user_id);

  if (!$stmt->execute()) {
    throw new Exception("Unable to find order");
  }

  $result = $stmt->get_result();
  $order = $result->fetch_assoc();

  $stmt->close();

  if (!$order) {
    $conn->rollback();

    response(false, "Order not found for this customer", [], 404);
  }

  // =====================================
  // PREVENT REPEATED PAYMENT
  // =====================================

  if (strtolower($order["payment_status"]) === "paid") {
    $conn->rollback();

    response(false, "This order is already paid", [], 409);
  }

  // =====================================
  // SET PAYMENT STATUS
  // =====================================

  if ($payment_method === "cod") {

    // COD: order confirmed, payment collected on delivery
    $paymentStatus = "Pending";
    $orderStatus = "Processing";
  } else {

    // Online payment: pending until gateway verification
    $paymentStatus = "Pending";
    $orderStatus = "Pending";
  }

  // =====================================
  // UPDATE orders_history
  // =====================================

  $updateStmt = $conn->prepare(
    "UPDATE orders_history
         SET
            payment_method = ?,
            payment_status = ?,
            order_status = ?
         WHERE id = ? AND user_id = ?"
  );

  if (!$updateStmt) {
    throw new Exception("Payment update query preparation failed");
  }

  $updateStmt->bind_param(
    "sssii",
    $payment_method,
    $paymentStatus,
    $orderStatus,
    $order_id,
    $user_id
  );

  if (!$updateStmt->execute()) {
    throw new Exception("Unable to update payment details");
  }

  $updateStmt->close();

  // =====================================
  // COMMIT
  // =====================================

  $conn->commit();

  // =====================================
  // RESPONSE DATA
  // =====================================

  $responseData = [
    "order_id" => (int)$order["id"],
    "order_number" => $order["order_number"],
    "grand_total" => (float)$order["grand_total"],
    "payment_method" => $payment_method,
    "payment_status" => $paymentStatus,
    "order_status" => $orderStatus
  ];

  // =====================================
  // COD RESPONSE
  // =====================================

  if ($payment_method === "cod") {

    response(
      true,
      "Cash on Delivery order confirmed successfully",
      $responseData
    );
  }

  // =====================================
  // ONLINE PAYMENT RESPONSE
  // =====================================

  $responseData["gateway_required"] = true;

  response(
    true,
    "Payment method saved. Online payment is pending gateway verification.",
    $responseData
  );
} catch (Throwable $e) {

  if ($conn->errno === 0) {
    // No additional action required here.
  }

  try {
    $conn->rollback();
  } catch (Throwable $rollbackError) {
    error_log("Payment rollback error: " . $rollbackError->getMessage());
  }

  error_log("Payment API Error: " . $e->getMessage());

  response(
    false,
    "Unable to process payment. Please try again.",
    [],
    500
  );
}

?>
