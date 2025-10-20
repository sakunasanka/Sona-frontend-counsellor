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
  BarElement,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { PHQ9AnalysisResponse } from '../../api/counsellorAPI';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface PHQ9ChartProps {
  phq9Data: PHQ9AnalysisResponse;
  type: 'line' | 'severity-distribution' | 'score-comparison';
  className?: string;
}

const PHQ9Chart: React.FC<PHQ9ChartProps> = ({ phq9Data, type, className = '' }) => {
  const severityColors = {
    'Minimal': '#22c55e',
    'Mild': '#eab308', 
    'Moderate': '#f97316',
    'Moderately Severe': '#ef4444',
    'Severe': '#dc2626'
  };

  const getSeverityColor = (severity: string): string => {
    return severityColors[severity as keyof typeof severityColors] || '#6b7280';
  };

  if (type === 'severity-distribution') {
    const chartData = {
      labels: Object.keys(phq9Data.severityDistribution),
      datasets: [
        {
          data: Object.values(phq9Data.severityDistribution),
          backgroundColor: Object.keys(phq9Data.severityDistribution).map(severity => 
            getSeverityColor(severity)
          ),
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
          text: 'Depression Severity Distribution',
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
              return `${context.label}: ${context.raw} assessments (${percentage}%)`;
            }
          }
        }
      },
    };

    return (
      <div className={`bg-white p-6 rounded-lg shadow-sm ${className}`}>
        <Doughnut data={chartData} options={options} />
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Total Assessments: <span className="font-semibold">{phq9Data.totalEntries}</span></p>
          <p>Average Score: <span className="font-semibold">{phq9Data.averageScore}/27</span></p>
        </div>
      </div>
    );
  }

  if (type === 'score-comparison') {
    // Bar chart showing score ranges
    const scoreRanges = {
      'Minimal (0-4)': 0,
      'Mild (5-9)': 0,
      'Moderate (10-14)': 0,
      'Mod. Severe (15-19)': 0,
      'Severe (20-27)': 0
    };

    phq9Data.scoreHistory.forEach(entry => {
      const score = entry.score;
      if (score <= 4) scoreRanges['Minimal (0-4)']++;
      else if (score <= 9) scoreRanges['Mild (5-9)']++;
      else if (score <= 14) scoreRanges['Moderate (10-14)']++;
      else if (score <= 19) scoreRanges['Mod. Severe (15-19)']++;
      else scoreRanges['Severe (20-27)']++;
    });

    const chartData = {
      labels: Object.keys(scoreRanges),
      datasets: [
        {
          label: 'Number of Assessments',
          data: Object.values(scoreRanges),
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(234, 179, 8, 0.8)', 
            'rgba(249, 115, 22, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(220, 38, 38, 0.8)'
          ],
          borderColor: [
            '#22c55e',
            '#eab308',
            '#f97316', 
            '#ef4444',
            '#dc2626'
          ],
          borderWidth: 2,
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
          text: 'PHQ-9 Score Distribution',
          font: {
            size: 16,
            weight: 'bold' as const,
          },
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              return `${context.raw} assessment(s) in this range`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
          title: {
            display: true,
            text: 'Number of Assessments'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Depression Severity Range'
          }
        }
      },
    };

    return (
      <div className={`bg-white p-6 rounded-lg shadow-sm ${className}`}>
        <Bar data={chartData} options={options} />
      </div>
    );
  }

  // Line chart for score trends
  const last10Entries = phq9Data.scoreHistory.slice(-10); // Show last 10 for readability

  const chartData = {
    labels: last10Entries.map(entry => {
      const date = new Date(entry.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'PHQ-9 Score',
        data: last10Entries.map(entry => entry.score),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: last10Entries.map(entry => getSeverityColor(entry.severity)),
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
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
        text: 'PHQ-9 Score Trends (Last 10 Assessments)',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          title: function(context: any) {
            const index = context[0].dataIndex;
            const date = new Date(last10Entries[index].date);
            return date.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
          },
          label: function(context: any) {
            const index = context.dataIndex;
            const entry = last10Entries[index];
            return [
              `Score: ${entry.score}/27`,
              `Severity: ${entry.severity}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 27,
        ticks: {
          stepSize: 3,
        },
        title: {
          display: true,
          text: 'PHQ-9 Score'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Assessment Date'
        },
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
        <p>Showing last {last10Entries.length} assessments</p>
        {phq9Data.lastUpdated && (
          <p>Last assessment: {new Date(phq9Data.lastUpdated).toLocaleDateString()}</p>
        )}
      </div>
      
      {/* Severity Scale Reference */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h5 className="text-sm font-medium text-gray-700 mb-2">PHQ-9 Severity Scale:</h5>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2 py-1 rounded" style={{backgroundColor: '#22c55e', color: 'white'}}>0-4: Minimal</span>
          <span className="px-2 py-1 rounded" style={{backgroundColor: '#eab308', color: 'white'}}>5-9: Mild</span>
          <span className="px-2 py-1 rounded" style={{backgroundColor: '#f97316', color: 'white'}}>10-14: Moderate</span>
          <span className="px-2 py-1 rounded" style={{backgroundColor: '#ef4444', color: 'white'}}>15-19: Mod. Severe</span>
          <span className="px-2 py-1 rounded" style={{backgroundColor: '#dc2626', color: 'white'}}>20-27: Severe</span>
        </div>
      </div>
    </div>
  );
};

export default PHQ9Chart;