import {useEffect} from 'react'
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

const icons = {
  success: <CheckCircleIcon className="w-16 h-16 text-green-500" />,
  error: <XCircleIcon className="w-16 h-16 text-red-500" />,
  warning: <ExclamationTriangleIcon className="w-16 h-16 text-yellow-500" />,
  info: <InformationCircleIcon className="w-16 h-16 text-blue-500" />,
  question: <QuestionMarkCircleIcon className="w-16 h-16 text-blue-500" />,
};

const CustomPopup = ({
  show,
  type = "info",
  title = "",
  message = "",
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  showCancel = true,
}) => {
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          if (onConfirm) {
            onConfirm();
          } else {
            onClose(); 
          }
        }
      };

      if (show) {
        document.addEventListener("keydown", handleKeyDown);
      }

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [show, onConfirm, onClose]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={title + type}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[99] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{
              duration: 0.35,
              ease: [0.25, 0.1, 0.25, 1], 
            }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center flex flex-col items-center"
          >
            {icons[type]}

            <h2 className="mt-4 text-2xl font-bold text-color">{title}</h2>
            <p className="text-sm text-color-2 mt-2 leading-relaxed">{message}</p>

            <div className="flex justify-center gap-4 mt-8 text-sm">
              {onConfirm ? (
                <>
                  {showCancel && (
                    <button
                      onClick={onClose}
                      className="px-5 py-2 border border-gray-300 rounded-md text-color-2 hover:bg-gray-100 transition cursor-pointer text-sm font-medium"
                    >
                      {cancelText}
                    </button>
                  )}
                  <button
                    onClick={onConfirm}
                    className="px-5 py-2 bg-color text-white rounded-md hover:opacity-90 transition cursor-pointer text-sm font-medium"
                  >
                    {confirmText}
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-color text-white rounded-md hover:opacity-90 transition cursor-pointer text-sm font-medium"
                >
                  {confirmText}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

  );
};

export default CustomPopup;
