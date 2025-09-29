
export function normalizeVehicleType(vehicleType) {
  const twoWheelsBelow399 = ['Small Motorcycle', '2-Wheels (399cc below)'];
  const twoWheelsAbove400 = ['Bigbike Motorcycle', '2-Wheels (400cc up)'];
  const fourWheels = ['Sedan', 'Hatchback', 'SUV', 'Pickup', 'MPV', 'Van', '4-Wheels'];

  if (twoWheelsBelow399.includes(vehicleType)) return '2-Wheels (399cc below)';
  if (twoWheelsAbove400.includes(vehicleType)) return '2-Wheels (400cc up)';
  if (fourWheels.includes(vehicleType)) return '4-Wheels';

  return null;
}
