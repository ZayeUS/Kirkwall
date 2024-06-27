import React, { useState } from 'react';
import { ChakraProvider, Box, Flex } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './Frontend/AuthComponents/AuthContext';
import ProtectedRoute from './Frontend/AuthComponents/ProtectedRoute';
import SignUp from './Frontend/AuthComponents/Signup';
import Login from './Frontend/AuthComponents/Login';
import Header from './Frontend/Header/Header';
import customTheme from './Frontend/Styles/theme';
import MainContent from './Frontend/Main/Main';
import TempSensors from './Frontend/Sensors/TempSensors/TempSensors';
import SensorsMain from './Frontend/Sensors/SensorsMain/SensorsMain';
import HumiditySensors from './Frontend/Sensors/HumiditySensors/HumiditySensors';
import SoilSensors from './Frontend/Sensors/SoilSensors/SoilSensors';
import WindSensors from './Frontend/Sensors/WindSensors/WindSensor';
import RainSensors from './Frontend/Sensors/RainSensors/RainSensors';
import Sidebar from './Frontend/Sidebar/Sidebar';
import { WeatherDataProvider } from './Frontend/WeatherDataContext';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    return savedState && JSON.parse(savedState);
  });

  const handleToggleSidebar = () => {
    const newCollapsedState = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsedState);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newCollapsedState));
  };

  return (
    <ChakraProvider theme={customTheme}>
      <Router>
        <AuthProvider>
          <WeatherDataProvider>
            <QueryClientProvider client={queryClient}>
              <Flex direction="column" height="100vh" overflow="hidden">
                <Header />
                <Flex flex="1" mt="64px" overflow="hidden">
                  <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleToggleSidebar} />
                  <Box
                    flex="1"
                    transition="margin-left 0.5s"
                    overflow="hidden"
                  >
                    <Routes>
                      <Route path="/signup" element={<SignUp />} />
                      <Route path="/login" element={<Login />} />
                      <Route
                        path="/"
                        element={
                          <ProtectedRoute>
                            <MainContent sidebarCollapsed={sidebarCollapsed} />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/Sensors"
                        element={
                          <ProtectedRoute>
                            <SensorsMain />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/TempSensors"
                        element={
                          <ProtectedRoute>
                            <TempSensors />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/HumiditySensors"
                        element={
                          <ProtectedRoute>
                            <HumiditySensors />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/SoilMoistureSensors"
                        element={
                          <ProtectedRoute>
                            <SoilSensors />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/WindSensors"
                        element={
                          <ProtectedRoute>
                            <WindSensors />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/RainSensors"
                        element={
                          <ProtectedRoute>
                            <RainSensors />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </Box>
                </Flex>
              </Flex>
            </QueryClientProvider>
          </WeatherDataProvider>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
};

export default App;
