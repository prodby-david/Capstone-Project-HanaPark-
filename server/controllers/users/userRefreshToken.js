import jwt from 'jsonwebtoken';



const UserRefreshTokenController = async(req,res) => {

    try {

      const { userId, role } = req.user;

      const payload = {
          user: userId,
          role: role
      }

      const newUserAccessToken = jwt.sign(payload, process.env.USER_ACCESS_KEY, {expiresIn:'1h'});

      res.cookie('user_token', newUserAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 30 * 60 * 1000,
          sameSite: 'Strict'
      });

      res.status(200).json({message: 'New access token acquired.'});

    } catch (error) {
        console.error("Error refreshing token:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
    
}

export default UserRefreshTokenController;