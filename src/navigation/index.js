// navigation/index.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Import Stack Navigator
import { useAuth } from '../context/AuthContext';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator'; // This is the Tab Navigator
import DetalheOcorrenciaScreen from '../components/screens/main/DetalheOcorrenciaScreen'; // Import the new screen

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { isAuthenticated, loading } = useAuth();

  // If loading, show nothing or a splash screen
  if (loading) {
    return null; // Or a loading component
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        // If authenticated, use a Stack Navigator that includes the Main (Tab) Navigator and Detail screens
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainNavigator} />
          <Stack.Screen 
            name="DetalheOcorrencia" 
            component={DetalheOcorrenciaScreen} 
            // Optionally configure header here if needed, or rely on the screen's internal Header
            // options={{ headerShown: true, title: 'Detalhes da Ocorrência' }} 
          />
          {/* Add other stack screens accessible when authenticated here */}
        </Stack.Navigator>
      ) : (
        // If not authenticated, show the Auth Navigator
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

export default Navigation;

