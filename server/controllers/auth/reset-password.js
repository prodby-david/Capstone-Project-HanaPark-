import jwt from 'jsonwebtoken';
import User from '../../models/user.js';

const ResetPasswordController = async (req, res) => {

  const { token } = req.params;
  const { password } = req.body;

  try {

    const decoded = jwt.verify(token, process.env.FORGOT_PASSWORD_KEY);
    console.log("Decoded token:", decoded);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.password = password;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }
};

export default ResetPasswordController;
