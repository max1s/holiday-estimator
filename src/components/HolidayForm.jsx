import { useState } from "react";
import { ukCities } from "../data/airports";
import { europeanDestinations } from "../data/destinations";
import { transportModes } from "../data/transport";

export default function HolidayForm({ onCalculate }) {
  const [form, setForm] = useState({
    cityIndex: "",
    transportMode: "car",
    nights: 7,
    destinationIndex: "",
    locationType: "centre",
  });

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const city = ukCities[form.cityIndex];
    const destination = europeanDestinations[form.destinationIndex];
    if (!city || !destination) return;
    onCalculate({
      city,
      transportMode: form.transportMode,
      nights: parseInt(form.nights, 10),
      destination,
      locationType: form.locationType,
    });
  };

  const isValid =
    form.cityIndex !== "" && form.destinationIndex !== "" && form.nights >= 1;

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group full-width">
        <label htmlFor="city">Starting location (UK)</label>
        <select
          id="city"
          value={form.cityIndex}
          onChange={(e) => set("cityIndex", e.target.value)}
          required
        >
          <option value="">Select your city…</option>
          {ukCities.map((c, i) => (
            <option key={i} value={i}>
              {c.name}
            </option>
          ))}
        </select>
        {form.cityIndex !== "" && (
          <span className="hint">
            Nearest airport: {ukCities[form.cityIndex].airport} ({ukCities[form.cityIndex].airportCode}) —{" "}
            {ukCities[form.cityIndex].distanceMiles} miles away
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="transport">Transport to airport</label>
        <select
          id="transport"
          value={form.transportMode}
          onChange={(e) => set("transportMode", e.target.value)}
        >
          {transportModes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        {form.transportMode === "car" && (
          <span className="hint">Airport parking cost will be included</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="nights">Length of holiday (nights)</label>
        <input
          id="nights"
          type="number"
          min="1"
          max="90"
          value={form.nights}
          onChange={(e) => set("nights", e.target.value)}
          required
        />
      </div>

      <div className="form-group full-width">
        <label htmlFor="destination">Destination city</label>
        <select
          id="destination"
          value={form.destinationIndex}
          onChange={(e) => set("destinationIndex", e.target.value)}
          required
        >
          <option value="">Select a destination…</option>
          {europeanDestinations.map((d, i) => (
            <option key={i} value={i}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group full-width">
        <label>Accommodation location</label>
        <div className="radio-group">
          {[
            { value: "centre",   label: "🏙️ City centre" },
            { value: "outskirts", label: "🌿 Outskirts / suburbs" },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`radio-option${form.locationType === opt.value ? " selected" : ""}`}
            >
              <input
                type="radio"
                name="locationType"
                value={opt.value}
                checked={form.locationType === opt.value}
                onChange={() => set("locationType", opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <button type="submit" disabled={!isValid} className="btn-calculate">
        Estimate my holiday cost →
      </button>
    </form>
  );
}
