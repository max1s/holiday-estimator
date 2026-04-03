/**
 * Build booking URLs for each cost category.
 * All links open the relevant search/listing page pre-filled where the
 * service's URL scheme allows it.
 */

export function flightLink(departureCode, destinationIata) {
  const from = departureCode.toLowerCase();
  const to = destinationIata.toLowerCase();
  return `https://www.skyscanner.net/transport/flights/${from}/${to}/`;
}

export function accommodationLink(bookingSlug) {
  const encoded = encodeURIComponent(bookingSlug);
  return `https://www.booking.com/searchresults.html?ss=${encoded}&no_rooms=1&group_adults=1`;
}

export function parkingLink(parkingSlug) {
  return `https://www.holidayextras.co.uk/airport-parking/${parkingSlug}-airport-parking.html`;
}

const transportLinks = {
  car:   null, // driving — no booking needed
  train: "https://www.thetrainline.com/",
  bus:   "https://www.nationalexpress.com/en",
  taxi:  "https://www.uber.com/gb/en/",
};

export function transportLink(mode) {
  return transportLinks[mode] ?? null;
}
