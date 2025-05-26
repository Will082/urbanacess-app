// navigation/MainNavigator.js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../theme';
import DashboardScreen from '../components/screens/main/DashboardScreen';
import NovaOcorrenciaScreen from '../components/screens/main/NovaOcorrenciaScreen';
import MinhasOcorrenciasScreen from '../components/screens/main/MinhasOcorrenciasScreen';
import ValidacaoScreen from '../components/screens/main/ValidacaoScreen';
import PerfilScreen from '../components/screens/main/PerfilScreen';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Início') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Nova Ocorrência') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Minhas Ocorrências') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Validação') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
      })}
    >
      <Tab.Screen name="Início" component={DashboardScreen} />
      <Tab.Screen name="Nova Ocorrência" component={NovaOcorrenciaScreen} />
      <Tab.Screen name="Minhas Ocorrências" component={MinhasOcorrenciasScreen} />
      <Tab.Screen name="Validação" component={ValidacaoScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
