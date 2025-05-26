// components/screens/auth/LoginScreen.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AccessibleText from '../../common/AccessibleText';
import Input from '../../common/Input';
import AccessibleButton from '../../common/AccessibleButton';
import { COLORS, SPACING } from '../../../theme';
import { useAuth } from '../../../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  
  const handleLogin = async () => {
    if (!email || !senha) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await login(email, senha);
      // Navegação é feita automaticamente pelo contexto de autenticação
    } catch (err) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <AccessibleText variant="titleLarge" color="primary" style={styles.title}>
          Tela de Login
        </AccessibleText>
        
        {error ? (
          <AccessibleText color="error" style={styles.errorText}>
            {error}
          </AccessibleText>
        ) : null}
        
        <Input
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="Digite seu e-mail"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <Input
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          placeholder="Digite sua senha"
          secureTextEntry
        />
        
        <AccessibleButton
          title="Entrar"
          onPress={handleLogin}
          loading={loading}
          style={styles.button}
        />
        
        <AccessibleButton
          title="Cadastrar-se"
          type="secondary"
          onPress={() => navigation.navigate('Cadastro')}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  content: {
    flex: 1,
    padding: SPACING.large,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.xlarge,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: SPACING.medium,
  },
  button: {
    marginTop: SPACING.medium,
  },
});

export default LoginScreen;
