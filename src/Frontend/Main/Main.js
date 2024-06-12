import React, { useEffect, useState } from 'react';
import { Box, Center, Flex, Grid, GridItem, Spinner } from '@chakra-ui/react';
import { LineChart, BarChart } from '../Charts/Charts';
import ChartWrapper from '../Charts/ChartWrapper';

const MainContent = ({ weatherData, isMinimized }) => {
  const [tempChartType, setTempChartType] = useState('line');
  const [humidityChartType, setHumidityChartType] = useState('line');
  const [windChartType, setWindChartType] = useState('bar');
  const [rainfallChartType, setRainfallChartType] = useState('bar');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(false);
    const timer = setTimeout(() => {
      setIsReady(true);
    }, .5); // delay to let layout stabilize

    return () => clearTimeout(timer);
  }, [isMinimized]);

  const handleChartChange = (setChartType) => (newType) => {
    setChartType(newType);
  };

  if (!isReady) {
    return (
      <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      height="100vh"
    >
      {/* <Spinner size="xl" /> */}
    </Box>
    );
  }

  return (
    <Box bg="white" flex="1" p="4" height="100%" width="100%">
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="6">
        <GridItem colSpan={1}>
          <ChartWrapper
            title="Temperature Over Time (°F)"
            onChartChange={handleChartChange(setTempChartType)}
            data={weatherData}
            metric="temperature"
            flex="1"
          >
            {tempChartType === 'line' ? (
              <LineChart data={weatherData} metric="temperature" />
            ) : (
              <BarChart data={weatherData} metric="temperature" />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={1}>
          <ChartWrapper
            title="Humidity Percentage Levels"
            onChartChange={handleChartChange(setHumidityChartType)}
            data={weatherData}
            metric="percent_humidity"
            flex="1"
          >
            {humidityChartType === 'line' ? (
              <LineChart data={weatherData} metric="percent_humidity" />
            ) : (
              <BarChart data={weatherData} metric="percent_humidity" />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={1}>
          <ChartWrapper
            title="Rainfall (inches)"
            onChartChange={handleChartChange(setRainfallChartType)}
            data={weatherData}
            metric="rain_15_min_inches"
            flex="1"
          >
            {rainfallChartType === 'line' ? (
              <LineChart data={weatherData} metric="rain_15_min_inches" />
            ) : (
              <BarChart data={weatherData} metric="rain_15_min_inches" />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={1}>
          <ChartWrapper
            title="Wind Speed (mph)"
            onChartChange={handleChartChange(setWindChartType)}
            data={weatherData}
            metric="wind_speed"
            flex="1"
          >
            {windChartType === 'line' ? (
              <LineChart data={weatherData} metric="wind_speed" />
            ) : (
              <BarChart data={weatherData} metric="wind_speed" />
            )}
          </ChartWrapper>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default MainContent;
