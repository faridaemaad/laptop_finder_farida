export const compareRows = [
  { key: "price", label: "Price ($)", best: "min" },
  { key: "ramGB", label: "RAM (GB)", best: "max" },
  { key: "storageGB", label: "Storage (GB)", best: "max" },
  { key: "batteryHours", label: "Battery (hours)", best: "max" },
  { key: "weightKg", label: "Weight (kg)", best: "min" },
  { key: "screenInches", label: "Screen (inches)", best: null },
];
// Calculate the best spec value across compared laptops (lowest for price/weight, highest for RAM/storage/battery)
export const getBestValue = (laptops, key, best) => {
  if (best === null) return null;
  const values = laptops.map((laptop) => laptop[key]);
  if (best === "min") return Math.min(...values);
  return Math.max(...values);
};