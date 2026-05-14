import { useState } from 'react';
import { DailyChart } from './components/DailyChart';
import { ExportButton } from './components/ExportButton';
import { generateMockData, LINE_CONFIGS } from './lib/mockData';

function App() {
  const [data] = useState(() => generateMockData());

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary">
            Daily Graph
          </h1>
          <p className="mt-1 text-text-secondary">
            Multi-axis line chart — 3 metrics over 24 hours
          </p>
        </div>

        {/* Chart Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">
              Daily Graph
            </h2>
            <ExportButton
              data={data}
              lineConfigs={LINE_CONFIGS}
              filename="daily-graph"
            />
          </div>

          <DailyChart data={data} lineConfigs={LINE_CONFIGS} />
        </div>
      </div>
    </div>
  );
}

export default App;