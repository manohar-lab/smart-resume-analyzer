import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface MatchScoreChartProps {
  scores: { jobTitle: string; score: number }[];
}

const MatchScoreChart: React.FC<MatchScoreChartProps> = ({ scores }) => {
  const data = {
    labels: scores.map(score => score.jobTitle),
    datasets: [
      {
        label: 'Match Score',
        data: scores.map(score => score.score),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Job Match Scores',
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default MatchScoreChart;