import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const icons = {
  success: <CheckCircleIcon className="w-16 h-16 text-green-500" />,
  error: <XCircleIcon className="w-16 h-16 text-red-500" />,
  warning: <ExclamationTriangleIcon className="w-16 h-16 text-yellow-500" />,
  info: <InformationCircleIcon className="w-16 h-16 text-blue-500" />,
};

const CustomPopup = ({
  show,
  type = "info",
  title = "",
  message = "",
  onClose,
  onConfirm,
  confirmText = "OK",
  cancelText = "Cancel",
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[99] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl p-8 w-[90%] max-w-md shadow-2xl flex flex-col items-center text-center"
          >
            {icons[type]}

            <h2 className="mt-4 text-2xl font-bold text-color">{title}</h2>

            <p className="text-base text-color-2 mt-2 leading-relaxed">
              {message}
            </p>

            <div className="flex justify-center gap-4 mt-8">
              {onConfirm ? (
                <>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 border border-gray-300 rounded-md text-color-2 hover:bg-gray-100 transition cursor-pointer text-sm font-medium"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={onConfirm}
                    className="px-5 py-2.5 bg-color text-white rounded-md hover:opacity-90 transition cursor-pointer text-sm font-medium"
                  >
                    {confirmText}
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-color text-white rounded-md hover:opacity-90 transition cursor-pointer text-sm font-medium"
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
