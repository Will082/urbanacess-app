// services/auth.js
import apiClient from './api';

// Função para fazer login
export const login = async (email, senha) => {
  try {
    // Tentar fazer requisição real à API
    // const response = await apiClient.api.post('/auth/login', { email, senha });
    // return response.data;
    
    // Versão mockada para desenvolvimento
    await apiClient.delay(800); // Simular latência
    
    // Verificar credenciais com dados mockados
    const usuario = apiClient.mockData.usuarios.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );
    
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }
    
    // Em um ambiente real, verificaríamos a senha com hash
    // Aqui apenas simulamos o login bem-sucedido
    
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cpf: usuario.cpf,
      telefone: usuario.telefone,
      dataCadastro: usuario.dataCadastro,
      token: 'mock-jwt-token-' + usuario.id
    };
  } catch (error) {
    if (error.message === 'Usuário não encontrado') {
      throw new Error('Email ou senha incorretos');
    }
    throw apiClient.handleApiError(error);
  }
};

// Função para cadastrar novo usuário
export const cadastrar = async (nome, cpf, email, telefone, senha) => {
  try {
    // Tentar fazer requisição real à API
    // const response = await apiClient.api.post('/auth/cadastro', { 
    //   nome, cpf, email, telefone, senha 
    // });
    // return response.data;
    
    // Versão mockada para desenvolvimento
    await apiClient.delay(1000); // Simular latência
    
    // Verificar se email já existe
    const emailExiste = apiClient.mockData.usuarios.some(
      u => u.email.toLowerCase() === email.toLowerCase()
    );
    
    if (emailExiste) {
      throw new Error('Email já cadastrado');
    }
    
    // Verificar se CPF já existe
    const cpfExiste = apiClient.mockData.usuarios.some(
      u => u.cpf === cpf
    );
    
    if (cpfExiste) {
      throw new Error('CPF já cadastrado');
    }
    
    // Simular criação de novo usuário
    const novoId = apiClient.mockData.usuarios.length + 1;
    const novoUsuario = {
      id: novoId,
      nome,
      email,
      cpf,
      telefone,
      dataCadastro: new Date().toISOString()
    };
    
    // Em um ambiente real, o usuário seria salvo no banco
    // Aqui apenas simulamos o cadastro bem-sucedido
    
    return {
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      cpf: novoUsuario.cpf,
      telefone: novoUsuario.telefone,
      dataCadastro: novoUsuario.dataCadastro,
      token: 'mock-jwt-token-' + novoUsuario.id
    };
  } catch (error) {
    throw apiClient.handleApiError(error);
  }
};

// Função para atualizar perfil do usuário
export const atualizarPerfil = async (dados) => {
  try {
    // Tentar fazer requisição real à API
    // const response = await apiClient.api.put('/usuarios/perfil', dados);
    // return response.data;
    
    // Versão mockada para desenvolvimento
    await apiClient.delay(800); // Simular latência
    
    // Simular atualização bem-sucedida
    return {
      nome: dados.nome,
      telefone: dados.telefone
    };
  } catch (error) {
    throw apiClient.handleApiError(error);
  }
};

// Função para atualizar senha do usuário
export const atualizarSenha = async (senhaAtual, novaSenha) => {
  try {
    // Tentar fazer requisição real à API
    // const response = await apiClient.api.put('/usuarios/senha', { 
    //   senhaAtual, novaSenha 
    // });
    // return response.data;
    
    // Versão mockada para desenvolvimento
    await apiClient.delay(800); // Simular latência
    
    // Simular verificação de senha atual
    // Em um ambiente real, verificaríamos a senha com hash
    if (senhaAtual === 'senha_incorreta') {
      throw new Error('Senha atual incorreta');
    }
    
    // Simular atualização bem-sucedida
    return { message: 'Senha atualizada com sucesso' };
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
