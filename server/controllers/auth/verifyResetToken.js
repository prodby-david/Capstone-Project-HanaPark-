import jwt from 'jsonwebtoken';

const VerifyResetToken = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.FORGOT_PASSWORD_KEY);
    res.status(200).json({ email: decoded.email });
  } catch (err) {
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }
}
export default VerifyResetToken;