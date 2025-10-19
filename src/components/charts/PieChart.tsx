import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  showLegend?: boolean;
  title?: string;
}

const PieChart: React.FC<PieChartProps> = ({ data, showLegend = true, title }) => {
  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: data.map(item => item.color || '#8B5CF6'),
        borderColor: data.map(item => item.color || '#8B5CF6'),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'bottom' as const,
      },
      title: {
        display: !!title,
        text: title,
      },
    },
  };

  return <Pie data={chartData} options={options} />;
};

export default PieChart