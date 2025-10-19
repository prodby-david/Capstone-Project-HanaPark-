import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LockPopup = ({
  show,
  onClose,
  onConfirm,
  isLocked,
  currentReason = "",
}) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const lockReasons = [
    "Violation of terms",
    "Multiple no-shows",
    "Multiple failed login attempts",
    "Suspicious activity",
    "User requested temporary lock",
    "Other",
  ];

  useEffect(() => {
    if (!show) {
      setSelectedReason("");
      setCustomReason("");
    }
  }, [show]);

  const handleConfirm = () => {
    const finalReason =
      selectedReason === "Other" ? customReason : selectedReason;
    onConfirm(finalReason);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md text-center"
        >
          <h2 className="text-xl font-semibold text-color mb-3">
            {isLocked ? "Unlock Account" : "Lock Account"}
          </h2>
          <p className="text-gray-600 mb-5">
            {isLocked
              ? "Are you sure you want to unlock this user’s account?"
              : "Select the reason for locking this account."}
          </p>

          {!isLocked && (
            <>
              <select
                className="w-full border rounded-lg p-2 text-sm text-gray-700 focus:ring-2 focus:ring-color-3 outline-none mb-3"
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
              >
                <option value="">Select a reason</option>
                {lockReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>

              {selectedReason === "Other" && (
                <input
                  type="text"
                  className="w-full border rounded-lg p-2 text-sm text-gray-700 focus:ring-2 focus:ring-color-3 outline-none"
                  placeholder="Type your specific reason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                />
              )}
            </>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 rounded-lg bg-color text-white hover:opacity-90 transition"
              disabled={!isLocked && !selectedReason}
            >
              {isLocked ? "Unlock" : "Lock"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LockPopup;
