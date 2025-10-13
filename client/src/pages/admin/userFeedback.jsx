import React, { useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import AdminAPI from "../../lib/inteceptors/adminInterceptor";
import AdminHeader from "../../components/headers/adminHeader";
import Loader from '../../components/loaders/loader';

const AdminFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true)
      try {
        const res = await AdminAPI.get("/admin/feedbacks");
        setFeedbacks(res.data);
      } catch (err) {
        console.error("Failed to fetch feedbacks:", err);
      } finally {
        setLoading(false)
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <>
      <AdminHeader />

      <div className="flex flex-col p-6 md:p-10 lg:p-16 gap-8  min-h-screen">
        <div className="flex flex-col items-center gap-y-2">
          <h2 className="text-2xl font-semibold text-color text-center">
            User Feedbacks
          </h2>
          <p className="text-color-2 text-sm text-center max-w-md">
            Browse through user feedback to understand their satisfaction and
            experience with the system.
          </p>
        </div>

        {feedbacks.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">No feedbacks yet.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {feedbacks.slice(0, visibleCount).map((fb, index) => (
                <motion.div
                  key={fb._id}
                  className="bg-white shadow-md hover:shadow-lg rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 border border-gray-100 w-[280px] h-[280px] mx-auto"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div>
                    <div className="flex flex-col justify-between mb-3">
                      <h3 className="font-semibold text-color text-lg">
                        {fb.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-5 h-5 ${
                              i < fb.rating
                                ? "text-color-3"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 break-words">
                        {fb.message}
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

            {visibleCount < feedbacks.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="px-6 py-2 text-sm bg-color text-white rounded-md hover:bg-color-3  cursor-pointer transition"
                >
                  Show More
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {loading ? <Loader /> : null}
    </>
  );
};

export default AdminFeedbacks;
