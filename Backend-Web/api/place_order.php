
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
// RESPONSE
// =====================================

function sendResponse($success, $message, $extra = [], $status = 200)
{
  http_response_code($status);

  echo json_encode(
    array_merge([
      "success" => $success,
      "message" => $message
    ], $extra),
    JSON_UNESCAPED_UNICODE
  );

  exit;
}


// =====================================
// METHOD CHECK
// =====================================

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  sendResponse(false, "Method not allowed", [], 405);
}

if (!isset($conn) || !($conn instanceof mysqli)) {
  sendResponse(false, "Database connection failed", [], 500);
}


// =====================================
// REQUEST DATA
// =====================================

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
  sendResponse(false, "Invalid JSON request", [], 400);
}

$user_id = (int)($data["user_id"] ?? 0);

$delivery = $data["delivery_address"] ?? [];
$billing = $data["billing_address"] ?? [];

$coupon_code = strtoupper(
  trim((string)($data["coupon_code"] ?? ""))
);

if ($user_id <= 0) {
  sendResponse(false, "Please login first", [], 400);
}


// =====================================
// ADDRESS VALIDATION
// =====================================

function validateAddress($address)
{
  $required = [
    "name",
    "phone",
    "address",
    "city",
    "state",
    "pincode"
  ];

  if (!is_array($address)) {
    return false;
  }

  foreach ($required as $field) {
    if (
      !isset($address[$field]) ||
      trim((string)$address[$field]) === ""
    ) {
      return false;
    }
  }

  if (!preg_match('/^[0-9]{6}$/', (string)$address["pincode"])) {
    return false;
  }

  return true;
}

if (
  !validateAddress($delivery) ||
  !validateAddress($billing)
) {
  sendResponse(
    false,
    "Please provide valid delivery and billing addresses",
    [],
    400
  );
}


// =====================================
// CREATE ORDER TRANSACTION
// =====================================

$transactionStarted = false;

try {

  $conn->begin_transaction();

  $transactionStarted = true;


  // =====================================
  // GET CUSTOMER CART
  // =====================================

  $stmt = $conn->prepare(
    "SELECT
            id,
            product_id,
            name,
            image,
            price,
            quantity
         FROM cart_items
         WHERE user_id = ?
         ORDER BY id ASC
         FOR UPDATE"
  );

  if (!$stmt) {
    throw new Exception(
      "Cart query preparation failed: " . $conn->error
    );
  }

  $stmt->bind_param("i", $user_id);

  $stmt->execute();

  $result = $stmt->get_result();

  $cart = [];
  $subtotal = 0;

  while ($row = $result->fetch_assoc()) {

    $product_id = (int)$row["product_id"];
    $price = (float)$row["price"];
    $quantity = (int)$row["quantity"];

    if (
      $product_id <= 0 ||
      $quantity < 1 ||
      $price < 0
    ) {
      throw new Exception("Invalid product in cart");
    }

    $row["product_id"] = $product_id;
    $row["price"] = $price;
    $row["quantity"] = $quantity;

    $subtotal += $price * $quantity;

    $cart[] = $row;
  }

  $stmt->close();

  if (count($cart) === 0) {
    throw new Exception("Your cart is empty");
  }

  $subtotal = round($subtotal, 2);


  // =====================================
  // LIVE STOCK VALIDATION + UPDATE
  // BOTH TABLES:
  // products.stock
  // stocks.quantity
  // =====================================

  $stockUpdates = [];

  foreach ($cart as $item) {

    $productId = (int)$item["product_id"];
    $orderedQty = (int)$item["quantity"];


    // ---------------------------------
    // GET CUSTOMER PRODUCT
    // ---------------------------------

    $productStmt = $conn->prepare(
      "SELECT
                id,
                name,
                sku,
                stock
             FROM products
             WHERE id = ?
             LIMIT 1
             FOR UPDATE"
    );

    if (!$productStmt) {
      throw new Exception(
        "Product query failed: " . $conn->error
      );
    }

    $productStmt->bind_param("i", $productId);

    $productStmt->execute();

    $product = $productStmt
      ->get_result()
      ->fetch_assoc();

    $productStmt->close();

    if (!$product) {
      throw new Exception(
        "Product not found for cart product ID: " . $productId
      );
    }


    $productName = trim((string)$product["name"]);
    $sku = trim((string)($product["sku"] ?? ""));

    $productAvailable = (int)$product["stock"];


    // ---------------------------------
    // FIND ADMIN STOCK
    // FIRST MATCH SKU
    // THEN MATCH PRODUCT NAME
    // ---------------------------------

    $stockStmt = $conn->prepare(
      "SELECT
                id,
                product_name,
                product_code,
                quantity
             FROM stocks
             WHERE
                (
                    ? != ''
                    AND TRIM(product_code) = ?
                )
                OR LOWER(TRIM(product_name)) = LOWER(?)
             ORDER BY
                CASE
                    WHEN ? != ''
                    AND TRIM(product_code) = ?
                    THEN 0
                    ELSE 1
                END
             LIMIT 1
             FOR UPDATE"
    );

    if (!$stockStmt) {
      throw new Exception(
        "Stock query failed: " . $conn->error
      );
    }

    $stockStmt->bind_param(
      "sssss",
      $sku,
      $sku,
      $productName,
      $sku,
      $sku
    );

    $stockStmt->execute();

    $stock = $stockStmt
      ->get_result()
      ->fetch_assoc();

    $stockStmt->close();


    // ---------------------------------
    // STOCK NOT FOUND
    // ---------------------------------

    if (!$stock) {
      throw new Exception(
        "Stock record not found for " .
          $productName .
          ". SKU: " .
          ($sku ?: "Not Available")
      );
    }


    // ---------------------------------
    // CHECK AVAILABLE STOCK
    // ---------------------------------

    $stockId = (int)$stock["id"];

    $stockAvailable = (int)$stock["quantity"];

    if (
      $productAvailable < $orderedQty ||
      $stockAvailable < $orderedQty
    ) {

      $available = min(
        $productAvailable,
        $stockAvailable
      );

      throw new Exception(
        "Insufficient stock for " .
          $productName .
          ". Available quantity: " .
          $available
      );
    }


    // ---------------------------------
    // UPDATE PRODUCTS TABLE
    // ---------------------------------

    $updateProduct = $conn->prepare(
      "UPDATE products
             SET stock = stock - ?
             WHERE id = ?
             AND stock >= ?"
    );

    if (!$updateProduct) {
      throw new Exception(
        "Product stock update failed: " . $conn->error
      );
    }

    $updateProduct->bind_param(
      "iii",
      $orderedQty,
      $productId,
      $orderedQty
    );

    if (!$updateProduct->execute()) {
      throw new Exception(
        "Product stock update error: " . $updateProduct->error
      );
    }

    if ($updateProduct->affected_rows !== 1) {
      $updateProduct->close();

      throw new Exception(
        "Unable to decrease product stock for " . $productName
      );
    }

    $updateProduct->close();


    // ---------------------------------
    // UPDATE ADMIN STOCK TABLE
    // ---------------------------------

    $updateStock = $conn->prepare(
      "UPDATE stocks
             SET quantity = quantity - ?
             WHERE id = ?
             AND quantity >= ?"
    );

    if (!$updateStock) {
      throw new Exception(
        "Admin stock update failed: " . $conn->error
      );
    }

    $updateStock->bind_param(
      "iii",
      $orderedQty,
      $stockId,
      $orderedQty
    );

    if (!$updateStock->execute()) {
      throw new Exception(
        "Admin stock update error: " . $updateStock->error
      );
    }

    if ($updateStock->affected_rows !== 1) {
      $updateStock->close();

      throw new Exception(
        "Unable to decrease admin stock for " . $productName
      );
    }

    $updateStock->close();


    // ---------------------------------
    // SAVE STOCK UPDATE DETAILS
    // ---------------------------------

    $stockUpdates[] = [
      "product_id" => $productId,
      "product_name" => $productName,
      "stock_id" => $stockId,
      "ordered_quantity" => $orderedQty,
      "remaining_product_stock" => $productAvailable - $orderedQty,
      "remaining_admin_stock" => $stockAvailable - $orderedQty
    ];
  }


  // =====================================
  // CALCULATE DISCOUNT AND GST
  // =====================================

  $discount = 0;

  if ($coupon_code !== "") {

    if ($coupon_code === "AYUR10") {
      $discount = round($subtotal * 0.10, 2);
    } else {
      throw new Exception("Invalid discount coupon");
    }
  }

  $taxableAmount = max(0, $subtotal - $discount);

  $deliveryAmount = 0;

  $gst = round($taxableAmount * 0.05, 2);

  $grandTotal = round(
    $taxableAmount + $deliveryAmount + $gst,
    2
  );


  // =====================================
  // CREATE ORDER NUMBER
  // =====================================

  $order_number = "AYU-" .
    date("Ymd") .
    "-" .
    strtoupper(bin2hex(random_bytes(4)));

  $payment_method = "Pending";
  $payment_status = "Pending";
  $order_status = "Pending";

  $coupon_value = $coupon_code !== ""
    ? $coupon_code
    : null;


  // =====================================
  // INSERT ORDER HISTORY
  // =====================================

  $stmt = $conn->prepare(
    "INSERT INTO orders_history (
            order_number,
            user_id,
            subtotal,
            discount,
            coupon_code,
            delivery_amount,
            gst,
            grand_total,
            payment_method,
            payment_status,
            order_status,
            delivery_name,
            delivery_phone,
            delivery_address,
            delivery_city,
            delivery_state,
            delivery_pincode,
            billing_name,
            billing_phone,
            billing_address,
            billing_city,
            billing_state,
            billing_pincode
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?
        )"
  );

  if (!$stmt) {
    throw new Exception(
      "Order query preparation failed: " . $conn->error
    );
  }

  $stmt->bind_param(
    "siddsdddsssssssssssssss",
    $order_number,
    $user_id,
    $subtotal,
    $discount,
    $coupon_value,
    $deliveryAmount,
    $gst,
    $grandTotal,
    $payment_method,
    $payment_status,
    $order_status,
    $delivery["name"],
    $delivery["phone"],
    $delivery["address"],
    $delivery["city"],
    $delivery["state"],
    $delivery["pincode"],
    $billing["name"],
    $billing["phone"],
    $billing["address"],
    $billing["city"],
    $billing["state"],
    $billing["pincode"]
  );

  if (!$stmt->execute()) {
    throw new Exception(
      "Order insert failed: " . $stmt->error
    );
  }

  $order_id = (int)$conn->insert_id;

  $stmt->close();


  // =====================================
  // INSERT ORDER ITEMS
  // =====================================

  $itemStmt = $conn->prepare(
    "INSERT INTO order_items (
            order_id,
            product_id,
            product_name,
            product_image,
            price,
            quantity,
            total
        ) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );

  if (!$itemStmt) {
    throw new Exception(
      "Order items query preparation failed: " . $conn->error
    );
  }

  foreach ($cart as $item) {

    $product_id = (int)$item["product_id"];
    $product_name = (string)$item["name"];
    $product_image = (string)($item["image"] ?? "");
    $price = (float)$item["price"];
    $quantity = (int)$item["quantity"];
    $total = round($price * $quantity, 2);

    $itemStmt->bind_param(
      "iissdid",
      $order_id,
      $product_id,
      $product_name,
      $product_image,
      $price,
      $quantity,
      $total
    );

    if (!$itemStmt->execute()) {
      throw new Exception(
        "Order product insert failed: " . $itemStmt->error
      );
    }
  }

  $itemStmt->close();


  // =====================================
  // CLEAR ONLY THIS USER'S CART
  // =====================================

  $deleteStmt = $conn->prepare(
    "DELETE FROM cart_items WHERE user_id = ?"
  );

  if (!$deleteStmt) {
    throw new Exception(
      "Cart delete preparation failed: " . $conn->error
    );
  }

  $deleteStmt->bind_param("i", $user_id);

  if (!$deleteStmt->execute()) {
    throw new Exception("Unable to clear customer cart");
  }

  $deletedCartItems = $deleteStmt->affected_rows;

  $deleteStmt->close();


  // =====================================
  // COMMIT TRANSACTION
  // =====================================

  $conn->commit();

  $transactionStarted = false;


  // =====================================
  // SUCCESS RESPONSE
  // =====================================

  sendResponse(
    true,
    "Order created successfully and stock updated",
    [
      "order_id" => $order_id,
      "order_number" => $order_number,

      "payment_method" => $payment_method,
      "payment_status" => $payment_status,
      "order_status" => $order_status,

      "subtotal" => $subtotal,
      "discount" => $discount,
      "delivery_amount" => $deliveryAmount,
      "gst" => $gst,
      "grand_total" => $grandTotal,

      "cart_cleared" => true,
      "deleted_cart_items" => $deletedCartItems,

      "stock_updated" => true,
      "stock_updates" => $stockUpdates
    ]
  );
} catch (Throwable $e) {


  // =====================================
  // ROLLBACK
  // =====================================

  if ($transactionStarted) {
    $conn->rollback();
  }

  error_log(
    "Place Order Error: " . $e->getMessage()
  );

  $message = $e->getMessage();

  $knownErrors = [
    "Your cart is empty",
    "Invalid product in cart",
    "Invalid discount coupon"
  ];

  $isKnownError = in_array(
    $message,
    $knownErrors,
    true
  );

  $isStockError =
    strpos($message, "Insufficient stock for") === 0 ||
    strpos($message, "Stock record not found for") === 0 ||
    strpos($message, "Product not found") === 0;

  if (!$isKnownError && !$isStockError) {
    $message = "Unable to place order. Please try again.";
  }

  sendResponse(
    false,
    $message,
    [
      "debug" => $e->getMessage()
    ],
    500
  );
}

?>
