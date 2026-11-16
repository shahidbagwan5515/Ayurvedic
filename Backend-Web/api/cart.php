<?php

$allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
  header("Access-Control-Allow-Origin: " . $origin);
}

header("Vary: Origin");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit;
}

require_once __DIR__ . "/../config/db.php";

$method = $_SERVER["REQUEST_METHOD"];

$data = json_decode(file_get_contents("php://input"), true) ?? [];

// Replace this with the authenticated user's ID.
// For initial local testing, use a valid existing user ID.
$user_id = isset($data["user_id"])
  ? (int)$data["user_id"]
  : (int)($_GET["user_id"] ?? 0);

if ($user_id <= 0) {
  http_response_code(400);

  echo json_encode([
    "success" => false,
    "message" => "Valid user ID is required"
  ]);

  exit;
}


// ======================================
// GET CART ITEMS
// ======================================

if ($method === "GET") {

  $stmt = $conn->prepare(
    "SELECT id, product_id, name, image, price, quantity
         FROM cart_items
         WHERE user_id = ?
         ORDER BY id DESC"
  );

  $stmt->bind_param("i", $user_id);
  $stmt->execute();

  $result = $stmt->get_result();

  $cart = [];

  while ($row = $result->fetch_assoc()) {
    $row["id"] = (int)$row["id"];
    $row["product_id"] = (int)$row["product_id"];
    $row["price"] = (float)$row["price"];
    $row["quantity"] = (int)$row["quantity"];

    $cart[] = $row;
  }

  echo json_encode([
    "success" => true,
    "cart" => $cart
  ]);

  exit;
}


// ======================================
// ADD PRODUCT TO CART
// ======================================

if ($method === "POST") {

  $product_id = (int)($data["product_id"] ?? 0);
  $name = trim($data["name"] ?? "");
  $image = $data["image"] ?? "";
  $price = (float)($data["price"] ?? 0);
  $quantity = max(1, (int)($data["quantity"] ?? 1));

  if ($product_id <= 0 || $name === "" || $price < 0) {

    http_response_code(400);

    echo json_encode([
      "success" => false,
      "message" => "Invalid product details"
    ]);

    exit;
  }

  $stmt = $conn->prepare(
    "INSERT INTO cart_items
        (user_id, product_id, name, image, price, quantity)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        quantity = quantity + VALUES(quantity),
        name = VALUES(name),
        image = VALUES(image),
        price = VALUES(price)"
  );

  $stmt->bind_param(
    "iissdi",
    $user_id,
    $product_id,
    $name,
    $image,
    $price,
    $quantity
  );

  if ($stmt->execute()) {

    echo json_encode([
      "success" => true,
      "message" => "Product added to cart"
    ]);
  } else {

    http_response_code(500);

    echo json_encode([
      "success" => false,
      "message" => "Unable to add product"
    ]);
  }

  exit;
}


// ======================================
// UPDATE PRODUCT QUANTITY
// ======================================

if ($method === "PUT") {

  $cart_id = (int)($data["id"] ?? 0);
  $quantity = (int)($data["quantity"] ?? 0);

  if ($cart_id <= 0 || $quantity < 1) {

    http_response_code(400);

    echo json_encode([
      "success" => false,
      "message" => "Invalid cart ID or quantity"
    ]);

    exit;
  }

  $stmt = $conn->prepare(
    "UPDATE cart_items
         SET quantity = ?
         WHERE id = ? AND user_id = ?"
  );

  $stmt->bind_param(
    "iii",
    $quantity,
    $cart_id,
    $user_id
  );

  $stmt->execute();

  echo json_encode([
    "success" => true,
    "message" => "Cart quantity updated"
  ]);

  exit;
}


// ======================================
// REMOVE PRODUCT FROM CART
// ======================================

if ($method === "DELETE") {

  $cart_id = (int)($data["id"] ?? 0);

  if ($cart_id <= 0) {

    http_response_code(400);

    echo json_encode([
      "success" => false,
      "message" => "Invalid cart ID"
    ]);

    exit;
  }

  $stmt = $conn->prepare(
    "DELETE FROM cart_items
         WHERE id = ? AND user_id = ?"
  );

  $stmt->bind_param(
    "ii",
    $cart_id,
    $user_id
  );

  $stmt->execute();

  echo json_encode([
    "success" => true,
    "message" => "Product removed from cart"
  ]);

  exit;
}


// ======================================
// INVALID METHOD
// ======================================

http_response_code(405);

echo json_encode([
  "success" => false,
  "message" => "Method not allowed"
]);
