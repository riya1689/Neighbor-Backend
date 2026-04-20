import * as notificationService from "./notification.service.js";

export const getInbox = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notifications = await notificationService.getUserNotifications(userId);

    const unread = notifications.filter((n) => !n.isRead);
    const read = notifications.filter((n) => n.isRead);

    // Ensure the response clearly distinguishes between read and unread notifications
    res.status(200).json({
      unread,
      read,
      all: notifications
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const notification = await notificationService.markAsRead(userId, notificationId);

    res.status(200).json({
      message: "Notification marked as read successfully",
      notification
    });
  } catch (error) {
    next(error);
  }
};
