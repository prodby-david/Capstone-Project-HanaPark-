
import Feedback from "../../models/feedback.js";

const GetAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (err) {
    console.error("Error fetching feedbacks:", err);
    res.status(500).json({ message: "Failed to fetch feedbacks" });
  }
};

export default GetAllFeedbacks;
