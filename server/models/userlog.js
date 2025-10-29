import mongoose from "mongoose";

const userLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  }, { timestamps: true });

const UserLog = mongoose.model("UserLog", userLogSchema);


export default UserLog;
