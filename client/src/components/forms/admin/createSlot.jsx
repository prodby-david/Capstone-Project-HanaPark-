import React, { useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import toastOptions from "../../../lib/toastConfig";
import Loader from "../../loaders/loader";
import AdminAPI from "../../../lib/inteceptors/adminInterceptor";
import AdminHeader from "../../headers/adminHeader";

const CreateSlot = () => {
  const [slotData, setSlotData] = useState({
    slotUser: "",
    slotNumber: "",
    slotType: "",
    slotPrice: "",
    slotStatus: "",
    slotDescription: "",
  });

  const [existingSlots, setExistingSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const MAX_SLOTS = {
    Student: 60,
    Staff: 40,
    Visitor: 30,
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "slotType") {
      let newPrice = "";
      if (value === "2-Wheels (399cc below)") newPrice = 50;
      else if (value === "2-Wheels (400cc up)" || value === "4-Wheels")
        newPrice = 80;

      setSlotData((prev) => ({
        ...prev,
        slotType: value,
        slotPrice: newPrice,
      }));
      return;
    }

    setSlotData({ ...slotData, [name]: value });

    if (name === "slotUser") {
      try {
        const res = await AdminAPI.get(`/admin/slots?user=${value}`);
        const slots = res.data;
        setExistingSlots(slots);

        if (slots.length >= MAX_SLOTS[value]) {
          setSlotData((prev) => ({ ...prev, slotNumber: "" }));
        } else {
          const prefix =
            value === "Student"
              ? "STU"
              : value === "Staff"
              ? "STA"
              : "VIS";

          const numbers = slots
            .map((s) => parseInt(s.slotNumber.split("-")[1]))
            .filter((n) => !isNaN(n));

          const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;
          const nextSlotNumber = `${prefix}-${maxNum + 1}`;

          setSlotData((prev) => ({
            ...prev,
            slotNumber: nextSlotNumber,
          }));
        }
      } catch (err) {
        console.error("Error fetching slots", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !slotData.slotUser ||
      !slotData.slotNumber ||
      !slotData.slotType ||
      !slotData.slotStatus
    ) {
      toast.error("Fields should not be empty.", toastOptions);
      return;
    }

    setIsLoading(true);

    try {
      const res = await AdminAPI.post("/admin/slots", slotData);

      if (res.data.success) {
        Swal.fire({
          title: "New slot added",
          text: "Slot created successfully.",
          icon: "success",
          confirmButtonColor: "#00509e",
          confirmButtonText: "Confirm",
        });

        setSlotData({
          slotUser: "",
          slotNumber: "",
          slotType: "",
          slotPrice: "",
          slotStatus: "",
          slotDescription: "",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Creating slot failed",
        text: err.response.data.message,
        icon: "error",
        confirmButtonText: "Try Again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AdminHeader />

      <div className="flex justify-center items-center my-5 px-5">
        <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-semibold text-color text-center mb-5">
            Create Parking Slot
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slot User
                </label>
                <select
                  name="slotUser"
                  value={slotData.slotUser}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 text-sm text-gray-700 outline-none transition"
                >
                  <option value="" disabled>
                    Select Slot User
                  </option>
                  <option value="Student">Student</option>
                  <option value="Staff">Staff</option>
                  <option value="Visitor">Visitor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slot Number
                </label>
                <input
                  type="text"
                  name="slotNumber"
                  value={slotData.slotNumber}
                  readOnly
                  className="w-full border rounded-lg p-2 text-sm text-gray-700 bg-gray-50 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slot Type
                </label>
                <select
                  name="slotType"
                  value={slotData.slotType}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 text-sm text-gray-700 outline-none transition"
                >
                  <option value="" disabled>
                    Select Slot Type
                  </option>
                  <option value="2-Wheels (399cc below)">
                    2-Wheels (399cc below)
                  </option>
                  <option value="2-Wheels (400cc up)">2-Wheels (400cc up)</option>
                  <option value="4-Wheels">4-Wheels</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="text"
                  value={`₱ ${slotData.slotPrice}`}
                  readOnly
                  className="w-full border rounded-lg p-2 text-sm text-gray-700 bg-gray-50 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slot Status
              </label>
              <select
                name="slotStatus"
                value={slotData.slotStatus}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 text-sm text-gray-700 outline-none transition"
              >
                <option value="" disabled>
                  Slot Status
                </option>
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Occupied">Occupied</option>
                <option value="Ongoing Maintenance">
                  Ongoing Maintenance
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slot Description
              </label>
              <textarea
                name="slotDescription"
                value={slotData.slotDescription}
                onChange={handleChange}
                maxLength={100}
                placeholder="Write a short description..."
                className="w-full border rounded-lg p-2 text-sm text-gray-700 h-[120px] resize-none outline-none transition"
              ></textarea>
            </div>

            <p className="text-xs text-gray-500 text-center">
              <span className="font-semibold text-color-3">NOTE:</span> Max
              slots — Students: 60, Staff: 40, Visitors: 30.
            </p>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-color to-blue-900 text-white py-2 text-sm rounded-lg font-medium hover:opacity-90 transition-all duration-300 cursor-pointer"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {isLoading && <Loader text="Creating slot..." />}
    </>
  );
};

export default CreateSlot;
