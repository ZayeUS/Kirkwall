import React from 'react';
import { Box, Text, Flex, Spinner } from '@chakra-ui/react';
import { useWeatherData } from '../WeatherDataContext';

const getLabelForMetric = (metric) => {
  switch (metric) {
    case 'temperature':
      return { label: '°F', addSpace: false };
    case 'percent_humidity':
      return { label: '% Humidity', addSpace: false };
    case 'rain_15_min_inches':
      return { label: 'inches', addSpace: true };
    case 'wind_speed':
      return { label: 'MPH', addSpace: true };
    default:
      return { label: '', addSpace: false };
  }
};

const ChartDetails = ({ chartType, metric }) => {
  const { weatherData, loading, error } = useWeatherData();

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100%">
        <Spinner size="xl" />
        <Text mt="4" fontSize="lg" color="teal.500">
          Loading...
        </Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" height="100%">
        <Text mt="4" fontSize="lg" color="red.500">
          {error}
        </Text>
      </Flex>
    );
  }

  const currentData = weatherData.map((data) => data[metric]);
  const min = Math.min(...currentData);
  const max = Math.max(...currentData);
  const mostRecentValue = currentData[currentData.length - 1];

  const calculateTimePeriod = (dataLength) => {
    const totalMinutes = dataLength * 5;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const timePeriod = calculateTimePeriod(currentData.length - 1);
  const { label, addSpace } = getLabelForMetric(metric);
  const formatValue = (value) => `${value}${addSpace ? ' ' : ''}${label}`;

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={2}
        border="1px solid"
        borderColor="#212121"
        borderRadius="md"
        boxShadow="md"
      >
        <Text fontSize="2xl" fontWeight="bold">
          {formatValue(mostRecentValue)}
        </Text>
        <Text>Current Value</Text>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={2}
        border="1px solid"
        borderColor="#212121"
        borderRadius="md"
        boxShadow="md"
        mt={3}
      >
        <Text fontSize="2xl" fontWeight="bold">
          {formatValue(min)}
        </Text>
        <Text>Low</Text>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={2}
        border="1px solid"
        borderColor="#212121"
        borderRadius="md"
        boxShadow="md"
        mt={3}
      >
        <Text fontSize="2xl" fontWeight="bold">
          {formatValue(max)}
        </Text>
        <Text>High</Text>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={2}
        border="1px solid"
        borderColor="#212121"
        borderRadius="md"
        boxShadow="md"
        mt={3}
      >
        <Flex alignItems="center">
          <Text fontSize="2xl" fontWeight="bold">
            {timePeriod}
          </Text>
        </Flex>
        <Text>Time Period</Text>
      </Box>
    </Box>
  );
};

export default ChartDetails;
