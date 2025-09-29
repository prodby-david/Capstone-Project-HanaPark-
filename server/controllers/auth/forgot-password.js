import User from "../../models/user.js"
import jwt from 'jsonwebtoken';
import sendResetEmail from "../../utils/sendEmail.js";

const ForgotPasswordController =  async (req,res) => {

    try {
         const { email } = req.body;

            const user = await User.findOne({ email });

            if(!user) {
                return res.status(404).json({ message: "The given email doesn't exist." });
            }

           const token = jwt.sign({ id:user._id, email: user.email}, process.env.FORGOT_PASSWORD_KEY, { expiresIn: '15m' });


            const resetLink = `http://localhost:5173/reset-password/${token}`;

            const html = `
                <h3>Password Reset</h3>
                <p>Click the link below to reset your password. It will expire in 15 minutes.</p>
                <a href="${resetLink}">Reset Password</a>
            `;

        await sendResetEmail(user.email, 'Password Reset', html);

        res.status(200).json({ message: 'Reset link sent to your email' });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
   

}

export default ForgotPasswordController;