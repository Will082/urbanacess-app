// components/screens/main/ValidacaoScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AccessibleText from '../../common/AccessibleText';
import Card from '../../common/Card';
import AccessibleButton from '../../common/AccessibleButton';
import Header from '../../layout/Header';

import { COLORS, SPACING, BORDER_RADIUS } from '../../../theme';
import { useApp } from '../../../context/AppContext';

const ValidacaoScreen = ({ navigation }) => {
  const { getOcorrenciasParaValidar, validarOcorrencia } = useApp();
  const [ocorrencias, setOcorrencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [validando, setValidando] = useState(false);
  const [comentario, setComentario] = useState('');
  const [ocorrenciaSelecionada, setOcorrenciaSelecionada] = useState(null);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const carregarOcorrencias = async () => {
      try {
        const data = await getOcorrenciasParaValidar();
        setOcorrencias(data);
      } catch (err) {
        setError('Não foi possível carregar as ocorrências para validação');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    carregarOcorrencias();
  }, []);
  
  const handleValidar = async (ocorrencia) => {
    setOcorrenciaSelecionada(ocorrencia);
    setComentario('');
    setValidando(true);
  };
  
  const confirmarValidacao = async () => {
    if (!comentario) {
      setError('Por favor, adicione um comentário para validar a ocorrência');
      return;
    }
    
    try {
      await validarOcorrencia(ocorrenciaSelecionada.id, comentario);
      
      // Atualiza a lista removendo a ocorrência validada
      setOcorrencias(ocorrencias.filter(o => o.id !== ocorrenciaSelecionada.id));
      setValidando(false);
      setOcorrenciaSelecionada(null);
    } catch (err) {
      setError(err.message || 'Erro ao validar ocorrência. Tente novamente.');
    }
  };
  
  const cancelarValidacao = () => {
    setValidando(false);
    setOcorrenciaSelecionada(null);
    setError('');
  };
  
  const renderOcorrenciaItem = ({ item }) => (
    <Card style={styles.ocorrenciaCard}>
      <View style={styles.ocorrenciaHeader}>
        <AccessibleText variant="titleSmall" color="accent">
          {item.categoria.nome}
        </AccessibleText>
        <AccessibleText variant="caption" color="secondary">
          {new Date(item.dataCriacao).toLocaleDateString()}
        </AccessibleText>
      </View>
      
      <AccessibleText variant="body" style={styles.descricao}>
        {item.descricao}
      </AccessibleText>
      
      <View style={styles.ocorrenciaFooter}>
        <AccessibleText variant="bodySmall" color="secondary" numberOfLines={1} style={styles.endereco}>
          {item.endereco}
        </AccessibleText>
        
        <AccessibleButton
          title="Validar"
          size="small"
          onPress={() => handleValidar(item)}
        />
      </View>
    </Card>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Validação" />
      
      <View style={styles.content}>
        {validando ? (
          <View style={styles.validacaoContainer}>
            <Card style={styles.validacaoCard}>
              <AccessibleText variant="titleSmall" color="accent" style={styles.validacaoTitle}>
                Validar Ocorrência
              </AccessibleText>
              
              <AccessibleText variant="body" style={styles.validacaoDescricao}>
                {ocorrenciaSelecionada?.descricao}
              </AccessibleText>
              
              <AccessibleText variant="bodySmall" color="secondary" style={styles.validacaoLabel}>
                Adicione um comentário para validar esta ocorrência:
              </AccessibleText>
              
              <TextInput
                style={styles.comentarioInput}
                value={comentario}
                onChangeText={setComentario}
                placeholder="Seu comentário sobre esta ocorrência..."
                multiline
                numberOfLines={4}
              />
              
              {error ? (
                <AccessibleText color="error" style={styles.errorText}>
                  {error}
                </AccessibleText>
              ) : null}
              
              <View style={styles.validacaoBotoes}>
                <AccessibleButton
                  title="Cancelar"
                  type="secondary"
                  onPress={cancelarValidacao}
                  style={styles.validacaoBotao}
                />
                
                <AccessibleButton
                  title="Confirmar"
                  onPress={confirmarValidacao}
                  style={styles.validacaoBotao}
                />
              </View>
            </Card>
          </View>
        ) : loading ? (
          <View style={styles.centerContent}>
            <AccessibleText>Carregando ocorrências...</AccessibleText>
          </View>
        ) : error ? (
          <View style={styles.centerContent}>
            <AccessibleText color="error">{error}</AccessibleText>
          </View>
        ) : ocorrencias.length === 0 ? (
          <View style={styles.centerContent}>
            <AccessibleText>Não há ocorrências para validar no momento</AccessibleText>
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
    alignItems: 'center',
    marginBottom: SPACING.small,
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
  validacaoContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.medium,
  },
  validacaoCard: {
    padding: SPACING.medium,
  },
  validacaoTitle: {
    marginBottom: SPACING.medium,
    textAlign: 'center',
  },
  validacaoDescricao: {
    marginBottom: SPACING.medium,
  },
  validacaoLabel: {
    marginBottom: SPACING.small,
  },
  comentarioInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
    marginBottom: SPACING.medium,
    backgroundColor: COLORS.secondary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    marginBottom: SPACING.medium,
    textAlign: 'center',
  },
  validacaoBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  validacaoBotao: {
    flex: 1,
    marginHorizontal: SPACING.tiny,
  },
});

export default ValidacaoScreen;
