import Notification from '../../models/notification.js';


export const sendNotification = async (userId, message, io) => {
  try {
    const notif = new Notification({ userId, message });
    await notif.save();

    io.to(userId.toString()).emit('reservationUpdate', notif);

  } catch (err) {
    console.error('Failed to send notification:', err);
  }
};


export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { read: true });
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark as read' });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.userId, read: false },
      { $set: { read: true } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark all as read' });
  }
};

