// components/screens/auth/CadastroScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AccessibleText from '../../common/AccessibleText';
import Input from '../../common/Input';
import AccessibleButton from '../../common/AccessibleButton';
import { COLORS, SPACING, BORDER_RADIUS } from '../../../theme'; // Removed FONTS as it's not directly used here for styling overrides
import { useAuth } from '../../../context/AuthContext';

const CadastroScreen = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { cadastrar } = useAuth();

  const handleCadastro = async () => {
    if (!nome || !cpf || !email || !telefone || !senha) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (!aceitaTermos) {
      setError('Você precisa aceitar os termos de uso');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await cadastrar(nome, cpf, email, telefone, senha);
      // Navegação é feita automaticamente pelo contexto de autenticação
    } catch (err) {
      setError(err.message || 'Erro ao criar conta. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Define label style for dark background
  const labelStyle = { color: COLORS.text.light };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <AccessibleText variant="titleLarge" color="light" style={styles.title}>
            Cadastrar
          </AccessibleText>

          {error ? (
            <AccessibleText color="error" style={styles.errorText}>
              {error}
            </AccessibleText>
          ) : null}

          <Input
            label="Nome completo"
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome completo"
            style={styles.input}
            labelStyle={labelStyle} // Apply light label style
          />

          <Input
            label="CPF"
            value={cpf}
            onChangeText={setCpf}
            placeholder="000.000.000-00"
            keyboardType="numeric"
            style={styles.input}
            labelStyle={labelStyle} // Apply light label style
          />

          <Input
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            labelStyle={labelStyle} // Apply light label style
          />

          <Input
            label="Telefone"
            value={telefone}
            onChangeText={setTelefone}
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
            style={styles.input}
            labelStyle={labelStyle} // Apply light label style
          />

          <Input
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            placeholder="Digite sua senha"
            secureTextEntry
            style={styles.input}
            labelStyle={labelStyle} // Apply light label style
          />

          <View style={styles.termsContainer}>
            <Switch
              value={aceitaTermos}
              onValueChange={setAceitaTermos}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={aceitaTermos ? COLORS.secondary : COLORS.secondary} // Thumb color is white in both states
              accessibilityLabel="Aceito os termos de uso"
              accessibilityState={{ checked: aceitaTermos }}
            />
            {/* Keep the terms text light as well */}
            <AccessibleText color="light" style={styles.termsText}>
              Aceito os termos de uso
            </AccessibleText>
          </View>

          <AccessibleButton
            title="Criar Conta"
            onPress={handleCadastro}
            loading={loading}
            style={styles.button}
          />

          <AccessibleButton
            title="Já tenho conta"
            type="secondary" // Assuming secondary button has appropriate styling for dark background
            onPress={() => navigation.navigate('Login')}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.dark,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.large,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.xlarge,
    // Ensure title uses light color from theme if not passed via prop
    color: COLORS.text.light,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: SPACING.medium,
    backgroundColor: 'rgba(244, 67, 54, 0.1)', // Keep error background subtle
    padding: SPACING.small,
    borderRadius: BORDER_RADIUS.small,
    color: COLORS.accent.error, // Ensure error text color is set
  },
  input: {
    marginBottom: SPACING.medium,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.large,
  },
  termsText: {
    marginLeft: SPACING.small,
    color: COLORS.text.light, // Explicitly set terms text color
  },
  button: {
    marginBottom: SPACING.medium,
  },
});

export default CadastroScreen;

