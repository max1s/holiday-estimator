import { transportRates } from "../data/transport";
import { airportParkingCosts } from "../data/airports";

// Cheapest multipliers — budget carrier / advance deal / budget accommodation
const CHEAP_FLIGHT_FACTOR = 0.65;
const CHEAP_ACCOM_FACTOR  = 0.60;

export function calcTransportCost(transportMode, distanceMiles) {
  const rate = transportRates[transportMode];
  if (!rate) return 0;
  return Math.max(distanceMiles * rate.perMile, rate.minCost);
}

export function calcParkingCost(airportCode, nights, cheap = false) {
  const parking = airportParkingCosts[airportCode];
  if (!parking) return 0;
  const days = nights + 1;
  return (cheap ? parking.offAirport : parking.onAirport) * days;
}

export function calcFlightCost(destination, airportCode, nights, cheap = false) {
  const base = destination.baseFlightCost[airportCode] ?? 180;
  const advanceDiscount = nights >= 7 ? 0.95 : 1.0;
  const factor = cheap ? CHEAP_FLIGHT_FACTOR : advanceDiscount;
  return Math.round(base * factor);
}

export function calcAccommodationCost(destination, locationType, nights, cheap = false) {
  const nightly = destination.accommodation[locationType] ?? 100;
  const factor = cheap ? CHEAP_ACCOM_FACTOR : 1.0;
  return Math.round(nightly * factor * nights);
}

function buildScenario({ city, transportMode, nights, destination, locationType }, cheap) {
  const transportOneWay = calcTransportCost(transportMode, city.distanceMiles);
  const transportTotal  = Math.round(transportOneWay * 2);
  const parking         = transportMode === "car" ? Math.round(calcParkingCost(city.airportCode, nights, cheap)) : 0;
  const flights         = calcFlightCost(destination, city.airportCode, nights, cheap);
  const accommodation   = calcAccommodationCost(destination, locationType, nights, cheap);
  const total           = transportTotal + parking + flights + accommodation;

  return {
    transportTotal,
    parking,
    flights,
    accommodation,
    total,
    perNight: Math.round(total / nights),
    meta: {
      transportOneWay:       Math.round(transportOneWay),
      parkingPerDay:         transportMode === "car" ? (airportParkingCosts[city.airportCode]?.[cheap ? "offAirport" : "onAirport"] ?? 0) : 0,
      accommodationPerNight: Math.round((destination.accommodation[locationType] ?? 100) * (cheap ? CHEAP_ACCOM_FACTOR : 1.0)),
    },
  };
}

export function calcTotalCost(inputs) {
  return {
    cheapest: buildScenario(inputs, true),
    average:  buildScenario(inputs, false),
  };
}
