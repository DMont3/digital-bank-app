import React from 'react';
import { Box, useTheme } from '@mui/material';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
      backgroundColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
    }[];
  };
  title: string;
}

interface ChartOptions {
  responsive: boolean;
  plugins: {
    legend: {
      position: 'top';
    };
    title: {
      display: boolean;
      text: string;
    };
  };
}

const Chart: React.FC<ChartProps> = ({ data, title }) => {
  const theme = useTheme();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  const themedData = {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      borderColor: dataset.borderColor ? theme.palette[dataset.borderColor].main : theme.palette.primary.main,
      backgroundColor: dataset.backgroundColor ? theme.palette[dataset.backgroundColor].light : theme.palette.primary.light,
    })),
  };

  return (
    <Box>
      <Line options={options} data={themedData} />
    </Box>
  );
};

export default Chart;
