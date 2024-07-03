import React from 'react';
import { Box, Heading, Divider, Spinner, Text, Flex } from '@chakra-ui/react';
import MiniDashboard from '../../Charts/ChartDashboard';
import ChartWrapper from '../../Charts/ChartWrapper';
import { BarChart, LineChart } from '../../Charts/Charts';
import { useWeatherData } from '../../WeatherDataContext';
import { FaChessRook } from 'react-icons/fa';
import { keyframes } from '@emotion/react';
import { useEffect, useState } from 'react';

export default function HumiditySensors() {

  const { weatherData, humidityData, loading } = useWeatherData();

  const [isReady, setIsReady] = useState(false);


  useEffect(() => {
    setIsReady(false);
    if (weatherData.length > 0) {
      setIsReady(true);
    }
  }, [weatherData]);

  const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `;

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100%">
        <Box
          as={FaChessRook}
          animation={`${spin} infinite 2s linear`}
          fontSize="6xl"
          color="black"
        />
      </Flex>
    );
  }

  return (
    <Box p="4" width={'100%'} height={'100%'} pt={'64px'}>
      <Heading size="xl" textAlign={'center'} mb={'4'}>
        Humidity Sensors
      </Heading>
      <Box width="100%">
        <MiniDashboard metric="percent_humidity" weatherData={humidityData || weatherData} />
      </Box>
      <ChartWrapper title="Humidity (%)" weatherData={humidityData || weatherData}>
        <BarChart data={humidityData || weatherData} metric="percent_humidity" />
      </ChartWrapper>
      <Divider
        my={'8'}
        borderColor="#212121"
        borderWidth="4px"
        borderRadius={'full'}
      />
      <ChartWrapper title="Humidity (%)" weatherData={humidityData || weatherData}>
        <LineChart data={humidityData || weatherData} metric="percent_humidity" />
      </ChartWrapper>
    </Box>
  );
}
