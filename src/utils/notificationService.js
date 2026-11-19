const NOTIFICATION_API =
  "http://localhost/Ayurvedic/ayurvedic-app/Backend-Web/api/create_notification.php";

// =====================================
// GET CURRENT LOGGED-IN CUSTOMER ID
// =====================================

export const getNotificationUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "null",
    );

    // Prefer current user object; fallback to stored ID
    const id = Number(
      user?.id ||
        user?.user_id ||
        user?.userId ||
        loggedInUser?.id ||
        loggedInUser?.user_id ||
        loggedInUser?.userId ||
        localStorage.getItem("user_id") ||
        0,
    );

    return Number.isSafeInteger(id) && id > 0 ? id : null;
  } catch (error) {
    console.error("Notification User ID Error:", error);
    return null;
  }
};

// =====================================
// CREATE NOTIFICATION
// =====================================

export const createNotification = async ({
  title,
  message,
  type = "general",
}) => {
  const userId = getNotificationUserId();

  if (!userId) {
    console.warn("Notification skipped: Customer is not logged in.");
    return false;
  }

  if (!title || !message) {
    console.error("Notification title and message are required.");
    return false;
  }

  try {
    const response = await fetch(NOTIFICATION_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        title,
        message,
        type,
      }),
    });

    const raw = await response.text();

    let result;

    try {
      result = JSON.parse(raw);
    } catch {
      throw new Error("Invalid API response: " + raw.substring(0, 300));
    }

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Notification creation failed.");
    }

    // Update notification components
    window.dispatchEvent(new Event("notificationUpdated"));

    console.log("Notification successfully created for customer:", userId);

    return true;
  } catch (error) {
    console.error("Create Notification Error:", error);
    return false;
  }
};
