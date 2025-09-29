import Notification from "../../models/notification.js";

const GetUserNotification = async (req,res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.json({ notifications });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch notifications', error: err.message });
    }

}


export default GetUserNotification;