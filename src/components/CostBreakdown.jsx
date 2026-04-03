import { transportModes } from "../data/transport";

function fmt(n) {
  return `£${n.toLocaleString("en-GB")}`;
}

export default function CostBreakdown({ result, inputs }) {
  if (!result) return null;

  const { transportTotal, parking, flights, accommodation, total, perNight, breakdown } = result;
  const { city, transportMode, nights, destination, locationType } = inputs;

  const modeLabel = transportModes.find((t) => t.id === transportMode)?.label ?? transportMode;

  const rows = [
    {
      label: `${modeLabel} to/from ${city.airport}`,
      sublabel: `${fmt(breakdown.transportOneWay)} × 2 (return)`,
      value: transportTotal,
    },
    transportMode === "car" && {
      label: `Airport parking at ${city.airport}`,
      sublabel: `${fmt(breakdown.parkingPerDay)}/day × ${nights + 1} days`,
      value: parking,
    },
    {
      label: `Return flights to ${destination.name}`,
      sublabel: `Economy, return`,
      value: flights,
    },
    {
      label: `Accommodation (${locationType === "centre" ? "city centre" : "outskirts"})`,
      sublabel: `${fmt(breakdown.accommodationPerNight)}/night × ${nights} nights`,
      value: accommodation,
    },
  ].filter(Boolean);

  const percentages = rows.map((r) => Math.round((r.value / total) * 100));

  return (
    <div className="breakdown">
      <h2>
        {nights}-night trip to {destination.name}
      </h2>
      <p className="breakdown-subtitle">
        From {city.name} · {modeLabel} to airport ·{" "}
        {locationType === "centre" ? "City centre" : "Outskirts"} accommodation
      </p>

      <div className="cost-rows">
        {rows.map((row, i) => (
          <div key={i} className="cost-row">
            <div className="cost-row-info">
              <span className="cost-label">{row.label}</span>
              <span className="cost-sublabel">{row.sublabel}</span>
            </div>
            <span className="cost-value">{fmt(row.value)}</span>
          </div>
        ))}
      </div>

      <div className="bar-chart">
        {rows.map((row, i) => (
          <div
            key={i}
            className="bar-segment"
            style={{ width: `${percentages[i]}%` }}
            title={`${row.label}: ${fmt(row.value)} (${percentages[i]}%)`}
          />
        ))}
      </div>
      <div className="bar-legend">
        {rows.map((row, i) => (
          <span key={i} className="legend-item">
            <span className="legend-dot" style={{ "--dot-index": i }} />
            {row.label.split(" (")[0]}
          </span>
        ))}
      </div>

      <div className="total-row">
        <span>Total estimated cost</span>
        <span className="total-value">{fmt(total)}</span>
      </div>
      <div className="per-night">
        {fmt(perNight)} per night per person (solo estimate)
      </div>

      <p className="disclaimer">
        * Estimates based on average prices. Actual costs will vary with booking timing, season, and availability.
        Flight costs assume economy class booked 4–8 weeks ahead.
        Accommodation based on average Airbnb/hotel rates.
      </p>
    </div>
  );
}
