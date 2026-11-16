
<?php

// ==========================================
// WISHLIST API - CUSTOMER WISE
// ==========================================

// CORS
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

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit;
}

require_once __DIR__ . "/../config/db.php";

// ==========================================
// RESPONSE
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

  $method = $_SERVER["REQUEST_METHOD"];

  if (!in_array($method, ["GET", "POST"], true)) {
    sendResponse(false, "Method not allowed.", null, 405);
  }

  // ======================================
  // GET REQUEST DATA
  // ======================================

  if ($method === "GET") {

    $userId = filter_var(
      $_GET["user_id"] ?? null,
      FILTER_VALIDATE_INT
    );
  } else {

    $input = json_decode(file_get_contents("php://input"), true);

    if (!is_array($input)) {
      sendResponse(false, "Invalid JSON request.", null, 400);
    }

    $userId = filter_var(
      $input["user_id"] ?? null,
      FILTER_VALIDATE_INT
    );
  }

  // ======================================
  // USER VALIDATION
  // ======================================

  if (!$userId || $userId <= 0) {
    sendResponse(
      false,
      "Please login to access your wishlist.",
      null,
      401
    );
  }

  // ======================================
  // GET CUSTOMER WISHLIST
  // ======================================

  if ($method === "GET") {

    $stmt = $conn->prepare("
            SELECT
                id,
                product_id,
                product_name,
                sku,
                category,
                description,
                price,
                image,
                in_stock
            FROM wishlist_items
            WHERE user_id = ?
            ORDER BY id DESC
        ");

    if (!$stmt) {
      throw new Exception($conn->error);
    }

    $stmt->bind_param("i", $userId);
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
      "Customer wishlist fetched successfully.",
      $items
    );
  }

  // ======================================
  // SAVE CUSTOMER WISHLIST
  // ======================================

  if ($method === "POST") {

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

    $uniqueItems = [];

    foreach ($input["items"] as $product) {

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

        "description" => (string)($product["description"] ?? ""),

        "price" => max(
          0,
          (float)($product["price"] ?? 0)
        ),

        "image" => (string)($product["image"] ?? ""),

        "in_stock" => !empty($product["inStock"] ?? $product["in_stock"] ?? false) ? 1 : 0
      ];
    }

    // ==================================
    // TRANSACTION
    // ==================================

    $conn->begin_transaction();

    try {

      // Delete ONLY current customer's wishlist

      $deleteStmt = $conn->prepare("
                DELETE FROM wishlist_items
                WHERE user_id = ?
            ");

      if (!$deleteStmt) {
        throw new Exception($conn->error);
      }

      $deleteStmt->bind_param("i", $userId);
      $deleteStmt->execute();
      $deleteStmt->close();

      // ==================================
      // INSERT CURRENT CUSTOMER PRODUCTS
      // ==================================

      if (!empty($uniqueItems)) {

        $insertStmt = $conn->prepare("
                    INSERT INTO wishlist_items (
                        user_id,
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
                    VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?)
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
            "iissssdsi",
            $userId,
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
          "user_id" => $userId,
          "total_items" => count($uniqueItems),
          "items" => array_values($uniqueItems)
        ]
      );
    } catch (Throwable $e) {

      $conn->rollback();

      throw $e;
    }
  }
} catch (Throwable $e) {

  error_log("Wishlist API Error: " . $e->getMessage());

  sendResponse(
    false,
    "Wishlist operation failed.",
    null,
    500
  );
}

?>
