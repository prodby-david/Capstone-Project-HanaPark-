import React, { useState, useEffect } from "react";
import {
  EnvelopeIcon,
  UserIcon,
  ChatBubbleLeftEllipsisIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import AdminAPI from "../../lib/inteceptors/adminInterceptor";
import AdminHeader from "../../components/headers/adminHeader";
import CustomPopup from "../../components/popups/popup";

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [popup, setPopup] = useState({ show: false, type: "info", message: "", onConfirm: null });

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await AdminAPI.get("/admin/inquiries");
        setInquiries(res.data);
      } catch (err) {
        console.error("Error fetching inquiries:", err);
      }
    };
    fetchInquiries();
  }, []);

  const handleDelete = (id) => {
    setPopup({
      show: true,
      type: "confirm",
      message: "Are you sure you want to delete this inquiry?",
      onConfirm: async () => {
        try {
          await AdminAPI.delete(`/admin/inquiries/${id}`);
          setInquiries(inquiries.filter((inq) => inq._id !== id));
          setPopup({
            show: true,
            type: "success",
            message: "Inquiry deleted successfully!",
            onConfirm: null,
          });
        } catch (error) {
          console.error("Error deleting inquiry:", error);
          setPopup({
            show: true,
            type: "error",
            message: "Failed to delete inquiry. Please try again.",
            onConfirm: null,
          });
        }
      },
    });
  };

  return (
    <>
      <AdminHeader />

      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto my-5">
          <div className="flex items-center justify-center gap-3 mb-3">
            <ChatBubbleLeftEllipsisIcon className="w-7 h-7 text-color" />
            <h1 className="text-2xl font-semibold text-color">User Inquiries</h1>
          </div>
          <p className="text-sm text-color-2 text-center">
            Manage and respond to user inquiries directly through Gmail.
          </p>
          <hr className="border-gray-300 mt-4" />
        </div>

        <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {inquiries.map((inq) => (
            <div
              key={inq._id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-color-3 mb-2 flex items-center gap-2">
                  <EnvelopeIcon className="w-5 h-5 text-color-3" />
                  {inq.subject}
                </h2>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <UserIcon className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-color">{inq.name}</span>
                  <span className="text-color-2">•</span>
                  <p>{inq.email}</p>
                </div>

                <p className="relative pl-4 border-l-4 border-color text-sm text-gray-700 leading-relaxed italic break-words">
                  “
                  {inq.message.length > 100
                    ? inq.message.slice(0, 100) + "..."
                    : inq.message}
                  ”
                </p>
              </div>

              <hr className="border-gray-200 my-4" />

              <div className="flex justify-between">
                <button
                  onClick={() => handleDelete(inq._id)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </button>

                <button
                  onClick={() =>
                    window.open(
                      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                        inq.email
                      )}&su=${encodeURIComponent("Re: " + inq.subject)}`,
                      "_blank"
                    )
                  }
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-color text-white rounded-xl hover:opacity-90 transition-all"
                >
                  <EnvelopeIcon className="w-4 h-4" />
                  Reply via Gmail
                </button>
              </div>
            </div>
          ))}

          {inquiries.length === 0 && (
            <div className="col-span-full text-center mt-10 text-gray-500">
              No inquiries found.
            </div>
          )}
        </div>
      </div>

      <CustomPopup
        show={popup.show}
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ show: false, type: "", message: "", onConfirm: null })}
        onConfirm={popup.onConfirm}
        confirmText="Confirm"
        cancelText="Cancel"
        showCancel={popup.onConfirm ? true : false}
      />
    </>
  );
};

export default Inquiries;
