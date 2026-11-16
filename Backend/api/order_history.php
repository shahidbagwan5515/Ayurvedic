
<?php
// =============================================
// ORDER HISTORY API
// Customer-wise order history with products
// =============================================

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit;
}

require_once __DIR__ . "/../config/db.php";

// JSON response helper
function sendResponse($success, $message, $data = null, $statusCode = 200)
{
  http_response_code($statusCode);

  echo json_encode([
    "success" => $success,
    "message" => $message,
    "data" => $data
  ]);

  exit;
}

try {

  // Only GET allowed
  if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    sendResponse(false, "Method not allowed", null, 405);
  }

  // Get logged-in customer ID
  $userId = isset($_GET["user_id"])
    ? (int) $_GET["user_id"]
    : 0;

  if ($userId <= 0) {
    sendResponse(false, "Valid user_id is required", null, 400);
  }

  // =============================================
  // FETCH CUSTOMER ORDERS
  // =============================================

  $sql = "
        SELECT
            id,
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
            created_at
        FROM orders_history
        WHERE user_id = ?
        ORDER BY id DESC
    ";

  $stmt = $conn->prepare($sql);

  if (!$stmt) {
    throw new Exception("Order query error: " . $conn->error);
  }

  $stmt->bind_param("i", $userId);
  $stmt->execute();

  $result = $stmt->get_result();

  $orders = [];

  // =============================================
  // FETCH PRODUCTS FOR EACH ORDER
  // =============================================

  while ($order = $result->fetch_assoc()) {

    $orderId = (int) $order["id"];

    /*
         * IMPORTANT:
         * These columns match place_order.php:
         * product_image, price, total
         */

    $productSql = "
            SELECT
                id,
                product_id,
                product_name,
                product_image,
                price,
                quantity,
                total
            FROM order_items
            WHERE order_id = ?
            ORDER BY id ASC
        ";

    $productStmt = $conn->prepare($productSql);

    if (!$productStmt) {
      throw new Exception(
        "Order products query error: " . $conn->error
      );
    }

    $productStmt->bind_param("i", $orderId);
    $productStmt->execute();

    $productResult = $productStmt->get_result();

    $products = [];

    while ($item = $productResult->fetch_assoc()) {

      $products[] = [
        "id" => (int) $item["id"],

        "productId" => $item["product_id"] !== null
          ? (int) $item["product_id"]
          : null,

        "name" => $item["product_name"],

        "sku" => "",

        "image" => $item["product_image"] ?? "",

        "quantity" => (int) $item["quantity"],

        "price" => (float) $item["price"],

        "total" => (float) $item["total"]
      ];
    }

    $productStmt->close();

    // =============================================
    // FORMAT ORDER DATA FOR REACT
    // =============================================

    $orders[] = [
      "id" => (int) $order["id"],

      "orderNumber" => $order["order_number"],

      "date" => $order["created_at"],

      "status" => $order["order_status"],

      "payment" => $order["payment_status"],

      "paymentMethod" => $order["payment_method"],

      "subtotal" => (float) $order["subtotal"],

      "discount" => (float) $order["discount"],

      "couponCode" => $order["coupon_code"],

      "delivery" => (float) $order["delivery_amount"],

      "gst" => (float) $order["gst"],

      "total" => (float) $order["grand_total"],

      "products" => $products
    ];
  }

  $stmt->close();

  // =============================================
  // SUCCESS RESPONSE
  // =============================================

  sendResponse(
    true,
    "Order history fetched successfully",
    $orders
  );
} catch (Throwable $e) {

  error_log("Order History API Error: " . $e->getMessage());

  sendResponse(
    false,
    "Unable to fetch order products.",
    [
      "debug" => $e->getMessage()
    ],
    500
  );
}
?>
