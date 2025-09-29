import User from "../../models/user.js";
import Vehicle from '../../models/vehicle.js';


const UpdateVehicleController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { vehicleType, brand, model, plateNumber, color, transmission } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access. Please sign in." });
    }

    const user = await User.findById(userId).populate("vehicle");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      user.vehicle._id,
      { vehicleType, brand, model, plateNumber, color, transmission },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully.",
      vehicle: updatedVehicle,
    });
  } catch (err) {
    console.error("UpdateVehicleController Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default UpdateVehicleController;