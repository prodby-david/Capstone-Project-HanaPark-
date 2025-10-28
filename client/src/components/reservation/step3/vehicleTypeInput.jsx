
const getVehicleOptions = (slotType) => {
  if (!slotType) return [];

  if (slotType === "2-Wheels (399cc below)") {
    return [{ value: "2-Wheels (399cc below)", label: "Small Motorcycle" }]
  }

  if (slotType === "2-Wheels (400cc up)") {
    return [{ value: "2-Wheels (400cc up)", label: "Large Motorcycle" }]
  }
  

  if (slotType === "4-Wheels") {
    return [
      { value: "Sedan", label: "Sedan" },
      { value: "Hatchback", label: "Hatchback" },
      { value: "SUV", label: "SUV" },
      { value: "Pickup", label: "Pickup" },
      { value: "MPV", label: "MPV" },
      { value: "Van", label: "Van" },
    ];
  }

  return [];
};

const VehicleTypeInput = ({ readOnly, value, handleChange, slotType }) => {
  const options = getVehicleOptions(slotType);

  return (
    <div className="flex flex-col w-full max-w-xs gap-2">
      <label htmlFor="vehicleType" className="font-semibold text-color text-sm">
        Vehicle Type
      </label>

      {readOnly ? (
        <input
          type="text"
          id="vehicleType"
          name="vehicleType"
          value={value || ''}
          readOnly
          className="w-full outline-none border p-2 rounded-md text-sm text-color-2 bg-gray-100 cursor-default"
        />
      ) : (
        <select
          name="vehicleType"
          id="vehicleType"
          value={value}
          onChange={handleChange}
          className="w-full outline-none border p-2 border-color-2 rounded-md text-sm text-color-2"
        >
          <option value="">Select vehicle type</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default VehicleTypeInput;
