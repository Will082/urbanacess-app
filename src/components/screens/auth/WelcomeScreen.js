// components/screens/auth/WelcomeScreen.js
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AccessibleText from '../../common/AccessibleText';
import AccessibleButton from '../../common/AccessibleButton';
import { COLORS, SPACING, BORDER_RADIUS } from '../../../theme';

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/images/logo.png')} 
            style={styles.logo}
            accessibilityLabel="Logo UrbanAccess"
            resizeMode="contain"
          />
          <AccessibleText variant="titleLarge" color="light" style={styles.title}>
            UrbanAccess
          </AccessibleText>
        </View>
        
        <AccessibleText color="light" style={styles.description}>
          Facilitando a denúncia de problemas de acessibilidade em vias públicas.
        </AccessibleText>
        
        <View style={styles.buttonContainer}>
          <AccessibleButton 
            title="Entrar" 
            onPress={() => navigation.navigate('Login')}
            style={styles.button}
          />
          
          <AccessibleButton 
            title="Cadastrar-se" 
            type="secondary" 
            onPress={() => navigation.navigate('Cadastro')}
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.dark,
  },
  content: {
    flex: 1,
    padding: SPACING.large,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xlarge,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: SPACING.medium,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: SPACING.xlarge,
    paddingHorizontal: SPACING.large,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    marginBottom: SPACING.medium,
    width: '100%',
  },
});

export default WelcomeScreen;
