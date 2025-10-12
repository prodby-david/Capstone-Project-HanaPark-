import React, { useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import AdminAPI from "../../lib/inteceptors/adminInterceptor";

const AdminFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await AdminAPI.get("/admin/feedbacks");
        setFeedbacks(res.data);
      } catch (err) {
        console.error("Failed to fetch feedbacks:", err);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-semibold text-color mb-6 text-center md:text-left">
        User Feedbacks
      </h2>

      {feedbacks.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No feedbacks yet.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {feedbacks.map((fb, index) => (
            <motion.div
              key={fb._id}
              className="bg-white shadow-md hover:shadow-lg rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-color text-lg truncate">
                    {fb.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-5 h-5 ${
                          i < fb.rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 break-words">
                  {fb.message.length > 120
                    ? `${fb.message.substring(0, 120)}...`
                    : fb.message}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-gray-400">
                  {new Date(fb.createdAt).toLocaleDateString()}{" "}
                  {new Date(fb.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFeedbacks;
