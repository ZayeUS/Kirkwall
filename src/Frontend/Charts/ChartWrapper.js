import {
  Box,
  Button,
  Flex,
  Text,
  IconButton,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  useToast,
  useColorMode,
  Spinner,
} from '@chakra-ui/react';
import { FaCog, FaChessRook } from 'react-icons/fa';
import { BsBarChartFill } from 'react-icons/bs';
import { FaChartBar, FaChartLine } from 'react-icons/fa';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ChartDetails from './ChartDetails';
import axios from 'axios';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const ChartWrapper = ({ title, children, onChartChange, metric, onTimeframeChange, data, fetchData }) => {
  const [chartType, setChartType] = useState('bar');
  const [showIcons, setShowIcons] = useState(true);
  const location = useLocation();
  const toast = useToast();
  const { colorMode } = useColorMode();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [highThreshold, setHighThreshold] = useState('');
  const [lowThreshold, setLowThreshold] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem(`chartSettings_${title}`));
    if (savedSettings) {
      setPhoneNumber(savedSettings.phoneNumber);
      setHighThreshold(savedSettings.highThreshold);
      setLowThreshold(savedSettings.lowThreshold);
    }
  }, [title]);

  const changeChartType = (type) => {
    setChartType(type);
    if (onChartChange) {
      onChartChange(type);
    }
  };

  const restrictedRoutes = useMemo(() => [
    '/TempSensors',
    '/HumiditySensors',
    '/SoilMoistureSensors',
    '/WindSensors',
    '/RainSensors'
  ], []);

  useEffect(() => {
    setShowIcons(!restrictedRoutes.includes(location.pathname));
  }, [location.pathname, restrictedRoutes]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleFormSubmit = () => {
    let formattedPhoneNumber = phoneNumber.startsWith('+1') ? phoneNumber : `+1${phoneNumber}`;

    const chartSettings = {
      phoneNumber: formattedPhoneNumber,
      highThreshold: parseFloat(highThreshold),
      lowThreshold: parseFloat(lowThreshold),
    };

    localStorage.setItem(`chartSettings_${title}`, JSON.stringify(chartSettings));

    toast({
      title: "Settings saved.",
      description: "Your chart settings have been saved successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    handleCloseModal();
  };

  const sendSMSAlert = useCallback(async (to, body) => {
    console.log('Sending SMS to:', to, 'with body:', body);
    try {
      const response = await axios.post('/send-sms', { to, body });
      console.log('SMS response:', response.data);
      toast({
        title: "Alert sent.",
        description: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error sending alert:', error);
      toast({
        title: "Error sending alert.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  const checkThresholdExceed = useCallback(() => {
    console.log('Checking thresholds for', title);
    const chartSettings = JSON.parse(localStorage.getItem(`chartSettings_${title}`));
    if (chartSettings) {
      const { phoneNumber, highThreshold, lowThreshold } = chartSettings;
      const lastValue = data[data.length - 1][metric];
      console.log('Last value:', lastValue, 'High threshold:', highThreshold, 'Low threshold:', lowThreshold);
      if (lastValue > highThreshold || lastValue < lowThreshold) {
        const message = `${title} has exceeded the threshold. Current value: ${lastValue}`;
        sendSMSAlert(phoneNumber, message);
      }
    }
  }, [data, metric, sendSMSAlert, title]);

  useInterval(() => {
    setLoading(true);
    fetchData().finally(() => {
      setLoading(false);
      checkThresholdExceed();
    });
  }, 300000);

  const iconSize = '24';

  const getBackgroundColor = (colorMode) => (colorMode === 'light' ? '#f9f9f9' : '#303030');

  return (
    <Box
      border="1px"
      borderColor="#fd9801"
      borderRadius="md"
      boxShadow="md"
      p="6"
      pb="12"
      bg={getBackgroundColor(colorMode)}
      h={{ base: '400px', md: '500px' }}
      w="100%"
      overflow="hidden"
    >
      <Flex justify="space-between" mb="4" height={{ base: 'auto', md: '40px' }} alignItems="center">
        <Box
          fontSize={{ base: 'lg', md: 'xl' }}
          fontWeight="bold"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          overflow="hidden"
          maxWidth="80%"
        >
          {title}
        </Box>
        {showIcons && (
          <Flex>
            <Popover>
              <Tooltip label="Customize">
                <Box>
                  <PopoverTrigger>
                    <Box>
                      <IconButton
                        icon={<FaCog />}
                        variant="outline"
                        colorScheme="#212121"
                        size="sm"
                        mr="2"
                      />
                    </Box>
                  </PopoverTrigger>
                </Box>
              </Tooltip>
              <PopoverContent borderColor={'#212121'}>
                <PopoverCloseButton color={'white'} size={"lg"} />
                <PopoverHeader fontWeight="bold" fontSize={'xl'} bg={'#fd9801'} color={'white'}>Customize Chart</PopoverHeader>
                <PopoverBody>
                  <Text fontWeight="bold" fontSize={'lg'} py={2} textAlign={"center"}>Select Chart Type</Text>
                  <Button mr={2} mb={2} borderRadius={"md"} border={"1px"} color={"#fd9801"} bg={"white"} borderColor={"#212121"} width={"100%"} onClick={() => changeChartType('line')} leftIcon={<FaChartLine size={iconSize} />}>LINE</Button>
                  <Button mr={2} borderRadius={"md"} border={"1px"} color={"#fd9801"} bg={"white"} borderColor={"#212121"} width={"100%"} onClick={() => changeChartType('bar')} leftIcon={<FaChartBar size={iconSize} />}>BAR</Button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <Popover>
              <Tooltip label="Details">
                <Box>
                  <PopoverTrigger>
                    <Box>
                      <IconButton
                        icon={<BsBarChartFill />}
                        variant="outline"
                        colorScheme="#212121"
                        size="sm"
                        mr="2"
                      />
                    </Box>
                  </PopoverTrigger>
                </Box>
              </Tooltip>
              <PopoverContent borderColor={'#212121'}>
                <PopoverCloseButton color={'white'} size={"lg"} />
                <PopoverHeader fontWeight="bold" fontSize={'xl'} bg={'#fd9801'} color={'white'}> Chart Details</PopoverHeader>
                <PopoverBody>
                  <ChartDetails chartType={chartType} metric={metric} />
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <IconButton icon={<FaChessRook />} onClick={handleOpenModal} variant="outline" colorScheme="#212121" size="sm" ml="2" />
          </Flex>
        )}
      </Flex>
      {loading && (
        <Flex justify="center" align="center" height="100%">
          <Spinner size="xl" />
          <Text mt="4" fontSize="lg" color="teal.500">
            Updating...
          </Text>
        </Flex>
      )}
      {!loading && children}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Thresholds</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>High Threshold</FormLabel>
              <Input
                type="number"
                value={highThreshold}
                onChange={(e) => setHighThreshold(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Low Threshold</FormLabel>
              <Input
                type="number"
                value={lowThreshold}
                onChange={(e) => setLowThreshold(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleFormSubmit}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ChartWrapper;
