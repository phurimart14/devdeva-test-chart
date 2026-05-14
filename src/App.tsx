import { generateMockData, LINE_CONFIGS } from './lib/mockData';

function App() {
  const data = generateMockData();

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-chart-green">
        Chart Dashboard 📊
      </h1>

      {/* Debug: จำนวน data points */}
      <p className="mt-2 text-text-secondary">
        Generated <strong>{data.length}</strong> data points ✅
      </p>

      {/* Debug: 3 จุดแรก */}
      <pre className="mt-4 p-4 bg-card border border-border rounded-lg text-sm overflow-auto">
        {JSON.stringify(data.slice(0, 3), null, 2)}
      </pre>

      {/* Debug: line configs */}
      <pre className="mt-4 p-4 bg-card border border-border rounded-lg text-sm overflow-auto">
        {JSON.stringify(LINE_CONFIGS, null, 2)}
      </pre>
    </div>
  );
}

export default App;