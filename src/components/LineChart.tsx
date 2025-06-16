'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define the type for a record
interface Record {
  date: string; // ISO date string
  amount: number; // Hours slept
}

const LineChart = ({ records }: { records: Record[] }) => {
  // Prepare data for the chart
  const data = {
    labels: records.map((record) => new Date(record.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Hours Slept',
        data: records.map((record) => record.amount),
        borderColor: 'rgba(75, 192, 192, 1)', // Primary line color
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fill color under line
        pointBackgroundColor: records.map((record) =>
          record.amount < 7 
            ? 'rgba(255, 99, 132, 1)' 
            : 'rgba(75, 192, 192, 1)'
        ),
        pointBorderColor: 'white',
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointRadius: 3,
        pointHitRadius: 10,
        fill: true,
        tension: 0.3, // Adds slight curve to the line
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        // position: 'top' as const,
        display:false
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: false,
          text: 'Date',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
          color: '#2c3e50',
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#7f8c8d',
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Hours Slept',
          font: {
            size: 10,
            weight: 'bold' as const,
          },
          color: '#2c3e50',
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#7f8c8d',
        },
        grid: {
          color: '#e0e0e0',
        },
        suggestedMin: 4,
        suggestedMax: 10,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;