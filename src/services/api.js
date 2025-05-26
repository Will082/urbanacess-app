// services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL base da API mockada
const API_URL = 'https://urbanaccess-api.example.com/api';

// Instância do axios com configurações padrão
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@UrbanAccess:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Dados mockados para uso quando a API não estiver disponível
const mockData = {
  ocorrencias: [
    {
      id: 1,
      categoriaId: 1,
      categoria: { id: 1, nome: 'Calçada obstruída' },
      usuarioId: 1,
      usuario: { id: 1, nome: 'João Silva' },
      descricao: 'Calçada com buracos e obstáculos impedindo a passagem de cadeirantes',
      endereco: 'Av. Paulista, 1000 - São Paulo, SP',
      latitude: -23.5629,
      longitude: -46.6544,
      imagemUrl: 'https://via.placeholder.com/300',
      dataCriacao: '2025-05-15T10:30:00',
      status: 'aguardando_validacao',
      urgente: true,
      pontoPublico: false,
      validacoes: []
    },
    {
      id: 2,
      categoriaId: 2,
      categoria: { id: 2, nome: 'Rampa danificada' },
      usuarioId: 2,
      usuario: { id: 2, nome: 'Maria Oliveira' },
      descricao: 'Rampa de acesso com piso quebrado e sem sinalização tátil',
      endereco: 'Rua Augusta, 500 - São Paulo, SP',
      latitude: -23.5505,
      longitude: -46.6333,
      imagemUrl: 'https://via.placeholder.com/300',
      dataCriacao: '2025-05-16T14:45:00',
      status: 'validada',
      urgente: false,
      pontoPublico: true,
      validacoes: [
        {
          id: 1,
          ocorrenciaId: 2,
          usuarioId: 1,
          usuario: { id: 1, nome: 'João Silva' },
          comentario: 'Confirmei o problema no local, realmente precisa de reparo urgente',
          dataValidacao: '2025-05-17T09:20:00'
        }
      ]
    },
    {
      id: 3,
      categoriaId: 3,
      categoria: { id: 3, nome: 'Vaga inacessível' },
      usuarioId: 1,
      usuario: { id: 1, nome: 'João Silva' },
      descricao: 'Vaga para PCD sem espaço adequado para desembarque com cadeira de rodas',
      endereco: 'Shopping Center Norte - São Paulo, SP',
      latitude: -23.5099,
      longitude: -46.6123,
      imagemUrl: 'https://via.placeholder.com/300',
      dataCriacao: '2025-05-17T16:20:00',
      status: 'em_analise',
      urgente: false,
      pontoPublico: true,
      validacoes: [
        {
          id: 2,
          ocorrenciaId: 3,
          usuarioId: 2,
          usuario: { id: 2, nome: 'Maria Oliveira' },
          comentario: 'Confirmado, o espaço é insuficiente para manobra de cadeira de rodas',
          dataValidacao: '2025-05-18T10:15:00'
        }
      ]
    },
    {
      id: 4,
      categoriaId: 4,
      categoria: { id: 4, nome: 'Semáforo sonoro inoperante' },
      usuarioId: 3,
      usuario: { id: 3, nome: 'Carlos Mendes' },
      descricao: 'Semáforo sonoro para deficientes visuais não está funcionando há semanas',
      endereco: 'Av. Rebouças com Av. Henrique Schaumann - São Paulo, SP',
      latitude: -23.5576,
      longitude: -46.6721,
      imagemUrl: 'https://via.placeholder.com/300',
      dataCriacao: '2025-05-18T08:10:00',
      status: 'aguardando_validacao',
      urgente: true,
      pontoPublico: true,
      validacoes: []
    },
    {
      id: 5,
      categoriaId: 5,
      categoria: { id: 5, nome: 'Outro' },
      usuarioId: 1,
      usuario: { id: 1, nome: 'João Silva' },
      descricao: 'Falta de piso tátil na entrada principal da estação de metrô',
      endereco: 'Estação Sé - São Paulo, SP',
      latitude: -23.5500,
      longitude: -46.6333,
      imagemUrl: 'https://via.placeholder.com/300',
      dataCriacao: '2025-05-19T11:30:00',
      status: 'aguardando_validacao',
      urgente: false,
      pontoPublico: true,
      validacoes: []
    }
  ],
  categorias: [
    { id: 1, nome: 'Calçada obstruída' },
    { id: 2, nome: 'Rampa danificada' },
    { id: 3, nome: 'Vaga inacessível' },
    { id: 4, nome: 'Semáforo sonoro inoperante' },
    { id: 5, nome: 'Outro' }
  ],
  usuarios: [
    {
      id: 1,
      nome: 'João Silva',
      email: 'joao@example.com',
      cpf: '123.456.789-00',
      telefone: '(11) 98765-4321',
      dataCadastro: '2025-04-10T14:30:00'
    },
    {
      id: 2,
      nome: 'Maria Oliveira',
      email: 'maria@example.com',
      cpf: '987.654.321-00',
      telefone: '(11) 91234-5678',
      dataCadastro: '2025-04-15T09:45:00'
    },
    {
      id: 3,
      nome: 'Carlos Mendes',
      email: 'carlos@example.com',
      cpf: '456.789.123-00',
      telefone: '(11) 95555-9999',
      dataCadastro: '2025-04-20T16:20:00'
    }
  ]
};

// Função para simular atraso de rede
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Função para simular resposta da API
const mockResponse = async (data, errorChance = 0) => {
  await delay(500); // Simular latência de rede
  
  // Simular erro aleatório (para testes)
  if (Math.random() < errorChance) {
    throw new Error('Erro de conexão com o servidor');
  }
  
  return data;
};

// Função para lidar com erros de API
const handleApiError = (error) => {
  if (error.response) {
    // O servidor respondeu com um status de erro
    const message = error.response.data?.error || 'Erro no servidor';
    throw new Error(message);
  } else if (error.request) {
    // A requisição foi feita mas não houve resposta
    console.error('Sem resposta do servidor:', error.request);
    throw new Error('Sem resposta do servidor. Verifique sua conexão.');
  } else {
    // Erro na configuração da requisição
    console.error('Erro na requisição:', error.message);
    throw new Error('Erro ao fazer requisição: ' + error.message);
  }
};

// Exportar a instância do axios e funções auxiliares
export default {
  api,
  mockData,
  mockResponse,
  handleApiError,
  delay
};
