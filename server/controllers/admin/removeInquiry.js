import Question from "../../models/inquiries.js";


const DeleteInquiries = async (req,res) => {
    try {
        const { id } = req.params;
        const inquiry = await Question.findByIdAndDelete(id);

        if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
        }
        res.status(200).json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting inquiry" });
  }
}

export default DeleteInquiries