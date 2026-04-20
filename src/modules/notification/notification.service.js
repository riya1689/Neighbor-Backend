import prisma from "../../config/prisma.js";

// Helper Utility: Can be imported by Vote, Comment, Follow services
export const createNotification = async (userId, type, message) => {
  return prisma.notification.create({
    data: {
      userId,
      type,
      message,
    }
  });
};

export const getUserNotifications = async (userId) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
};

export const markAsRead = async (userId, notificationId) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId }
  });

  if (!notification) {
    const error = new Error("Notification not found");
    error.statusCode = 404;
    throw error;
  }

  if (notification.userId !== userId) {
    const error = new Error("You do not have permission to update this notification");
    error.statusCode = 403;
    throw error;
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true }
  });
};
