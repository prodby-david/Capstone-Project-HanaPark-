import User from "../../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

const studentSignInController = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Username not found. Try again." });
    }

    if (user.isLocked && user.lockUntil && user.lockUntil > Date.now()) {
      const remaining = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(403).json({ message: `Account locked. Try again in ${remaining} minutes.` });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      if (user.failedLoginAttempts >= MAX_ATTEMPTS) {
        user.isLocked = true;
        user.lockUntil = new Date(Date.now() + LOCK_TIME);
        await user.save();

        return res.status(403).json({
          message:
            "Account locked due to too many failed attempts. Try again after 15 minutes.",
        });
      }

      await user.save();
      return res.status(400).json({
        message: `Invalid password. ${
          MAX_ATTEMPTS - user.failedLoginAttempts
        } attempts left.`,
      });
    }

    user.failedLoginAttempts = 0;
    user.isLocked = false;
    user.lockUntil = null;

    const payload = {
      userId: user._id,
      role: "user",
      userType: user.userType,
    };

    const user_token = jwt.sign(payload, process.env.USER_ACCESS_KEY, {
      expiresIn: "1h",
    });
    user.currentToken = user_token;
    await user.save();

    const user_refresh_token = jwt.sign(payload, process.env.USER_REFRESH_KEY, {
      expiresIn: "7d",
    });

    res.cookie("user_token", user_token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 1000,
      sameSite: "None",
    });

    res.cookie("user_refresh_token", user_refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Sign in successful",
      success: true,
      user: {
        firstname: user.firstname,
        userType: user.userType,
        userId: user._id,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default studentSignInController;
