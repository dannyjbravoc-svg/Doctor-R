// src/js/app.js
import { initializeRouter } from './router.js';

export const initApp = () => {
  console.log('Aplicación inicializada');
  
  // Inicializar el router
  initializeRouter();
  
  // Inicializar otros componentes globales
  initGlobalComponents();
};

const initGlobalComponents = () => {
  // Configurar notificaciones
  if (document.querySelector('.toast-container')) {
    initNotifications();
  }
  
  // Configurar dark mode
  if (document.querySelector('.dark-mode-toggle')) {
    initDarkMode();
  }
  
  // Configurar menú responsive
  document.getElementById('menuToggle').addEventListener('click', toggleMenu);
  
  // Configurar modo oscuro
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
  }
};

const toggleMenu = () => {
  const nav = document.getElementById('mainNav');
  nav.classList.toggle('active');
};

const toggleDarkMode = () => {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
};

const initNotifications = () => {
  // Lógica para notificaciones
};

const initDarkMode = () => {
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  }
};

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
