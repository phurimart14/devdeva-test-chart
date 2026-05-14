import { useState } from "react";
import { DailyChart } from "./components/DailyChart";
import { generateMockData, LINE_CONFIGS } from "./lib/mockData";

function App() {
  // lazy init — generator รันแค่ครั้งแรก
  const [data] = useState(() => generateMockData());

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary">Daily Graph</h1>
          <p className="mt-1 text-text-secondary">
            Multi-axis line chart — 3 metrics over 24 hours
          </p>
        </div>

        {/* Chart Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <DailyChart data={data} lineConfigs={LINE_CONFIGS} />
        </div>
      </div>
    </div>
  );
}

export default App;
