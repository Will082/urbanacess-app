// services/ocorrencias.js
import apiClient from './api';

// Função para obter ocorrências próximas
export const getOcorrenciasProximas = async (latitude, longitude, raioKm = 5) => {
  try {
    // Tentar fazer requisição real à API
    // const response = await apiClient.api.get('/ocorrencias/proximas', {
    //   params: { latitude, longitude, raioKm }
    // });
    // return response.data;
    
    // Versão mockada para desenvolvimento
    await apiClient.delay(800); // Simular latência
    
    // Filtrar ocorrências próximas (simulação simplificada)
    // Em um ambiente real, isso seria calculado pelo backend
    const ocorrencias = apiClient.mockData.ocorrencias;
    
    return ocorrencias;
  } catch (error) {
    throw apiClient.handleApiError(error);
  }
};

// Função para obter ocorrências do usuário logado
export const getMinhasOcorrencias = async () => {
  try {
    // Tentar fazer requisição real à API
    // const response = await apiClient.api.get('/ocorrencias/minhas');
    // return response.data;
    
    // Versão mockada para desenvolvimento
    await apiClient.delay(800); // Simular latência
    
    // Filtrar ocorrências do usuário (simulação)
    // Assumindo que o usuário logado tem ID 1
    const usuarioId = 1;
    const ocorrencias = apiClient.mockData.ocorrencias.filter(
      o => o.usuarioId === usuarioId
    );
    
    return ocorrencias;
  } catch (error) {
    throw apiClient.handleApiError(error);
  }
};

// Função para obter detalhes de uma ocorrência específica
export const getOcorrenciaPorId = async (id) => {
  try {
    // Tentar fazer requisição real à API
    // const response = await apiClient.api.get(`/ocorrencias/${id}`);
    // return response.data;
    
    // Versão mockada para desenvolvimento
    await apiClient.delay(500); // Simular latência
    
    // Buscar ocorrência pelo ID
    const ocorrencia = apiClient.mockData.ocorrencias.find(o => o.id === id);
    
    if (!ocorrencia) {
      throw new Error('Ocorrência não encontrada');
    }
    
    return ocorrencia;
  } catch (error) {
    throw apiClient.handleApiError(error);
  }
};

// Função para criar nova ocorrência
export const criarOcorrencia = async (dados) => {
  try {
    // Tentar fazer requisição real à API
    // const response = await apiClient.api.post('/ocorrencias', dados);
    // return response.data;
    
    // Versão mockada para desenvolvimento
    await apiClient.delay(1000); // Simular latência
    
    // Simular criação de nova ocorrência
    const novoId = apiClient.mockData.ocorrencias.length + 1;
    const categoria = apiClient.mockData.categorias.find(c => c.id === dados.categoriaId);
    
    if (!categoria) {
      throw new Error('Categoria não encontrada');
    }
    
    const novaOcorrencia = {
      id: novoId,
      categoriaId: dados.categoriaId,
      categoria,
      usuarioId: 1, // Usuário logado (simulação)
      usuario: apiClient.mockData.usuarios[0], // Usuário logado (simulação)
      descricao: dados.descricao,
      endereco: dados.endereco,
      latitude: dados.latitude,
      longitude: dados.longitude,
      imagemUrl: dados.imagemUrl || 'https://via.placeholder.com/300',
      dataCriacao: new Date().toISOString(),
      status: 'aguardando_validacao',
      urgente: dados.urgente || false,
      pontoPublico: dados.pontoPublico || false,
      validacoes: []
    };
    
    // Em um ambiente real, a ocorrência seria salva no banco
    // Aqui apenas simulamos a criação bem-sucedida
    
    return novaOcorrencia;
  } catch (error) {
    throw apiClient.handleApiError(error);
  }
};

// Função para validar uma ocorrência
export const validarOcorrencia = async (ocorrenciaId, comentario) => {
  try {
    // Tentar fazer requisição real à API
    // const response = await apiClient.api.post(`/ocorrencias/${ocorrenciaId}/validar`, {
    //   comentario
    // });
    // return response.data;
    
    // Versão mockada para desenvolvimento
    await apiClient.delay(800); // Simular latência
    
    // Buscar ocorrência pelo ID
    const ocorrencia = apiClient.mockData.ocorrencias.find(o => o.id === ocorrenciaId);
    
    if (!ocorrencia) {
      throw new Error('Ocorrência não encontrada');
    }
    
    // Simular validação
    const validacao = {
      id: Math.floor(Math.random() * 1000) + 1,
      ocorrenciaId,
      usuarioId: 1, // Usuário logado (simulação)
      usuario: apiClient.mockData.usuarios[0], // Usuário logado (simulação)
      comentario,
      dataValidacao: new Date().toISOString()
    };
    
    // Em um ambiente real, a validação seria salva no banco
    // Aqui apenas simulamos a validação bem-sucedida
    
    return { message: 'Ocorrência validada com sucesso' };
  } catch (error) {
    throw apiClient.handleApiError(error);
  }
};

// Função para configurar o token de autenticação
export const setAuthToken = (token) => {
  if (token) {
    apiClient.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.api.defaults.headers.common['Authorization'];
  }
};
