// components/screens/main/PerfilScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AccessibleText from '../../common/AccessibleText';
import Input from '../../common/Input';
import AccessibleButton from '../../common/AccessibleButton';
import Card from '../../common/Card';
import Header from '../../layout/Header';

import { COLORS, SPACING, BORDER_RADIUS } from '../../../theme';
import { useAuth } from '../../../context/AuthContext';

const PerfilScreen = () => {
  const { usuario, atualizarPerfil, atualizarSenha, logout } = useAuth();
  
  const [modo, setModo] = useState('visualizacao'); // visualizacao, edicao, senha
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome || '');
      setTelefone(usuario.telefone || '');
    }
  }, [usuario]);
  
  const handleSalvarPerfil = async () => {
    if (!nome || !telefone) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await atualizarPerfil({ nome, telefone });
      setModo('visualizacao');
    } catch (err) {
      setError(err.message || 'Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSalvarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    if (novaSenha !== confirmarSenha) {
      setError('A nova senha e a confirmação não coincidem');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await atualizarSenha(senhaAtual, novaSenha);
      setModo('visualizacao');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
      Alert.alert('Sucesso', 'Sua senha foi atualizada com sucesso');
    } catch (err) {
      setError(err.message || 'Erro ao atualizar senha. Verifique a senha atual.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair do aplicativo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: logout, style: 'destructive' }
      ]
    );
  };
  
  const renderVisualizacao = () => (
    <Card style={styles.card}>
      <View style={styles.perfilHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <AccessibleText variant="titleLarge" color="light">
              {usuario?.nome?.charAt(0) || 'U'}
            </AccessibleText>
          </View>
        </View>
        
        <View style={styles.infoContainer}>
          <AccessibleText variant="titleMedium" color="accent">
            {usuario?.nome}
          </AccessibleText>
          <AccessibleText variant="bodySmall" color="secondary">
            {usuario?.email}
          </AccessibleText>
        </View>
      </View>
      
      <View style={styles.infoItem}>
        <Ionicons name="call-outline" size={20} color={COLORS.primary} />
        <AccessibleText style={styles.infoText}>
          {usuario?.telefone}
        </AccessibleText>
      </View>
      
      <View style={styles.infoItem}>
        <Ionicons name="card-outline" size={20} color={COLORS.primary} />
        <AccessibleText style={styles.infoText}>
          {usuario?.cpf}
        </AccessibleText>
      </View>
      
      <View style={styles.infoItem}>
        <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
        <AccessibleText style={styles.infoText}>
          Cadastrado em {new Date(usuario?.dataCadastro).toLocaleDateString()}
        </AccessibleText>
      </View>
      
      <View style={styles.botoesContainer}>
        <AccessibleButton
          title="Editar Perfil"
          onPress={() => setModo('edicao')}
          style={styles.botao}
        />
        
        <AccessibleButton
          title="Alterar Senha"
          type="secondary"
          onPress={() => setModo('senha')}
          style={styles.botao}
        />
      </View>
      
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        accessibilityLabel="Sair do aplicativo"
        accessibilityRole="button"
      >
        <Ionicons name="log-out-outline" size={20} color={COLORS.accent.error} />
        <AccessibleText color="error" style={styles.logoutText}>
          Sair do aplicativo
        </AccessibleText>
      </TouchableOpacity>
    </Card>
  );
  
  const renderEdicao = () => (
    <Card style={styles.card}>
      <AccessibleText variant="titleMedium" color="accent" style={styles.cardTitle}>
        Editar Perfil
      </AccessibleText>
      
      {error ? (
        <AccessibleText color="error" style={styles.errorText}>
          {error}
        </AccessibleText>
      ) : null}
      
      <Input
        label="Nome"
        value={nome}
        onChangeText={setNome}
        placeholder="Seu nome completo"
      />
      
      <Input
        label="E-mail"
        value={usuario?.email}
        disabled
      />
      
      <Input
        label="CPF"
        value={usuario?.cpf}
        disabled
      />
      
      <Input
        label="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        placeholder="(00) 00000-0000"
        keyboardType="phone-pad"
      />
      
      <View style={styles.botoesContainer}>
        <AccessibleButton
          title="Cancelar"
          type="secondary"
          onPress={() => setModo('visualizacao')}
          style={styles.botao}
        />
        
        <AccessibleButton
          title="Salvar"
          onPress={handleSalvarPerfil}
          loading={loading}
          style={styles.botao}
        />
      </View>
    </Card>
  );
  
  const renderAlterarSenha = () => (
    <Card style={styles.card}>
      <AccessibleText variant="titleMedium" color="accent" style={styles.cardTitle}>
        Alterar Senha
      </AccessibleText>
      
      {error ? (
        <AccessibleText color="error" style={styles.errorText}>
          {error}
        </AccessibleText>
      ) : null}
      
      <Input
        label="Senha Atual"
        value={senhaAtual}
        onChangeText={setSenhaAtual}
        placeholder="Digite sua senha atual"
        secureTextEntry
      />
      
      <Input
        label="Nova Senha"
        value={novaSenha}
        onChangeText={setNovaSenha}
        placeholder="Digite a nova senha"
        secureTextEntry
      />
      
      <Input
        label="Confirmar Nova Senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        placeholder="Confirme a nova senha"
        secureTextEntry
      />
      
      <View style={styles.botoesContainer}>
        <AccessibleButton
          title="Cancelar"
          type="secondary"
          onPress={() => setModo('visualizacao')}
          style={styles.botao}
        />
        
        <AccessibleButton
          title="Salvar"
          onPress={handleSalvarSenha}
          loading={loading}
          style={styles.botao}
        />
      </View>
    </Card>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Perfil" showBackButton={false} />
      
      <ScrollView style={styles.content}>
        {modo === 'visualizacao' && renderVisualizacao()}
        {modo === 'edicao' && renderEdicao()}
        {modo === 'senha' && renderAlterarSenha()}
      </ScrollView>
      

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  content: {
    flex: 1,
    padding: SPACING.medium,
  },
  card: {
    marginBottom: SPACING.large,
  },
  cardTitle: {
    marginBottom: SPACING.medium,
    textAlign: 'center',
  },
  perfilHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.large,
  },
  avatarContainer: {
    marginRight: SPACING.medium,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.medium,
  },
  infoText: {
    marginLeft: SPACING.small,
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.medium,
  },
  botao: {
    flex: 1,
    marginHorizontal: SPACING.tiny,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.large,
    paddingVertical: SPACING.small,
  },
  logoutText: {
    marginLeft: SPACING.small,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: SPACING.medium,
  },
});

export default PerfilScreen;
