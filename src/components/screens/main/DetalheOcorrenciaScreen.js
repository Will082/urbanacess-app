// components/screens/main/DetalheOcorrenciaScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AccessibleText from '../../common/AccessibleText';
import Header from '../../layout/Header';
import Card from '../../common/Card';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../../theme';
import { useApp } from '../../../context/AppContext';

const DetalheOcorrenciaScreen = ({ route, navigation }) => {
  // Use the correct function name from the context
  const { getOcorrenciaPorId } = useApp();
  const { id } = route.params; // Get the ID passed during navigation

  const [ocorrencia, setOcorrencia] = useState(null);
  // Use local state for loading and error specific to this screen
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const carregarDetalhes = async () => {
      if (!id) {
        setError('ID da ocorrência não fornecido.');
        setLoading(false);
        return;
      }
      setLoading(true); // Start local loading
      setError('');
      try {
        // Use the correct function name here
        const data = await getOcorrenciaPorId(id);
        setOcorrencia(data);
      } catch (err) {
        setError('Não foi possível carregar os detalhes da ocorrência.');
        console.error('Erro ao buscar detalhes da ocorrência:', err);
        Alert.alert('Erro', 'Não foi possível carregar os detalhes. Tente novamente mais tarde.');
      } finally {
        setLoading(false); // End local loading
      }
    };

    carregarDetalhes();
    // Dependency array remains the same, getOcorrenciaPorId might change if context re-renders, though less likely now
  }, [id, getOcorrenciaPorId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'aguardando_validacao': return COLORS.accent.warning;
      case 'validada': return COLORS.accent.success;
      case 'em_analise': return COLORS.primary;
      default: return COLORS.text.secondary;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'aguardando_validacao': return 'Aguardando validação';
      case 'validada': return 'Validada';
      case 'em_analise': return 'Em análise';
      default: return status;
    }
  };

  // Render based on local loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Detalhes da Ocorrência" showBackButton={true} navigation={navigation} />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <AccessibleText>Carregando detalhes...</AccessibleText>
        </View>
      </SafeAreaView>
    );
  }

  // Render based on local error state
  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Detalhes da Ocorrência" showBackButton={true} navigation={navigation} />
        <View style={styles.centerContent}>
          <AccessibleText color="error">{error}</AccessibleText>
        </View>
      </SafeAreaView>
    );
  }

  if (!ocorrencia) {
    // This case might be redundant if error handles null data, but keep for clarity
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Detalhes da Ocorrência" showBackButton={true} navigation={navigation} />
        <View style={styles.centerContent}>
          <AccessibleText>Ocorrência não encontrada.</AccessibleText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Detalhes da Ocorrência" showBackButton={true} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {ocorrencia.imagemUrl && (
          <Image source={require('../../../assets/images/static-image-request.png')} style={styles.image} resizeMode="cover" />
        )}

        <Card style={styles.card}>
          <View style={styles.headerRow}>
            <AccessibleText variant="titleMedium" color="accent" style={styles.categoria}>
              {ocorrencia.categoria?.nome || 'Categoria não definida'}
            </AccessibleText>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ocorrencia.status) }]}>
              <AccessibleText variant="caption" color="light">
                {getStatusText(ocorrencia.status)}
              </AccessibleText>
            </View>
          </View>

          <View style={styles.infoRow}>
            <AccessibleText variant="bodySmall" color="secondary">
              Registrado em: {new Date(ocorrencia.dataCriacao).toLocaleDateString()} às {new Date(ocorrencia.dataCriacao).toLocaleTimeString()}
            </AccessibleText>
          </View>

          <AccessibleText style={styles.label}>Descrição:</AccessibleText>
          <AccessibleText style={styles.text}>{ocorrencia.descricao}</AccessibleText>

          <AccessibleText style={styles.label}>Endereço:</AccessibleText>
          <AccessibleText style={styles.text}>{ocorrencia.endereco}</AccessibleText>

          <View style={styles.optionsRow}>
            {ocorrencia.urgente && (
              <View style={styles.optionBadgeError}>
                <AccessibleText variant="caption" color="light">Urgente</AccessibleText>
              </View>
            )}
            {ocorrencia.pontoPublico && (
              <View style={styles.optionBadgePrimary}>
                <AccessibleText variant="caption" color="light">Ponto Público</AccessibleText>
              </View>
            )}
          </View>

          {/* Adicionar mais detalhes conforme necessário, como comentários, histórico, etc. */}

        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.medium,
  },
  scrollContent: {
    padding: SPACING.medium,
    paddingBottom: SPACING.large,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.medium,
    backgroundColor: COLORS.border, // Placeholder color
  },
  card: {
    padding: SPACING.medium,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.small,
  },
  categoria: {
    flex: 1, // Allow text to wrap
    marginRight: SPACING.small,
    fontWeight: FONTS.weights.semiBold,
  },
  statusBadge: {
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.small,
    alignSelf: 'flex-start',
  },
  infoRow: {
    marginBottom: SPACING.medium,
  },
  label: {
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.text.primary,
    marginTop: SPACING.medium,
    marginBottom: SPACING.tiny,
  },
  text: {
    color: COLORS.text.secondary,
    marginBottom: SPACING.small,
  },
  optionsRow: {
    flexDirection: 'row',
    marginTop: SPACING.medium,
    gap: SPACING.small,
  },
  optionBadgeError: {
    backgroundColor: COLORS.accent.error,
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.small,
  },
  optionBadgePrimary: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.small,
  },
});

export default DetalheOcorrenciaScreen;

