// src/js/validation.js
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }
  if (!/[A-Z]/.test(password)) {
    return 'La contraseña debe contener al menos una letra mayúscula';
  }
  if (!/[0-9]/.test(password)) {
    return 'La contraseña debe contener al menos un número';
  }
  return null;
};

export const validateCedula = (cedula) => {
  if (!cedula) return 'La cédula es obligatoria';
  
  const re = /^V[0-9]{7,8}$/i;
  if (!re.test(cedula)) {
    return 'Formato de cédula inválido. Debe ser V seguido de 7-8 dígitos';
  }
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return 'El teléfono es obligatorio';
  
  const re = /^\+58\s[0-9]{3}-[0-9]{4}$/;
  if (!re.test(phone)) {
    return 'Formato de teléfono inválido. Use +58 412-1234567';
  }
  return null;
};

export const validateDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Fecha inválida';
  }
  
  // Validar que no sea en el futuro
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date > today) {
    return 'La fecha no puede ser en el futuro';
  }
  
  // Validar edad mínima (18 años)
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  if (date > eighteenYearsAgo) {
    return 'Debes ser mayor de 18 años';
  }
  
  return null;
};

export const validateForm = (form) => {
  let isValid = true;
  const errorMessages = {};
  
  // Validar cada campo según su tipo y validaciones requeridas
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const validations = input.dataset.validations ? input.dataset.validations.split(',') : [];
    let errorMessage = null;
    
    for (const validation of validations) {
      switch(validation.trim()) {
        case 'required':
          if (!input.value.trim()) {
            errorMessage = 'Este campo es obligatorio';
          }
          break;
        case 'email':
          errorMessage = validateEmail(input.value) ? validateEmail(input.value) : null;
          break;
        case 'password':
          errorMessage = validatePassword(input.value);
          break;
        case 'cedula':
          errorMessage = validateCedula(input.value);
          break;
        case 'phone':
          errorMessage = validatePhone(input.value);
          break;
        case 'date':
          errorMessage = validateDate(input.value);
          break;
      }
      
      if (errorMessage) break;
    }
    
    // Mostrar error si existe
    if (errorMessage) {
      isValid = false;
      errorMessages[input.id] = errorMessage;
      
      const errorElement = document.getElementById(`${input.id}-error`);
      if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.classList.add('active');
      }
    } else {
      const errorElement = document.getElementById(`${input.id}-error`);
      if (errorElement) {
        errorElement.classList.remove('active');
      }
    }
  });
  
  return { isValid, errorMessages };
};

// Agregar validación en tiempo real
export const setupRealTimeValidation = () => {
  document.addEventListener('input', (e) => {
    const input = e.target;
    if (!input.dataset.validations) return;
    
    const validations = input.dataset.validations.split(',');
    let errorMessage = null;
    
    for (const validation of validations) {
      switch(validation.trim()) {
        case 'required':
          if (!input.value.trim()) {
            errorMessage = 'Este campo es obligatorio';
          }
          break;
        case 'email':
          errorMessage = validateEmail(input.value) ? validateEmail(input.value) : null;
          break;
        case 'password':
          errorMessage = validatePassword(input.value);
          break;
        case 'cedula':
          errorMessage = validateCedula(input.value);
          break;
        case 'phone':
          errorMessage = validatePhone(input.value);
          break;
        case 'date':
          errorMessage = validateDate(input.value);
          break;
      }
      
      if (errorMessage) break;
    }
    
    const errorElement = document.getElementById(`${input.id}-error`);
    if (errorElement) {
      errorElement.textContent = errorMessage || '';
      errorElement.classList.toggle('active', !!errorMessage);
    }
  });
};

// Inicializar validaciones en tiempo real
document.addEventListener('DOMContentLoaded', setupRealTimeValidation);
