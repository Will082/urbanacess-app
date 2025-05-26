// App.js
import { StatusBar } from 'react-native';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Navigation from './navigation';
import { COLORS } from './theme';

const App = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
        <Navigation />
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
