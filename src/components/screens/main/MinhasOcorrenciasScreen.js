// components/screens/main/MinhasOcorrenciasScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AccessibleText from '../../common/AccessibleText';
import Card from '../../common/Card';
import Header from '../../layout/Header';

import { COLORS, SPACING, BORDER_RADIUS } from '../../../theme';
import { useApp } from '../../../context/AppContext';

const MinhasOcorrenciasScreen = ({ navigation }) => {
  const { getMinhasOcorrencias } = useApp();
  const [ocorrencias, setOcorrencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const carregarOcorrencias = async () => {
      try {
        const data = await getMinhasOcorrencias();
        setOcorrencias(data);
      } catch (err) {
        setError('Não foi possível carregar suas ocorrências');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    carregarOcorrencias();
  }, []);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'aguardando_validacao':
        return COLORS.accent.warning;
      case 'validada':
        return COLORS.accent.success;
      case 'em_analise':
        return COLORS.primary;
      default:
        return COLORS.text.secondary;
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'aguardando_validacao':
        return 'Aguardando validação';
      case 'validada':
        return 'Validada';
      case 'em_analise':
        return 'Em análise';
      default:
        return status;
    }
  };
  
  const renderOcorrenciaItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('DetalheOcorrencia', { id: item.id })}
      accessibilityLabel={`Ocorrência: ${item.categoria.nome}`}
      accessibilityRole="button"
    >
      <Card style={styles.ocorrenciaCard}>
        <View style={styles.ocorrenciaHeader}>
          <View style={styles.categoriaContainer}>
            <AccessibleText variant="titleSmall" color="accent">
              {item.categoria.nome}
            </AccessibleText>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <AccessibleText variant="caption" color="light">
                {getStatusText(item.status)}
              </AccessibleText>
            </View>
          </View>
          <AccessibleText variant="caption" color="secondary">
            {new Date(item.dataCriacao).toLocaleDateString()}
          </AccessibleText>
        </View>
        
        <AccessibleText variant="body" numberOfLines={2} style={styles.descricao}>
          {item.descricao}
        </AccessibleText>
        
        <View style={styles.ocorrenciaFooter}>
          <AccessibleText variant="bodySmall" color="secondary" numberOfLines={1} style={styles.endereco}>
            {item.endereco}
          </AccessibleText>
          
          <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
        </View>
      </Card>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Minhas Ocorrências" />
      
      <View style={styles.content}>
        {loading ? (
          <View style={styles.centerContent}>
            <AccessibleText>Carregando ocorrências...</AccessibleText>
          </View>
        ) : error ? (
          <View style={styles.centerContent}>
            <AccessibleText color="error">{error}</AccessibleText>
          </View>
        ) : ocorrencias.length === 0 ? (
          <View style={styles.centerContent}>
            <AccessibleText>Você ainda não possui ocorrências registradas</AccessibleText>
          </View>
        ) : (
          <FlatList
            data={ocorrencias}
            renderItem={renderOcorrenciaItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
      

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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: SPACING.large,
  },
  ocorrenciaCard: {
    marginBottom: SPACING.medium,
  },
  ocorrenciaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.small,
  },
  categoriaContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  statusBadge: {
    paddingHorizontal: SPACING.small,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.small,
    marginLeft: SPACING.small,
  },
  descricao: {
    marginBottom: SPACING.small,
  },
  ocorrenciaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  endereco: {
    flex: 1,
    marginRight: SPACING.small,
  },
});

export default MinhasOcorrenciasScreen;
