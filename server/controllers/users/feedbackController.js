import Feedback from "../../models/feedback.js";

const createFeedback = async (req, res) => {
  try {

    const { rating, message } = req.body;
    const userId  = req.user.userId

    if(!userId){
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    if (!rating || !message) {
      return res.status(400).json({ message: "Rating and message are required." });
    }

     const user = await User.findById(userId).select("firstname lastname");
      const name = `${user.firstname} ${user.lastname}`;

    const newFeedback = new Feedback({
      userId,
      name,
      rating,
      message,
    });

    await newFeedback.save();
    res.status(201).json({ message: "Feedback submitted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export default createFeedback;

