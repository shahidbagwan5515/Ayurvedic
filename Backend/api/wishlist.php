
<?php

// ==========================================
// WISHLIST API - AYURVEDIC ECOMMERCE
// ==========================================

// CORS CONFIGURATION
$allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174"
];

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
  header("Access-Control-Allow-Origin: " . $origin);
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");
header("Vary: Origin");

// OPTIONS REQUEST
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit;
}

// DATABASE CONNECTION
require_once __DIR__ . "/../config/db.php";

// ==========================================
// JSON RESPONSE
// ==========================================

function sendResponse($success, $message, $data = null, $status = 200)
{
  http_response_code($status);

  echo json_encode([
    "success" => $success,
    "message" => $message,
    "data" => $data
  ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

  exit;
}

// ==========================================
// MAIN API
// ==========================================

try {

  if (!isset($conn) || !($conn instanceof mysqli)) {
    sendResponse(false, "Database connection failed.", null, 500);
  }

  // GUEST TOKEN
  $guestToken = trim($_GET["guest_token"] ?? "");

  if (
    $guestToken === "" ||
    strlen($guestToken) > 100
  ) {
    sendResponse(false, "Valid guest token is required.", null, 400);
  }

  // ======================================
  // GET WISHLIST
  // ======================================

  if ($_SERVER["REQUEST_METHOD"] === "GET") {

    $stmt = $conn->prepare("
            SELECT
                id,
                guest_token,
                product_id,
                product_name,
                sku,
                category,
                description,
                price,
                image,
                in_stock,
                created_at,
                updated_at
            FROM wishlist_items
            WHERE guest_token = ?
            ORDER BY id DESC
        ");

    if (!$stmt) {
      throw new Exception($conn->error);
    }

    $stmt->bind_param("s", $guestToken);
    $stmt->execute();

    $result = $stmt->get_result();

    $items = [];

    while ($row = $result->fetch_assoc()) {

      $items[] = [
        "wishlistId" => (int)$row["id"],
        "id" => (int)$row["product_id"],
        "name" => $row["product_name"],
        "sku" => $row["sku"],
        "category" => $row["category"],
        "description" => $row["description"],
        "price" => (float)$row["price"],
        "image" => $row["image"],
        "inStock" => (bool)$row["in_stock"]
      ];
    }

    $stmt->close();

    sendResponse(
      true,
      "Wishlist fetched successfully.",
      $items
    );
  }

  // ======================================
  // SAVE / UPDATE WISHLIST
  // ======================================

  if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $input = json_decode(
      file_get_contents("php://input"),
      true
    );

    if (!is_array($input)) {
      sendResponse(false, "Invalid JSON request.", null, 400);
    }

    if (
      !isset($input["items"]) ||
      !is_array($input["items"])
    ) {
      sendResponse(
        false,
        "Wishlist items must be an array.",
        null,
        400
      );
    }

    $items = $input["items"];

    // --------------------------------------
    // NORMALIZE AND REMOVE DUPLICATES
    // --------------------------------------

    $uniqueItems = [];

    foreach ($items as $product) {

      if (!is_array($product)) {
        continue;
      }

      $productId = (int)(
        $product["id"] ??
        $product["product_id"] ??
        0
      );

      if ($productId <= 0) {
        continue;
      }

      $uniqueItems[$productId] = [
        "id" => $productId,

        "name" => substr(
          trim($product["name"] ?? $product["product_name"] ?? "Product"),
          0,
          255
        ),

        "sku" => substr(
          trim($product["sku"] ?? ""),
          0,
          100
        ),

        "category" => substr(
          trim($product["category"] ?? ""),
          0,
          150
        ),

        "description" => $product["description"] ?? "",

        "price" => max(
          0,
          (float)($product["price"] ?? 0)
        ),

        "image" => $product["image"] ?? "",

        "in_stock" => !empty($product["inStock"] ?? $product["in_stock"] ?? false) ? 1 : 0
      ];
    }

    // --------------------------------------
    // TRANSACTION
    // --------------------------------------

    $conn->begin_transaction();

    try {

      // Remove previous wishlist for this guest.
      // New complete list will be inserted below.

      $deleteStmt = $conn->prepare("
                DELETE FROM wishlist_items
                WHERE guest_token = ?
            ");

      if (!$deleteStmt) {
        throw new Exception($conn->error);
      }

      $deleteStmt->bind_param("s", $guestToken);
      $deleteStmt->execute();
      $deleteStmt->close();

      // ----------------------------------
      // INSERT WISHLIST PRODUCTS
      // ----------------------------------

      if (count($uniqueItems) > 0) {

        $insertStmt = $conn->prepare("
                    INSERT INTO wishlist_items (
                        guest_token,
                        product_id,
                        product_name,
                        sku,
                        category,
                        description,
                        price,
                        image,
                        in_stock
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");

        if (!$insertStmt) {
          throw new Exception($conn->error);
        }

        foreach ($uniqueItems as $product) {

          $productId = $product["id"];
          $name = $product["name"];
          $sku = $product["sku"];
          $category = $product["category"];
          $description = $product["description"];
          $price = $product["price"];
          $image = $product["image"];
          $inStock = $product["in_stock"];

          $insertStmt->bind_param(
            "sissssdsi",
            $guestToken,
            $productId,
            $name,
            $sku,
            $category,
            $description,
            $price,
            $image,
            $inStock
          );

          $insertStmt->execute();
        }

        $insertStmt->close();
      }

      $conn->commit();

      sendResponse(
        true,
        "Wishlist saved successfully.",
        [
          "guest_token" => $guestToken,
          "total_items" => count($uniqueItems),
          "items" => array_values($uniqueItems)
        ]
      );
    } catch (Throwable $e) {

      $conn->rollback();

      throw $e;
    }
  }

  // ======================================
  // INVALID METHOD
  // ======================================

  sendResponse(
    false,
    "Method not allowed.",
    null,
    405
  );
} catch (Throwable $e) {

  error_log("Wishlist API Error: " . $e->getMessage());

  sendResponse(
    false,
    "Wishlist operation failed: " . $e->getMessage(),
    null,
    500
  );
}

?>
