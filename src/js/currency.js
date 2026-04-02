// src/js/currency.js
// Sistema de monedas - Sin dependencias circulares

const CURRENCY_KEY = 'medivzla_tasa_cambio';

export const setTasaCambio = (nuevaTasa) => {
  const config = JSON.parse(localStorage.getItem('medivzla_config') || '{}');
  config.tasaCambio = parseFloat(nuevaTasa);
  config.fechaActualizacion = new Date().toISOString();
  
  if (!config.historialTasas) config.historialTasas = [];
  config.historialTasas.push({
    fecha: config.fechaActualizacion,
    tasa: config.tasaCambio
  });
  
  localStorage.setItem('medivzla_config', JSON.stringify(config));
  
  // Emitir evento de cambio de tasa
  window.dispatchEvent(new CustomEvent('currencyUpdated', { detail: { tasa: config.tasaCambio } }));
  
  return config.tasaCambio;
};

export const getTasaCambio = () => {
  const config = JSON.parse(localStorage.getItem('medivzla_config') || '{}');
  return config.tasaCambio || 36.50;
};

export const convertirUSDaBS = (montoUSD) => {
  const tasa = getTasaCambio();
  return parseFloat((montoUSD * tasa).toFixed(2));
};

export const convertirBSaUSD = (montoBS) => {
  const tasa = getTasaCambio();
  return parseFloat((montoBS / tasa).toFixed(2));
};

export const formatUSD = (monto) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(monto);
};

export const formatBS = (monto) => {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(monto).replace('VES', 'Bs');
};

export const formatDual = (montoUSD) => {
  const montoBS = convertirUSDaBS(montoUSD);
  return `${formatUSD(montoUSD)} / ${formatBS(montoBS)}`;
};

// Función para actualizar todos los elementos de moneda en la página
export const updateCurrencyDisplay = () => {
  // Actualizar todos los elementos con clase 'currency-display'
  document.querySelectorAll('.currency-display').forEach(el => {
    const usdValue = parseFloat(el.dataset.usd);
    if (!isNaN(usdValue)) {
      el.textContent = formatDual(usdValue);
    }
  });
};

// Inicializar el sistema monetario cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  updateCurrencyDisplay();
});
