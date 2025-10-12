import React, { useState } from "react";
import { ChatBubbleLeftEllipsisIcon, XMarkIcon, StarIcon } from "@heroicons/react/24/solid";


const FeedbackWidget = () => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: send to backend (e.g., axios.post('/feedback', { rating, message }))
    setOpen(false);
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
            <p className="text-xs text-color-2 text-center">We’d love to hear your thoughts! Share your experience to help us improve your parking journey.</p>
          </div>
          

          <div className="flex justify-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`w-6 h-6 cursor-pointer ${
                  star <= rating ? "text-color-3" : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>

          <textarea
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-color-3 resize-none"
            rows="3"
            placeholder="Write your feedback..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>

          <button
            onClick={handleSubmit}
            className="mt-3 w-full bg-color-3 text-white rounded-lg py-2 text-sm hover:scale-105 transition"
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