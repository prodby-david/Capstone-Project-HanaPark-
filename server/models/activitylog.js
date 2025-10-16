
import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reservation",
    required: true,
  },
  reservedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  slotCode: {
    type: String,
    required: true,
  },
  vehicleType: {
    type:String,
  },
  status: {
    type: String,
    enum: ['Pending', 'Reserved', 'Cancelled', 'Completed'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Activity = mongoose.model('Activity', activityLogSchema)

export default Activity;
