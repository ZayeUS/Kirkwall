import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  GridItem,
  useColorMode,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Tabs,
  TabPanels,
  TabPanel,
  useColorModeValue,
  IconButton,
  Tooltip,
  useMediaQuery,
  useDisclosure,
} from '@chakra-ui/react';
import { LineChart, BarChart } from '../../Charts/Charts.js';
import ChartWrapper from '../../Charts/ChartWrapper.js';
import {
  FaChessRook,
  FaChevronDown,
  FaPlus,
  FaMinus,
  FaTemperatureHigh,
  FaTint,
  FaWind,
  FaWater,
  FaLeaf,
  FaCloudRain,
} from 'react-icons/fa/index.esm.js';
import { keyframes } from '@emotion/react';
import { useWeatherData } from '../../WeatherDataContext.js';
import { handleChartChange } from '../../Charts/ChartUtils.js';
import { motion } from 'framer-motion';
// import { useAuth } from '../AuthComponents/AuthContext.js';
// import ChartExpandModal from '../../Charts/ChartExpandModal';
const MotionBox = motion(Box);
const MotionTabPanel = motion(TabPanel);

const MedDashboard = ({ timePeriod, statusOfAlerts }) => {
  const {
    weatherData,
    loading,
    handleTimePeriodChange,
    impriFreezerOneTempData,
    impriFreezerOneHumData,
    impriFreezerTwoTempData,
    impriFreezerTwoHumData,
    impriFreezerThreeTempData,
    impriFreezerThreeHumData,
    impriFridgeOneTempData,
    impriFridgeOneHumData,
    impriFridgeTwoTempData,
    impriFridgeTwoHumData,
    impriIncuOneTempData,
    impriIncuOneHumData,
    impriIncuTwoTempData,
    impriIncuTwoHumData,
    chartData,
  } = useWeatherData();

  const [imFreezerOneTempChartType, setImFreezerOneTempChartType] = useState('');
  const [imFreezerOneHumChartType, setImFreezerOneHumChartType] = useState('');
  const [imFreezerTwoTempChartType, setImFreezerTwoTempChartType] = useState('');
  const [imFreezerTwoHumChartType, setImFreezerTwoHumChartType] = useState('');
  const [imFreezerThreeTempChartType, setImFreezerThreeTempChartType] = useState('');
  const [imFreezerThreeHumChartType, setImFreezerThreeHumChartType] = useState('');
  const [imFridgeOneTempChartType, setImFridgeOneTempChartType] = useState('');
  const [imFridgeOneHumChartType, setImFridgeOneHumChartType] = useState('');
  const [imFridgeTwoTempChartType, setImFridgeTwoTempChartType] = useState('');
  const [imFridgeTwoHumChartType, setImFridgeTwoHumChartType] = useState('');
  const [imIncubatorOneTempChartType, setImIncubatorOneTempChartType] = useState('');
  const [imIncubatorOneHumChartType, setImIncubatorOneHumChartType] = useState('');
  const [imIncubatorTwoTempChartType, setImIncubatorTwoTempChartType] = useState('');
  const [imIncubatorTwoHumChartType, setImIncubatorTwoHumChartType] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isReady, setIsReady] = useState(false);

  const [visibleCharts, setVisibleCharts] = useState({
    impriMed: ['FreezerOneTemp', 'FreezerOneHum', 'FreezerTwoTemp', 'FreezerTwoHum', 'FreezerThreeTemp', 'FreezerThreeHum', 'FridgeOneTemp', 'FridgeOneHum', 'FridgeTwoTemp', 'FridgeTwoHum', 'IncubatorOneTemp', 'IncubatorOneHum', 'IncubatorTwoTemp', 'IncubatorTwoHum'],
  });

  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  const { colorMode } = useColorMode();

  const updateChartTypes = (chartData) => {
    chartData.forEach(chart => {
      switch (chart.metric) {
        case 'imFreezerOneTemp':
          setImFreezerOneTempChartType(chart.type);
          break;
        case 'imFreezerOneHum':
          setImFreezerOneHumChartType(chart.type);
          break;
        case 'imFreezerTwoTemp':
          setImFreezerTwoTempChartType(chart.type);
          break;
        case 'imFreezerTwoHum':
          setImFreezerTwoHumChartType(chart.type);
          break;
        case 'imFreezerThreeTemp':
          setImFreezerThreeTempChartType(chart.type);
          break;
        case 'imFreezerThreeHum':
          setImFreezerThreeHumChartType(chart.type);
          break;
        case 'imFridgeOneTemp':
          setImFridgeOneTempChartType(chart.type);
          break;
        case 'imFridgeOneHum':
          setImFridgeOneHumChartType(chart.type);
          break;
        case 'imFridgeTwoTemp':
          setImFridgeTwoTempChartType(chart.type);
          break;
        case 'imFridgeTwoHum':
          setImFridgeTwoHumChartType(chart.type);
          break;
        case 'imIncubatorOneTemp':
          setImIncubatorOneTempChartType(chart.type);
          break;
        case 'imIncubatorOneHum':
          setImIncubatorOneHumChartType(chart.type);
          break;
        case 'imIncubatorTwoTemp':
          setImIncubatorTwoTempChartType(chart.type);
          break;
        case 'imIncubatorTwoHum':
          setImIncubatorTwoHumChartType(chart.type);
          break;
        default:
          break;
      }
    });
  };

  useEffect(() => {
    if (chartData.length > 0) {
      updateChartTypes(chartData);
      // console.log('chartData:', chartData);
    }
  }, [chartData]);

  const showChart = (section, chart) => {
    setVisibleCharts(prevState => ({
      ...prevState,
      [section]: [...prevState[section], chart],
    }));
  };

  const hideChart = (section, chart) => {
    setVisibleCharts(prevState => ({
      ...prevState,
      [section]: prevState[section].filter(item => item !== chart),
    }));
  };


  useEffect(() => {
    setIsReady(false);
    if (weatherData.length > 0) {
      setIsReady(true);
    }
  }, [weatherData]);

  const toggleChartVisibility = (section, chart) => {
    setVisibleCharts(prevState => {
      const newSectionCharts = prevState[section].includes(chart)
        ? prevState[section].filter(item => item !== chart)
        : [...prevState[section], chart];
      return { ...prevState, [section]: newSectionCharts };
    });
  };

  const getLogoColor = () => (colorMode === 'light' ? 'black' : 'white');

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
          color={getLogoColor()}
        />
      </Flex>
    );
  }

  const ChartToggleButton = ({ isVisible, onClick, chart, icon }) => (
    <Tooltip label={isVisible ? `Hide ${chart}` : `Show ${chart}`}>
      <IconButton
        icon={isVisible ? <FaMinus /> : <FaPlus />}
        onClick={onClick}
        mx="1"
        bg={isVisible ? 'red.400' : 'green.400'}
        color="white"
        _hover={{ bg: isVisible ? 'red.500' : 'green.500' }}
        size="sm"
        aria-label={`${isVisible ? 'Hide' : 'Show'} ${chart}`}
      />
    </Tooltip>
  );

  const charts = {
    temperature: <FaTemperatureHigh />,
    humidity: <FaTint />,
    wind: <FaWind />,
    soilMoisture: <FaWater />,
    leafWetness: <FaLeaf />,
    rainfall: <FaCloudRain />,
  };

  return (
    <Box
      bg={colorMode === 'light' ? 'brand.50' : 'gray.700'}
      color={colorMode === 'light' ? 'black' : 'white'}
      flex="1"
      p="4"
      pt={statusOfAlerts ? '10px' : '74px'}
      width={isLargerThan768 ? 'calc(100% - 70px)' : '100%'}
      minHeight="100vh"
      display="flex"
      flexDirection="column"
    >
      <Tabs variant="soft-rounded" colorScheme="orange">
        <TabPanels>
          <MotionTabPanel
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            key="main-dashboard"
          >
            <Flex
              justifyContent={isLargerThan768 ? 'space-between' : 'center'}
              mb="2"
            >
              <Heading
                size={isLargerThan768 ? 'lg' : 'xl'}
                textDecoration={isLargerThan768 ? 'none' : 'underline'}
              >
                ImpriMed Dashboard
              </Heading>
              <Menu isOpen={isOpen}>
                <Tooltip label="Toggle Charts">
                  <MenuButton
                    as={Button}
                    bg="brand.400"
                    color="black"
                    _hover={{ bg: '#d7a247' }}
                    onClick={isOpen ? onClose : onOpen}
                    size={isLargerThan768 ? 'md' : 'sm'}
                    ml={isLargerThan768 ? '0' : '4'}
                  >
                    <FaChevronDown />
                  </MenuButton>
                </Tooltip>
                <MenuList sx={{ bg: '#212121', border: '2px' }}>
                  {['temperature', 'humidity'].map(chart => (
                    <MenuItem
                      key={chart}
                      onClick={() => toggleChartVisibility('rivercity', chart)}
                    >
                      <Flex
                        alignItems="center"
                        justifyContent={'center'}
                        w={'100%'}
                      >
                        {charts[chart]}
                        <Box ml="2">
                          {chart.charAt(0).toUpperCase() + chart.slice(1)}
                        </Box>
                      </Flex>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Flex>
            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(2, 1fr)',
              }}
              gap="6"
            >
              {visibleCharts.impriMed.includes('FreezerOneTemp') && (
              <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                <ChartWrapper
                  title="Temperature (°C)"
                  onChartChange={handleChartChange(setImFreezerOneTempChartType)}
                  weatherData={impriFreezerOneTempData}
                  metric="imFreezerOneTemp"
                  flex="1"
                  timePeriod={timePeriod}
                  display="flex"
                  flexDirection="column"
                  handleTimePeriodChange={handleTimePeriodChange}
                >
                  {imFreezerOneTempChartType === 'line' ? (
                    <LineChart
                      data={impriFreezerOneTempData}
                      metric="imFreezerOneTemp"
                      style={{ flex: 1 }}
                    />
                  ) : (
                    <BarChart
                      data={impriFreezerOneTempData}
                      metric="imFreezerOneTemp"
                      style={{ flex: 1 }}
                    />
                  )}
                </ChartWrapper>
              </GridItem>
              )}
              {visibleCharts.impriMed.includes('FreezerOneHum') && (
              <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                <ChartWrapper
                  title="Humidity (%)"
                  onChartChange={handleChartChange(setImFreezerOneHumChartType)}
                  weatherData={impriFreezerOneHumData}
                  metric="imFreezerOneHum"
                  flex="1"
                  timePeriod={timePeriod}
                  display="flex"
                  flexDirection="column"
                  handleTimePeriodChange={handleTimePeriodChange}
                >
                  {imFreezerOneHumChartType === 'line' ? (
                    <LineChart
                      data={impriFreezerOneHumData}
                      metric="imFreezerOneHum"
                      style={{ flex: 1 }}
                    />
                  ) : (
                    <BarChart
                      data={impriFreezerOneHumData}
                      metric="imFreezerOneHum"
                      style={{ flex: 1 }}
                    />
                  )}
                </ChartWrapper>
              </GridItem>
              )}
              {visibleCharts.impriMed.includes('FreezerTwoTemp') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Temperature (°C)"
                    onChartChange={handleChartChange(setImFreezerTwoTempChartType)}
                    weatherData={impriFreezerTwoTempData}
                    metric="imFreezerTwoTemp"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                  >
                    {imFreezerTwoTempChartType === 'line' ? (
                      <LineChart
                        data={impriFreezerTwoTempData}
                        metric="imFreezerTwoTemp"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriFreezerTwoTempData}
                        metric="imFreezerTwoTemp"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              )}
              {visibleCharts.impriMed.includes('FreezerTwoHum') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Humidity (%)"
                    onChartChange={handleChartChange(setImFreezerTwoHumChartType)}
                    weatherData={impriFreezerTwoHumData}
                    metric="imFreezerTwoHum"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                  >
                    {imFreezerTwoHumChartType === 'line' ? (
                      <LineChart
                        data={impriFreezerTwoHumData}
                        metric="imFreezerTwoHum"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriFreezerTwoHumData}
                        metric="imFreezerTwoHum"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              )}
              {visibleCharts.impriMed.includes('FreezerThreeTemp') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Temperature (°C)"
                    onChartChange={handleChartChange(setImFreezerThreeTempChartType)}
                    weatherData={impriFreezerThreeTempData}
                    metric="imFreezerThreeTemp"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                  >
                    {imFreezerThreeTempChartType === 'line' ? (
                      <LineChart
                        data={impriFreezerThreeTempData}
                        metric="imFreezerThreeTemp"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriFreezerThreeTempData}
                        metric="imFreezerThreeTemp"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              )}
              {visibleCharts.impriMed.includes('FreezerThreeHum') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Humidity (%)"
                    onChartChange={handleChartChange(setImFreezerThreeHumChartType)}
                    weatherData={impriFreezerThreeHumData}
                    metric="imFreezerThreeHum"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                  >
                    {imFreezerThreeHumChartType === 'line' ? (
                      <LineChart
                        data={impriFreezerThreeHumData}
                        metric="imFreezerThreeHum"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriFreezerThreeHumData}
                        metric="imFreezerThreeHum"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              )}
              {visibleCharts.impriMed.includes('FridgeOneTemp') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Temperature (°C)"
                    onChartChange={handleChartChange(setImFridgeOneTempChartType)}
                    weatherData={impriFridgeOneTempData}
                    metric="imFridgeOneTemp"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                  >
                    {imFridgeOneTempChartType === 'line' ? (
                      <LineChart
                        data={impriFridgeOneTempData}
                        metric="imFridgeOneTemp"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriFridgeOneTempData}
                        metric="imFridgeOneTemp"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              )}
              {visibleCharts.impriMed.includes('FridgeOneHum') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Humidity (%)"
                    onChartChange={handleChartChange(setImFridgeOneHumChartType)}
                    weatherData={impriFridgeOneHumData}
                    metric="imFridgeOneHum"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                  >
                    {imFridgeOneHumChartType === 'line' ? (
                      <LineChart
                        data={impriFridgeOneHumData}
                        metric="imFridgeOneHum"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriFridgeOneHumData}
                        metric="imFridgeOneHum"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              )}
              {visibleCharts.impriMed.includes('FridgeTwoTemp') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Temperature (°C)"
                    onChartChange={handleChartChange(setImFridgeTwoTempChartType)}
                    weatherData={impriFridgeTwoTempData}
                    metric="imFridgeTwoTemp"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                  >
                    {imFridgeTwoTempChartType === 'line' ? (
                      <LineChart
                        data={impriFridgeTwoTempData}
                        metric="imFridgeTwoTemp"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriFridgeTwoTempData}
                        metric="imFridgeTwoTemp"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              )}
              {visibleCharts.impriMed.includes('FridgeTwoHum') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Humidity (%)"
                    onChartChange={handleChartChange(setImFridgeTwoHumChartType)}
                    weatherData={impriFridgeTwoHumData}
                    metric="imFridgeTwoHum"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                  >
                    {imFridgeTwoHumChartType === 'line' ? (
                      <LineChart
                        data={impriFridgeTwoHumData}
                        metric="imFridgeTwoHum"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriFridgeTwoHumData}
                        metric="imFridgeTwoHum"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              )}
              {visibleCharts.impriMed.includes('IncubatorOneTemp') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Temperature (°C)"
                    onChartChange={handleChartChange(setImIncubatorOneTempChartType)}
                    weatherData={impriIncuOneTempData}
                    metric="imIncubatorOneTemp"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                  >
                    {imIncubatorOneTempChartType === 'line' ? (
                      <LineChart
                        data={impriIncuOneTempData}
                        metric="imIncubatorOneTemp"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriIncuOneTempData}
                        metric="imIncubatorOneTemp"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              )}
              {visibleCharts.impriMed.includes('IncubatorOneHum') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Humidity (%)"
                    onChartChange={handleChartChange(setImIncubatorOneHumChartType)}
                    weatherData={impriIncuOneHumData}
                    metric="imIncubatorOneHum"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                  >
                    {imIncubatorOneHumChartType === 'line' ? (
                      <LineChart
                        data={impriIncuOneHumData}
                        metric="imIncubatorOneHum"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriIncuOneHumData}
                        metric="imIncubatorOneHum"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              )}
              {visibleCharts.impriMed.includes('IncubatorTwoTemp') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Temperature (°C)"
                    onChartChange={handleChartChange(setImIncubatorTwoTempChartType)}
                    weatherData={impriIncuTwoTempData}
                    metric="imIncubatorTwoTemp"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                  >
                    {imIncubatorTwoTempChartType === 'line' ? (
                      <LineChart
                        data={impriIncuTwoTempData}
                        metric="imIncubatorTwoTemp"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriIncuTwoTempData}
                        metric="imIncubatorTwoTemp"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              )}
              {visibleCharts.impriMed.includes('IncubatorTwoHum') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Humidity (%)"
                    onChartChange={handleChartChange(setImIncubatorTwoHumChartType)}
                    weatherData={impriIncuTwoHumData}
                    metric="imIncubatorTwoHum"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                  >
                    {imIncubatorTwoHumChartType === 'line' ? (
                      <LineChart
                        data={impriIncuTwoHumData}
                        metric="imIncubatorTwoHum"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriIncuTwoHumData}
                        metric="imIncubatorTwoHum"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              )}
            </Grid>
          </MotionTabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MedDashboard;
