// utils/validation.js
// Funções de validação para formulários

// Validar se o campo está preenchido
export const required = (value) => {
  if (!value || value.trim() === '') {
    return 'Este campo é obrigatório';
  }
  return null;
};

// Validar email
export const email = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value || !emailRegex.test(value)) {
    return 'Email inválido';
  }
  return null;
};

// Validar CPF
export const cpf = (value) => {
  // Remover caracteres não numéricos
  const cpfClean = value.replace(/[^\d]/g, '');
  
  // Verificar se tem 11 dígitos
  if (cpfClean.length !== 11) {
    return 'CPF inválido';
  }
  
  // Verificar se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1{10}$/.test(cpfClean)) {
    return 'CPF inválido';
  }
  
  // Algoritmo de validação do CPF
  let sum = 0;
  let remainder;
  
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpfClean.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  
  if (remainder !== parseInt(cpfClean.substring(9, 10))) {
    return 'CPF inválido';
  }
  
  sum = 0;
  
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpfClean.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  
  if (remainder !== parseInt(cpfClean.substring(10, 11))) {
    return 'CPF inválido';
  }
  
  return null;
};

// Validar telefone
export const telefone = (value) => {
  const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
  if (!value || !telefoneRegex.test(value)) {
    return 'Telefone inválido (formato: (11) 91234-5678)';
  }
  return null;
};

// Validar senha
export const senha = (value, minLength = 6) => {
  if (!value || value.length < minLength) {
    return `A senha deve ter pelo menos ${minLength} caracteres`;
  }
  return null;
};

// Validar confirmação de senha
export const confirmaSenha = (value, senha) => {
  if (value !== senha) {
    return 'As senhas não coincidem';
  }
  return null;
};

// Validar formulário completo
export const validateForm = (formData, validations) => {
  const errors = {};
  
  Object.keys(validations).forEach(field => {
    const value = formData[field];
    const fieldValidations = validations[field];
    
    if (Array.isArray(fieldValidations)) {
      // Executar cada validação para o campo
      for (const validation of fieldValidations) {
        let error = null;
        
        if (typeof validation === 'function') {
          // Função de validação simples
          error = validation(value);
        } else if (typeof validation === 'object' && validation.validator) {
          // Objeto de validação com parâmetros adicionais
          error = validation.validator(value, validation.param, formData);
        }
        
        if (error) {
          errors[field] = error;
          break; // Parar na primeira validação que falhar
        }
      }
    } else if (typeof fieldValidations === 'function') {
      // Única função de validação
      const error = fieldValidations(value);
      if (error) {
        errors[field] = error;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
