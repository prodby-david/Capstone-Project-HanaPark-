import Question from "../../models/question.js"
import validator from 'validator'


const createQuestion = async(req,res) => {
    try {
        const {name, subject, email, message} = req.body;

        if(!name || !subject || !email || !message){
            return res.status(404).json({message: 'Fields must not be empty.'});
        }

        if(!validator.isEmail(email) || !email.endsWith('@gmail.com')){
            return res.status(400).json({ message: "Please use a valid Gmail address" });
        }

        const userQuestion = new Question({name, subject, email, message});
        await userQuestion.save();   
        
    } catch (err) {
        return res.status(500).json({message: 'Server Error. Please try again.'})
    }
}

export default createQuestion;