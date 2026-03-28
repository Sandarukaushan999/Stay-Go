import React, { useRef, useEffect } from 'react';
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

// Register all required elements ONCE
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

  useEffect(() => {
    // Cleanup to prevent canvas reuse errors
    return () => {
      if (chartRef.current && chartRef.current.destroy) {
        chartRef.current.destroy();
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

export default LineChart;
