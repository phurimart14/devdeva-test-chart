import { useState } from 'react';
import { DailyChart } from './components/DailyChart';
import { ExportButton } from './components/ExportButton';
import { generateMockData, LINE_CONFIGS } from './lib/mockData';

function App() {
  const [data] = useState(() => generateMockData());

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Daily Graph
          </h1>
          <p className="mt-1 text-sm sm:text-base text-text-secondary">
            Multi-axis line chart — 3 metrics over 24 hours
          </p>
        </div>

        {/* Chart Card */}
        <div className="bg-card border border-border rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
          {/* Header ของ card */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-text-primary">
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