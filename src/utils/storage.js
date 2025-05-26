// utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Salvar dados
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (e) {
    console.error('Erro ao salvar dados:', e);
    return false;
  }
};

// Recuperar dados
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Erro ao recuperar dados:', e);
    return null;
  }
};

// Remover dados
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('Erro ao remover dados:', e);
    return false;
  }
};

// Limpar todos os dados
export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (e) {
    console.error('Erro ao limpar dados:', e);
    return false;
  }
};

// Salvar sessão do usuário
export const saveUserSession = async (userData, token) => {
  await storeData('user_data', userData);
  await storeData('user_token', token);
};

// Obter sessão do usuário
export const getUserSession = async () => {
  const userData = await getData('user_data');
  const token = await getData('user_token');
  return { userData, token };
};

// Limpar sessão do usuário
export const clearUserSession = async () => {
  await removeData('user_data');
  await removeData('user_token');
};
