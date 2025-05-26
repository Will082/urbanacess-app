// navigation/AuthNavigator.js
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../components/screens/auth/WelcomeScreen';
import LoginScreen from '../components/screens/auth/LoginScreen';
import CadastroScreen from '../components/screens/auth/CadastroScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Cadastro" component={CadastroScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
