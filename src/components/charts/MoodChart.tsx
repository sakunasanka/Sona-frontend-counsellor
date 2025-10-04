import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { MoodAnalysisResponse } from '../../api/counsellorAPI';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface MoodChartProps {
  moodData: MoodAnalysisResponse;
  type: 'line' | 'distribution';
  className?: string;
}

const MoodChart: React.FC<MoodChartProps> = ({ moodData, type, className = '' }) => {
  const moodColors = {
    'very_sad': '#ef4444',
    'sad': '#f97316',
    'neutral': '#eab308',
    'happy': '#22c55e',
    'very_happy': '#16a34a'
  };

  const moodLabels = {
    'very_sad': 'Very Sad',
    'sad': 'Sad',
    'neutral': 'Neutral',
    'happy': 'Happy',
    'very_happy': 'Very Happy'
  };

  const getMoodScore = (mood: string): number => {
    const scores = {
      'very_sad': 1,
      'sad': 2,
      'neutral': 3,
      'happy': 4,
      'very_happy': 5
    };
    return scores[mood as keyof typeof scores] || 3;
  };

  if (type === 'distribution') {
    const chartData = {
      labels: Object.keys(moodData.moodDistribution).map(mood => moodLabels[mood as keyof typeof moodLabels] || mood),
      datasets: [
        {
          data: Object.values(moodData.moodDistribution),
          backgroundColor: Object.keys(moodData.moodDistribution).map(mood => moodColors[mood as keyof typeof moodColors] || '#6b7280'),
          borderColor: '#ffffff',
          borderWidth: 2,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom' as const,
        },
        title: {
          display: true,
          text: 'Mood Distribution',
          font: {
            size: 16,
            weight: 'bold' as const,
          },
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              const total = context.dataset.data.reduce((sum: number, value: number) => sum + value, 0);
              const percentage = ((context.raw / total) * 100).toFixed(1);
              return `${context.label}: ${context.raw} entries (${percentage}%)`;
            }
          }
        }
      },
    };

    return (
      <div className={`bg-white p-6 rounded-lg shadow-sm ${className}`}>
        <Doughnut data={chartData} options={options} />
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Total Entries: <span className="font-semibold">{moodData.totalEntries}</span></p>
          <p>Average Score: <span className="font-semibold">{moodData.averageMoodScore}/5</span></p>
        </div>
      </div>
    );
  }

  // Line chart for mood trends
  const sortedMoods = [...moodData.moodTrends].sort((a, b) => 
    new Date(a.local_date).getTime() - new Date(b.local_date).getTime()
  );

  const last30Days = sortedMoods.slice(-30); // Show last 30 entries for better readability

  const chartData = {
    labels: last30Days.map(mood => {
      const date = new Date(mood.local_date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Mood Score',
        data: last30Days.map(mood => getMoodScore(mood.mood)),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: last30Days.map(mood => moodColors[mood.mood as keyof typeof moodColors] || '#6b7280'),
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Mood Trends (Last 30 Entries)',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          title: function(context: any) {
            const index = context[0].dataIndex;
            const date = new Date(last30Days[index].local_date);
            return date.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
          },
          label: function(context: any) {
            const index = context.dataIndex;
            const mood = last30Days[index].mood;
            const moodLabel = moodLabels[mood as keyof typeof moodLabels] || mood;
            return `Mood: ${moodLabel} (${context.raw}/5)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: function(value: any) {
            const labels = ['', 'Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'];
            return labels[value] || value;
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm ${className}`}>
      <Line data={chartData} options={options} />
      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <p>Showing last {last30Days.length} entries</p>
        {moodData.lastUpdated && (
          <p>Last updated: {new Date(moodData.lastUpdated).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
};

export default MoodChart;