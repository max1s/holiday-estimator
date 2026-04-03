import { transportModes } from "../data/transport";
import { flightLink, accommodationLink, parkingLink, transportLink } from "../utils/links";

function fmt(n) {
  return `£${n.toLocaleString("en-GB")}`;
}

function BookLink({ href, label = "Book" }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="book-link">
      {label} ↗
    </a>
  );
}

export default function CostBreakdown({ result, inputs }) {
  if (!result) return null;

  const { cheapest, average } = result;
  const { city, transportMode, nights, destination, locationType } = inputs;
  const modeLabel = transportModes.find((t) => t.id === transportMode)?.label ?? transportMode;

  const rows = [
    {
      label:    `${modeLabel} to/from ${city.airport}`,
      sublabel: `${fmt(cheapest.meta.transportOneWay)}–${fmt(average.meta.transportOneWay)} one-way × 2`,
      cheap:    cheapest.transportTotal,
      avg:      average.transportTotal,
      link:     transportLink(transportMode),
      linkLabel: transportMode === "car" ? null : "Book",
    },
    transportMode === "car" && {
      label:    `Airport parking at ${city.airport}`,
      sublabel: `Off-airport vs on-airport · ${nights + 1} days`,
      cheap:    cheapest.parking,
      avg:      average.parking,
      link:     parkingLink(city.parkingSlug),
      linkLabel: "Compare",
    },
    {
      label:    `Return flights to ${destination.name}`,
      sublabel: `Budget carrier vs average economy`,
      cheap:    cheapest.flights,
      avg:      average.flights,
      link:     flightLink(city.airportCode, destination.iataCode),
      linkLabel: "Search",
    },
    {
      label:    `Accommodation (${locationType === "centre" ? "city centre" : "outskirts"})`,
      sublabel: `${fmt(cheapest.meta.accommodationPerNight)}–${fmt(average.meta.accommodationPerNight)}/night · ${nights} nights`,
      cheap:    cheapest.accommodation,
      avg:      average.accommodation,
      link:     accommodationLink(destination.bookingSlug),
      linkLabel: "Search",
    },
  ].filter(Boolean);

  return (
    <div className="breakdown">
      <h2>{nights}-night trip to {destination.name}</h2>
      <p className="breakdown-subtitle">
        From {city.name} · {modeLabel} to airport ·{" "}
        {locationType === "centre" ? "City centre" : "Outskirts"} accommodation
      </p>

      <table className="cost-table">
        <thead>
          <tr>
            <th className="col-label"></th>
            <th className="col-price">Cheapest</th>
            <th className="col-price">Average</th>
            <th className="col-book"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>
                <span className="cost-label">{row.label}</span>
                <span className="cost-sublabel">{row.sublabel}</span>
              </td>
              <td className="price-cell cheap">{fmt(row.cheap)}</td>
              <td className="price-cell avg">{fmt(row.avg)}</td>
              <td className="book-cell">
                <BookLink href={row.link} label={row.linkLabel} />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="total-row">
            <td>Total estimated cost</td>
            <td className="price-cell cheap total-value">{fmt(cheapest.total)}</td>
            <td className="price-cell avg total-value">{fmt(average.total)}</td>
            <td></td>
          </tr>
          <tr className="per-night-row">
            <td>Per night</td>
            <td className="price-cell cheap">{fmt(cheapest.perNight)}</td>
            <td className="price-cell avg">{fmt(average.perNight)}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <p className="disclaimer">
        Cheapest: budget carrier, off-airport parking booked early, budget hotel/hostel.
        Average: typical economy fare booked 4–8 weeks ahead, on-airport parking, mid-range hotel.
        Actual prices vary with dates and availability.
      </p>
    </div>
  );
}
