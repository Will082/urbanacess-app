// context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar se há um usuário logado ao iniciar o app
    const carregarUsuario = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('@UrbanAccess:token');
        const storedUser = await AsyncStorage.getItem('@UrbanAccess:usuario');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUsuario(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Erro ao carregar dados do usuário:', err);
      } finally {
        setLoading(false);
      }
    };

    carregarUsuario();
  }, []);

  const login = async (email, senha) => {
    try {
      setError(null);
      const response = await authService.login(email, senha);
      
      await AsyncStorage.setItem('@UrbanAccess:token', response.token);
      await AsyncStorage.setItem('@UrbanAccess:usuario', JSON.stringify(response));
      
      setToken(response.token);
      setUsuario(response);
      
      return response;
    } catch (err) {
      setError(err.message || 'Falha ao fazer login');
      throw err;
    }
  };

  const cadastrar = async (nome, cpf, email, telefone, senha) => {
    try {
      setError(null);
      const response = await authService.cadastrar(nome, cpf, email, telefone, senha);
      
      await AsyncStorage.setItem('@UrbanAccess:token', response.token);
      await AsyncStorage.setItem('@UrbanAccess:usuario', JSON.stringify(response));
      
      setToken(response.token);
      setUsuario(response);
      
      return response;
    } catch (err) {
      setError(err.message || 'Falha ao criar conta');
      throw err;
    }
  };

  const atualizarPerfil = async (dados) => {
    try {
      setError(null);
      const response = await authService.atualizarPerfil(dados);
      
      const usuarioAtualizado = { ...usuario, ...response };
      await AsyncStorage.setItem('@UrbanAccess:usuario', JSON.stringify(usuarioAtualizado));
      
      setUsuario(usuarioAtualizado);
      
      return response;
    } catch (err) {
      setError(err.message || 'Falha ao atualizar perfil');
      throw err;
    }
  };

  const atualizarSenha = async (senhaAtual, novaSenha) => {
    try {
      setError(null);
      await authService.atualizarSenha(senhaAtual, novaSenha);
      return true;
    } catch (err) {
      setError(err.message || 'Falha ao atualizar senha');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@UrbanAccess:token');
      await AsyncStorage.removeItem('@UrbanAccess:usuario');
      
      setToken(null);
      setUsuario(null);
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        loading,
        error,
        login,
        cadastrar,
        atualizarPerfil,
        atualizarSenha,
        logout,
        isAuthenticated: !!usuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
