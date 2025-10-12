import React, { useState } from "react";
import { ChatBubbleLeftEllipsisIcon, XMarkIcon, StarIcon } from "@heroicons/react/24/solid";
import UserAPI from "../../lib/inteceptors/userInterceptor";
import Swal from "sweetalert2";

const FeedbackWidget = () => {
  const [open, setOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState({
    rating: 0,
    message: ""
  });

  const handleStarClick = (value) => {
    setFeedbacks((prev) => ({ ...prev, rating: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedbacks((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await UserAPI.post("/feedback", feedbacks);
      Swal.fire({
        icon: "success",
        title: "Thank you for your feedback!",
        showConfirmButton: false,
        timer: 1000,
      });
      setOpen(false);
      setFeedbacks({ rating: 0, message: "" });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Feedback Failed",
        text: err.response?.data?.message || "Something went wrong. Please try again later.",
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-4 z-50">
      {open ? (
        <div className="bg-white shadow-lg rounded-2xl p-4 w-72 sm:w-80 relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 text-color hover:text-color-3"
          >
            <XMarkIcon className="w-5 h-5 cursor-pointer" />
          </button>

          <div className="mb-2">
            <h2 className="text-lg font-semibold text-color mb-2">User Feedback</h2>
            <p className="text-xs text-color-2 text-center">
              We’d love to hear your thoughts! Share your experience to help us improve your parking journey.
            </p>
          </div>

          <div className="flex justify-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`w-6 h-6 cursor-pointer ${
                  star <= feedbacks.rating ? "text-color-3" : "text-gray-300"
                }`}
                onClick={() => handleStarClick(star)}
              />
            ))}
          </div>

          <textarea
            name="message"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-color-3 resize-none"
            rows="3"
            placeholder="Write your feedback..."
            value={feedbacks.message}
            onChange={handleChange}
          ></textarea>

          <button
            onClick={handleSubmit}
            className="mt-3 w-full bg-color-3 text-white rounded-lg py-2 text-sm cursor-pointer hover:scale-105 transition"
          >
            Submit
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-color-3 hover:bg-color-2 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition transform hover:scale-105 cursor-pointer"
        >
          <ChatBubbleLeftEllipsisIcon className="w-6 h-6" title="User Feedback" />
        </button>
      )}
    </div>
  );
};

export default FeedbackWidget;
