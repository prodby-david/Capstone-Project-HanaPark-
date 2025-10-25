import Question from "../../models/question.js";


const GetUserInquiries = async (req,res) => {
    try {
        const getInquiries = await Question.find();
        res.status(200).json(getInquiries);
        
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving user inquiries.' });
    }
}

export default GetUserInquiries;