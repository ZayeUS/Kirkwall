import {
  Box,
  Grid,
  GridItem,
  Flex,
  useColorMode,
  Text,
} from '@chakra-ui/react';
import { LineChart, BarChart } from '../Charts/Charts';
import ChartWrapper from '../Charts/ChartWrapper';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWeatherData } from '../WeatherDataContext';
import { FaChessRook } from 'react-icons/fa';
import { keyframes } from '@emotion/react';

const MotionGridItem = motion(GridItem);

const Main = ({ sidebarCollapsed }) => {
  const { weatherData, loading, error, fetchData } = useWeatherData();
  const [tempChartType, setTempChartType] = useState('line');
  const [humidityChartType, setHumidityChartType] = useState('line');
  const [windChartType, setWindChartType] = useState('bar');
  const [rainfallChartType, setRainfallChartType] = useState('bar');

  const { colorMode } = useColorMode();

  useEffect(() => {
    fetchData();
  }, [sidebarCollapsed, fetchData]);

  const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `;

  return (
    <Box
      bg={colorMode === 'light' ? 'white' : 'gray.800'}
      color={colorMode === 'light' ? 'black' : 'white'}
      flex="1"
      p="4"
      mt="10px"
      ml={sidebarCollapsed ? '80px' : '250px'}
      transition="margin-left 0.5s, width 0.5s"
      position="relative"
      overflowY="auto"
      height="calc(100vh - 64px)"
      maxWidth="100%"
    >
      {loading ? (
        <Flex justify="center" align="center" height="100%">
          <Box
            as={FaChessRook}
            animation={`${spin} infinite 2s linear`}
            fontSize="6xl"
            color="black"
            style={{ filter: 'drop-shadow(0 0 5px gold)' }}
          />
          <Text mt="4" fontSize="lg" color="teal.500">
            Loading...
          </Text>
        </Flex>
      ) : error ? (
        <Flex justify="center" align="center" height="100%">
          <Text mt="4" fontSize="lg" color="red.500">
            {error}
          </Text>
        </Flex>
      ) : (
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
          gap="6"
          height="100%"
          alignItems="start"
        >
          <MotionGridItem
            colSpan={1}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ChartWrapper
              title="Temperature (°F)"
              onChartChange={setTempChartType}
              data={weatherData}
              metric="temperature"
              fetchData={fetchData}
            >
              {tempChartType === 'line' ? (
                <LineChart data={weatherData} metric="temperature" />
              ) : (
                <BarChart data={weatherData} metric="temperature" />
              )}
            </ChartWrapper>
          </MotionGridItem>
          <MotionGridItem
            colSpan={1}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ChartWrapper
              title="Humidity"
              onChartChange={setHumidityChartType}
              data={weatherData}
              metric="percent_humidity"
              fetchData={fetchData}
            >
              {humidityChartType === 'line' ? (
                <LineChart data={weatherData} metric="percent_humidity" />
              ) : (
                <BarChart data={weatherData} metric="percent_humidity" />
              )}
            </ChartWrapper>
          </MotionGridItem>
          <MotionGridItem
            colSpan={1}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ChartWrapper
              title="Rainfall (inches)"
              onChartChange={setRainfallChartType}
              data={weatherData}
              metric="rain_15_min_inches"
              fetchData={fetchData}
            >
              {rainfallChartType === 'line' ? (
                <LineChart data={weatherData} metric="rain_15_min_inches" />
              ) : (
                <BarChart data={weatherData} metric="rain_15_min_inches" />
              )}
            </ChartWrapper>
          </MotionGridItem>
          <MotionGridItem
            colSpan={1}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <ChartWrapper
              title="Wind Speed (mph)"
              onChartChange={setWindChartType}
              data={weatherData}
              metric="wind_speed"
              fetchData={fetchData}
            >
              {windChartType === 'line' ? (
                <LineChart data={weatherData} metric="wind_speed" />
              ) : (
                <BarChart data={weatherData} metric="wind_speed" />
              )}
            </ChartWrapper>
          </MotionGridItem>
        </Grid>
      )}
    </Box>
  );
};

export default Main;
