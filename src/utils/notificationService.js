const NOTIFICATION_API =
  "https://akshayurja.in/ExpensesApp/ShaheedApis/Customer_Notifications.php";

// =====================================
// GET LOGGED-IN USER ID
// =====================================

export const getNotificationUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "null",
    );

    const id = Number(
      localStorage.getItem("user_id") ||
        user?.id ||
        user?.user_id ||
        user?.userId ||
        loggedInUser?.id ||
        loggedInUser?.user_id ||
        loggedInUser?.userId ||
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
} = {}) => {
  const userId = getNotificationUserId();

  if (!userId) {
    console.warn("Notification skipped: User not logged in.");
    return false;
  }

  if (!title?.trim() || !message?.trim()) {
    console.error("Notification title and message required.");
    return false;
  }

  try {
    const payload = {
      action: "create",
      user_id: Number(userId),
      title: title.trim(),
      message: message.trim(),
      type,
    };

    console.log("Notification Request:", payload);

    const response = await fetch(NOTIFICATION_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const raw = await response.text();

    let result;

    try {
      result = JSON.parse(raw);
    } catch {
      throw new Error("Invalid notification API response.");
    }

    console.log("Notification API Result:", result);

    if (!response.ok || result.success !== true) {
      throw new Error(result.message || "Unable to create notification.");
    }

    window.dispatchEvent(new Event("notificationUpdated"));

    console.log("Notification created successfully:", result.data?.id);

    return true;
  } catch (error) {
    console.error("Create Notification Error:", error);

    return false;
  }
};
