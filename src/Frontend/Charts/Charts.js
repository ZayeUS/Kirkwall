import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Box, Spinner, useColorMode } from '@chakra-ui/react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const processWeatherData = (data, key, timeframe) => {
  if (!data) return null;

  const filteredData = data.slice(0, timeframe).reverse();

  const chartData = {
    labels: filteredData.map(item =>
      new Date(item.message_timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    ),
    datasets: [
      {
        label: key,
        data: filteredData.map(item => item[key]),
        backgroundColor: '#fd9801',
        borderColor: '#fd9801',
        borderWidth: 1,
        pointBackgroundColor: filteredData.map((item, index) =>
          index === filteredData.length - 1 ? 'red' : '#fd9801'
        ),
        pointRadius: filteredData.map((item, index) =>
          index === filteredData.length - 1 ? 6 : 3
        ),
      },
    ],
  };
  return chartData;
};

const addBuffer = (value, percentage) => value + value * (percentage / 100);

const getYAxesLimits = (data, key) => {
  const values = data.map(item => item[key]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const buffer = 10; // 10% buffer
  return {
    min: min !== Infinity ? Math.max(min - min * (buffer / 100), 0) : 0,
    max: max !== -Infinity ? addBuffer(max, buffer) : 100,
  };
};

const defaultChartOptions = (colorMode) => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        maxRotation: 90,
        minRotation: 45,
        autoSkip: true,
        maxTicksLimit: 10,
      },
    },
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    tooltip: {
      backgroundColor: colorMode === 'light' ? '#212121' : '#f9f9f9',
      titleFont: { size: 16 },
      titleColor: colorMode === 'light' ? '#ffffff' : '#000000',
      bodyFont: { size: 16 },
      bodyColor: colorMode === 'light' ? '#ffffff' : '#000000',
      footerFont: { size: 12 },
      footerColor: colorMode === 'light' ? '#ffffff' : '#000000',
      padding: 10,
      cornerRadius: 4,
      displayColors: false,
    },
    legend: {
      display: false,
    },
  },
});

const getChartOptions = (data, metric, colorMode) => {
  const limits = getYAxesLimits(data, metric);
  return {
    ...defaultChartOptions(colorMode),
    scales: {
      ...defaultChartOptions(colorMode).scales,
      y: {
        ...defaultChartOptions(colorMode).scales.y,
        min: limits.min,
        max: limits.max,
      },
    },
  };
};

export const LineChart = ({ data, metric, timeframe }) => {
  const { colorMode } = useColorMode();
  const chartData = processWeatherData(data, metric, timeframe);
  if (!chartData) return <Spinner size="xl" />;

  const options = getChartOptions(data, metric, colorMode);

  return (
    <Box h="100%" w="100%">
      <Line data={chartData} options={options} />
    </Box>
  );
};

export const BarChart = ({ data, metric, timeframe }) => {
  const { colorMode } = useColorMode();
  const chartData = processWeatherData(data, metric, timeframe);
  if (!chartData) return <Spinner size="xl" />;

  const options = getChartOptions(data, metric, colorMode);

  return (
    <Box h="100%" w="100%">
      <Bar data={chartData} options={options} />
    </Box>
  );
};

export const PieChart = ({ data, metric }) => {
  const { colorMode } = useColorMode();
  const chartData = processWeatherData(data, metric, 24); // Default to 24 hours for pie chart
  if (!chartData) return <Spinner size="xl" />;
  return (
    <Box h="100%" w="100%">
      <Pie data={chartData} options={defaultChartOptions(colorMode)} />
    </Box>
  );
};
