import React from 'react';

// ChartCard: simple wrapper for chart sections
const ChartCard = ({ title, subtitle, children }) => (
  <div className="bg-white rounded-xl p-6 shadow flex flex-col">
    <div className="font-bold mb-2">{title}</div>
    {subtitle && <div className="text-xl font-semibold mb-4">{subtitle}</div>}
    <div className="flex-1 flex items-center justify-center">{children}</div>
  </div>
);

export default ChartCard;

// --- Example: LineChart.jsx ---
// Place this in src/Components/common/LineChart.jsx
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useRef, useEffect } from 'react';

// Register all required Chart.js components ONCE
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const LineChart = ({ data, options, chartKey }) => {
  const chartRef = useRef();

  // Cleanup to prevent canvas reuse errors
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy && chartRef.current.destroy();
      }
    };
  }, [chartKey]);

  return (
    <Line
      ref={chartRef}
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        ...options,
      }}
      key={chartKey}
      height={220}
    />
  );
};

export { LineChart };

// --- Example usage in a dashboard ---
// import ChartCard from './ChartCard';
// import { LineChart } from './LineChart';
//
// <ChartCard title="Maintenance Requests">
//   <div style={{ width: '100%', height: 240 }}>
//     <LineChart data={data} options={options} chartKey={uniqueKey} />
//   </div>
// </ChartCard>
