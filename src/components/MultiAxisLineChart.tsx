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
  TooltipItem,
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

interface Record {
  date: string;
  amount: number;
  secondaryAmount?: number;
}

const MultiAxisLineChart = ({ records }: { records: Record[] }) => {
  const data = {
    labels: records.map((record) => new Date(record.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Primary Data (Hours Slept)',
        data: records.map((record) => record.amount),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        yAxisID: 'y',
        pointBackgroundColor: records.map((record) =>
          record.amount < 7 
            ? 'rgba(255, 99, 132, 1)' 
            : 'rgba(75, 192, 192, 1)'
        ),
        pointBorderColor: 'white',
        pointRadius: 3,
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Secondary Data',
        data: records.map((record) => record.secondaryAmount || 0),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        yAxisID: 'y1',
        pointRadius: 3,
        borderDash: [5, 5],
        tension: 0.3,
      }
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'line'>) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2);
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
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
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Primary Scale',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
          color: 'rgba(75, 192, 192, 1)',
        },
        suggestedMin: 4,
        suggestedMax: 10,
        grid: {
          drawOnChartArea: false,
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Secondary Scale',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
          color: 'rgba(153, 102, 255, 1)',
        },
        grid: {
          drawOnChartArea: false,
        },
      }
    },
  };

  return <Line data={data} options={options} />;
};

export default MultiAxisLineChart;