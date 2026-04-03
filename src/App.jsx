import { useState } from "react";
import HolidayForm from "./components/HolidayForm";
import CostBreakdown from "./components/CostBreakdown";
import { calcTotalCost } from "./utils/calculator";
import "./App.css";

export default function App() {
  const [result, setResult]   = useState(null);
  const [inputs, setInputs]   = useState(null);
  const [animKey, setAnimKey] = useState(0);

  const handleCalculate = (formInputs) => {
    const costs = calcTotalCost(formInputs);
    setInputs(formInputs);
    setResult(costs);
    setAnimKey((k) => k + 1); // retrigger fade-in on recalculate
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <span className="header-icon">✈️</span>
          <h1>Holiday Cost Estimator</h1>
          <p>Plan your European getaway — see the cheapest and average cost, with links to book everything.</p>
        </div>
      </header>

      <main className="app-main">
        <section className="form-card">
          <HolidayForm onCalculate={handleCalculate} />
        </section>

        {result && (
          <section className="result-card" key={animKey}>
            <CostBreakdown result={result} inputs={inputs} />
          </section>
        )}
      </main>
    </div>
  );
}
