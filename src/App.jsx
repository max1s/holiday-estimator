import { useState } from "react";
import HolidayForm from "./components/HolidayForm";
import CostBreakdown from "./components/CostBreakdown";
import { calcTotalCost } from "./utils/calculator";
import "./App.css";

export default function App() {
  const [result, setResult] = useState(null);
  const [inputs, setInputs] = useState(null);

  const handleCalculate = (formInputs) => {
    const costs = calcTotalCost(formInputs);
    setInputs(formInputs);
    setResult(costs);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Holiday Cost Estimator</h1>
        <p>Estimate the total cost of a European getaway from the UK</p>
      </header>

      <main className="app-main">
        <section className="form-section">
          <HolidayForm onCalculate={handleCalculate} />
        </section>

        {result && (
          <section className="result-section">
            <CostBreakdown result={result} inputs={inputs} />
          </section>
        )}
      </main>
    </div>
  );
}
