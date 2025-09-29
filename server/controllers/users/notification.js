import Notification from '../../models/notification.js';

// Create a new notification and emit to user
export const sendNotification = async (userId, message, io) => {
  try {
    const notif = new Notification({ userId, message });
    await notif.save();

    // Emit to user's room
    io.to(userId.toString()).emit('reservationUpdate', notif);

  } catch (err) {
    console.error('Failed to send notification:', err);
  }
};

// Get all notifications for a user
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.userId; // from JWT auth
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { read: true });
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark as read' });
  }
};
