// utils/geolocation.js
import * as Location from 'expo-location';

// Solicitar permissão para acessar a localização
export const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Erro ao solicitar permissão de localização:', error);
    return false;
  }
};

// Obter localização atual
export const getCurrentLocation = async () => {
  try {
    const hasPermission = await requestLocationPermission();
    
    if (!hasPermission) {
      return {
        success: false,
        error: 'Permissão para acessar localização foi negada'
      };
    }
    
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });
    
    return {
      success: true,
      data: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy
      }
    };
  } catch (error) {
    
    return {
      success: false,
      error: 'Não foi possível obter sua localização'
    };
  }
};

// Obter endereço a partir das coordenadas (geocodificação reversa)
export const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const result = await Location.reverseGeocodeAsync({
      latitude,
      longitude
    });
    
    if (result.length > 0) {
      const { street, streetNumber, district, city, region, postalCode, country } = result[0];
      
      // Formatar endereço
      const address = {
        street: street || '',
        number: streetNumber || '',
        district: district || '',
        city: city || '',
        state: region || '',
        postalCode: postalCode || '',
        country: country || '',
        formatted: ''
      };
      
      // Criar string formatada do endereço
      address.formatted = `${address.street}${address.number ? `, ${address.number}` : ''}${address.district ? ` - ${address.district}` : ''}${address.city ? `, ${address.city}` : ''}${address.state ? ` - ${address.state}` : ''}`;
      
      return {
        success: true,
        data: address
      };
    } else {
      return {
        success: false,
        error: 'Não foi possível obter o endereço para esta localização'
      };
    }
  } catch (error) {
    console.error('Erro ao obter endereço:', error);
    return {
      success: false,
      error: 'Erro ao converter coordenadas em endereço'
    };
  }
};

// Calcular distância entre duas coordenadas (em km)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Raio da Terra em km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distância em km
  return distance;
};

// Converter graus para radianos
const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};
