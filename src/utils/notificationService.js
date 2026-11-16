const NOTIFICATION_API =
  "http://localhost/Ayurvedic/ayurvedic-app/Backend/api/create_notification.php";

export const getNotificationUserId = () => {
  try {
    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "null",
    );

    const id = Number(
      localStorage.getItem("user_id") ||
        loggedInUser?.id ||
        loggedInUser?.user_id ||
        loggedInUser?.userId ||
        0,
    );

    return Number.isSafeInteger(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
};

// =====================================
// CREATE CUSTOMER-SPECIFIC NOTIFICATION
// =====================================

export const createNotification = async ({
  title,
  message,
  type = "general",
}) => {
  const userId = getNotificationUserId();

  if (!userId) {
    console.warn("Notification skipped: Customer not logged in.");
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

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Notification creation failed.");
    }

    window.dispatchEvent(new Event("notificationUpdated"));

    return true;
  } catch (error) {
    console.error("Create Notification Error:", error);
    return false;
  }
};
