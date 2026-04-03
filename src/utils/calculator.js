import { transportRates } from "../data/transport";
import { airportParkingCosts } from "../data/airports";

/**
 * Calculate transport cost to airport
 * @param {string} transportMode - "car" | "taxi" | "train" | "bus"
 * @param {number} distanceMiles - distance from city to airport
 * @returns {number} - one-way cost in GBP
 */
export function calcTransportCost(transportMode, distanceMiles) {
  const rate = transportRates[transportMode];
  if (!rate) return 0;
  const cost = distanceMiles * rate.perMile;
  return Math.max(cost, rate.minCost);
}

/**
 * Calculate airport parking cost
 * @param {string} airportCode
 * @param {number} nights - total trip nights (parking days = nights + 1 buffer)
 * @returns {number} - total parking cost in GBP
 */
export function calcParkingCost(airportCode, nights) {
  const parking = airportParkingCosts[airportCode];
  if (!parking) return 0;
  // Use off-airport (cheaper) rate; days = nights + 1 (day of departure counts)
  const days = nights + 1;
  return parking.offAirport * days;
}

/**
 * Calculate return flight cost with a multiplier for longer stays (booked earlier)
 * @param {object} destination
 * @param {string} airportCode
 * @param {number} nights
 * @returns {number} - return flight cost in GBP
 */
export function calcFlightCost(destination, airportCode, nights) {
  const base = destination.baseFlightCost[airportCode] ?? 180;
  // Slight discount for longer trips (assume booked in advance)
  const discount = nights >= 7 ? 0.95 : 1.0;
  return Math.round(base * discount);
}

/**
 * Calculate total accommodation cost
 * @param {object} destination
 * @param {string} locationType - "centre" | "outskirts"
 * @param {number} nights
 * @returns {number} - total accommodation cost in GBP
 */
export function calcAccommodationCost(destination, locationType, nights) {
  const nightly = destination.accommodation[locationType] ?? 100;
  return nightly * nights;
}

/**
 * Full trip cost breakdown
 */
export function calcTotalCost({ city, transportMode, nights, destination, locationType }) {
  const transportOneWay = calcTransportCost(transportMode, city.distanceMiles);
  const transportTotal = transportOneWay * 2; // return journey
  const parking = transportMode === "car" ? calcParkingCost(city.airportCode, nights) : 0;
  const flights = calcFlightCost(destination, city.airportCode, nights);
  const accommodation = calcAccommodationCost(destination, locationType, nights);
  const total = transportTotal + parking + flights + accommodation;

  return {
    transportTotal: Math.round(transportTotal),
    parking: Math.round(parking),
    flights,
    accommodation,
    total: Math.round(total),
    perNight: Math.round(total / nights),
    breakdown: {
      transportOneWay: Math.round(transportOneWay),
      parkingPerDay: transportMode === "car"
        ? (airportParkingCosts[city.airportCode]?.offAirport ?? 0)
        : 0,
      accommodationPerNight: destination.accommodation[locationType] ?? 0,
    },
  };
}
