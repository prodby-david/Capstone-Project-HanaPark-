import React, { useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { MapPinIcon, ClockIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { container, fadeUp } from "../../lib/motionConfigs";
import UserHeader from "../../components/headers/userHeader";
import UserFooter from "../../components/footers/userFooter";
import { socket } from "../../lib/socket";
import Swal from "sweetalert2";
import FeedbackWidget from "../../components/widget/feedback";

const Dashboard = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("slotCreated", (newSlot) => {
      if (newSlot.slotUser !== "Visitor") {
        Swal.fire({
          title: "🚗 New Slot Available!",
          text: `A new ${newSlot.slotUser} slot (${newSlot.slotNumber}) has been added.`,
          icon: "info",
          confirmButtonColor: "#3366CC",
        }).then((result) => {
          if (result.isConfirmed) navigate("/spots");
        });
      }
    });
  }, [navigate]);

  return (
    <>
      <div className="min-h-screen flex flex-col justify-between">
        <UserHeader />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center mt-12 md:mt-10 px-6 text-center"
        >
          <h2 className="text-[28px] lg:text-[36px] font-bold text-color">
            Welcome back,{" "}
            <span className="text-color-3">{auth.user.firstname}!</span>
          </h2>
          <p className="text-sm text-color-2 mt-3 max-w-2xl">
            Manage your parking effortlessly — reserve slots, view your recent
            activities, and keep your account up to date.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mt-10 px-6 pb-12"
        >
          <motion.div
            variants={fadeUp}
            whileHover={{ scale: 1.05 }}
            className="bg-white/90 backdrop-blur-md border border-[#e0e6f5] shadow-lg hover:shadow-2xl rounded-2xl p-8 flex flex-col items-center text-center transition duration-300 w-full max-w-sm"
          >
            <div className="bg-[#e5ecff] p-4 rounded-full mb-3">
              <MapPinIcon className="w-10 h-10 text-color-3" />
            </div>
            <h2 className="text-xl font-semibold text-color">Reserve a Spot</h2>
            <p className="text-sm text-color-2 mt-2">
              Find and reserve an available parking slot instantly.
            </p>
            <Link
              to="/spots"
              className="mt-6 bg-gradient-to-r from-[#3366CC] to-[#274b99] text-white py-2 px-6 rounded-md text-sm font-medium shadow-md hover:from-[#274b99] hover:to-[#3366CC] transition duration-300"
            >
              Secure a Spot
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            whileHover={{ scale: 1.05 }}
            className="bg-white/90 backdrop-blur-md border border-[#e0e6f5] shadow-lg hover:shadow-2xl rounded-2xl p-8 flex flex-col items-center text-center transition duration-300 w-full max-w-sm"
          >
            <div className="bg-[#fff4e5] p-4 rounded-full mb-3">
              <ClockIcon className="w-10 h-10 text-[#f4a300]" />
            </div>
            <h2 className="text-xl font-semibold text-color">
              Recent Activities
            </h2>
            <p className="text-sm text-color-2 mt-2">
              Review your latest reservations and parking history.
            </p>
            <Link
              to="/recents"
              className="mt-6 bg-gradient-to-r from-[#f4a300] to-[#c17f00] text-white py-2 px-6 rounded-md text-sm font-medium shadow-md hover:from-[#c17f00] hover:to-[#f4a300] transition duration-300"
            >
              View Activities
            </Link>
          </motion.div>

          {/* Account Settings */}
          <motion.div
            variants={fadeUp}
            whileHover={{ scale: 1.05 }}
            className="bg-white/90 backdrop-blur-md border border-[#e0e6f5] shadow-lg hover:shadow-2xl rounded-2xl p-8 flex flex-col items-center text-center transition duration-300 w-full max-w-sm"
          >
            <div className="bg-[#f3e7ff] p-4 rounded-full mb-3">
              <UserCircleIcon className="w-10 h-10 text-[#9460C9]" />
            </div>
            <h2 className="text-xl font-semibold text-color">
              Account Settings
            </h2>
            <p className="text-sm text-color-2 mt-2">
              Update your profile, password, or vehicle  information.
            </p>
            <Link
              to="/account-settings"
              className="mt-6 bg-gradient-to-r from-[#9460C9] to-[#6f3fa7] text-white py-2 px-6 rounded-md text-sm font-medium shadow-md hover:from-[#6f3fa7] hover:to-[#9460C9] transition duration-300"
            >
              Go to Settings
            </Link>
          </motion.div>
        </motion.div>

        <UserFooter />
        <FeedbackWidget />
      </div>
    </>
  );
};

export default Dashboard;
