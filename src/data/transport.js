// Transport cost rates to airport

export const transportModes = [
  { id: "car", label: "Car (drive yourself)" },
  { id: "taxi", label: "Taxi / Uber" },
  { id: "train", label: "Train" },
  { id: "bus", label: "Bus / Coach" },
];

// Cost per mile in GBP
export const transportRates = {
  car:   { perMile: 0.25, minCost: 5,   label: "Car (fuel)" },
  taxi:  { perMile: 2.50, minCost: 15,  label: "Taxi/Uber" },
  train: { perMile: 0.40, minCost: 12,  label: "Train" },
  bus:   { perMile: 0.18, minCost: 8,   label: "Bus/Coach" },
};
