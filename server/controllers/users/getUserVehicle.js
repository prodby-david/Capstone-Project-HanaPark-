import User from "../../models/user.js";


const GetUserVehicleController = async (req, res) => {
    try {

        const userId = req.user.userId;

        if(!userId){
            return res.status(401).json({ message: "Unauthorized access. Please sign in." });
        }

        const user = await User.findById(userId).populate('vehicle');

        if (!user) {
        return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({ vehicle: user.vehicle });
       
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export default GetUserVehicleController;