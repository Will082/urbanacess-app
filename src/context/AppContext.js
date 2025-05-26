// context/AppContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'; // Import useCallback
import * as ocorrenciasService from '../services/ocorrencias';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { token } = useAuth();
  const [categorias, setCategorias] = useState([
    { id: 1, nome: 'Calçada obstruída' },
    { id: 2, nome: 'Rampa danificada' },
    { id: 3, nome: 'Vaga inacessível' },
    { id: 4, nome: 'Semáforo sonoro inoperante' },
    { id: 5, nome: 'Outro' }
  ]);
  // Removed global loading/error states as they caused issues
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);

  // Configurar o token de autenticação para as requisições
  useEffect(() => {
    if (token) {
      ocorrenciasService.setAuthToken(token);
    }
  }, [token]);

  // Wrap provided functions with useCallback to stabilize their references
  const getOcorrenciasProximas = useCallback(async (latitude, longitude, raioKm = 5) => {
    // Removed setLoading/setError calls related to global state
    try {
      return await ocorrenciasService.getOcorrenciasProximas(latitude, longitude, raioKm);
    } catch (err) {
      console.error('Erro ao buscar ocorrências próximas:', err);
      throw new Error(err.message || 'Erro ao buscar ocorrências próximas');
    }
  }, []); // Empty dependency array as it doesn't depend on component state/props

  const getMinhasOcorrencias = useCallback(async () => {
    // Removed setLoading/setError calls related to global state
    try {
      return await ocorrenciasService.getMinhasOcorrencias();
    } catch (err) {
      console.error('Erro ao buscar suas ocorrências:', err);
      throw new Error(err.message || 'Erro ao buscar suas ocorrências');
    }
  }, []); // Empty dependency array

  const getOcorrenciasParaValidar = useCallback(async () => {
    // Removed setLoading/setError calls related to global state
    try {
      // Simulação - em um ambiente real, isso viria da API
      const todasOcorrencias = await ocorrenciasService.getOcorrenciasProximas(-23.5505, -46.6333, 10);
      return todasOcorrencias.filter(o => o.status === 'aguardando_validacao');
    } catch (err) {
      console.error('Erro ao buscar ocorrências para validar:', err);
      throw new Error(err.message || 'Erro ao buscar ocorrências para validar');
    }
  }, []); // Empty dependency array

  const getOcorrenciaPorId = useCallback(async (id) => {
    // Removed setLoading/setError calls related to global state
    try {
      return await ocorrenciasService.getOcorrenciaPorId(id);
    } catch (err) {
      console.error('Erro ao buscar detalhes da ocorrência:', err);
      throw new Error(err.message || 'Erro ao buscar detalhes da ocorrência');
    }
  }, []); // Empty dependency array

  const criarOcorrencia = useCallback(async (dados) => {
    // Removed setLoading/setError calls related to global state
    try {
      return await ocorrenciasService.criarOcorrencia(dados);
    } catch (err) {
      console.error('Erro ao criar ocorrência:', err);
      throw new Error(err.message || 'Erro ao criar ocorrência');
    }
  }, []); // Empty dependency array

  const validarOcorrencia = useCallback(async (ocorrenciaId, comentario) => {
    // Removed setLoading/setError calls related to global state
    try {
      return await ocorrenciasService.validarOcorrencia(ocorrenciaId, comentario);
    } catch (err) {
      console.error('Erro ao validar ocorrência:', err);
      throw new Error(err.message || 'Erro ao validar ocorrência');
    }
  }, []); // Empty dependency array

  // Memoize the context value to prevent unnecessary re-renders of consumers
  const contextValue = React.useMemo(() => ({
    categorias,
    // loading, // Removed global state
    // error,   // Removed global state
    getOcorrenciasProximas,
    getMinhasOcorrencias,
    getOcorrenciasParaValidar,
    getOcorrenciaPorId,
    criarOcorrencia,
    validarOcorrencia
  }), [
    categorias, 
    getOcorrenciasProximas, 
    getMinhasOcorrencias, 
    getOcorrenciasParaValidar, 
    getOcorrenciaPorId, 
    criarOcorrencia, 
    validarOcorrencia
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};

